import { useState } from 'react';
import { UploadArea } from '@/components/generations/UploadArea';
import { PromptInput } from '@/components/generations/PromptInput';
import { StyleSelector } from '@/components/generations/StyleSelector';
import { GenerateButton } from '@/components/generations/GenerateButton';
import { GenerationHistory } from '@/components/generations/GenerationHistory';
import { GenerationResult } from '@/components/generations/GenerationResult';
import { useGenerations } from '@/hooks/useGenerations';
import { CreateGenerationRequest, Generation, Style } from '@shared/generation';

export function StudioPage() {
  const { generations, createGeneration } = useGenerations();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<Style>('photorealistic');
  const [currentGeneration, setCurrentGeneration] = useState<Generation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleGenerate = async () => {
    if (!selectedFile || !prompt.trim()) return;

    setIsGenerating(true);
    try {
      const requestData: CreateGenerationRequest = {
        prompt: prompt.trim(),
        style,
      };

      await createGeneration.mutateAsync({
        data: requestData,
        imageFile: selectedFile,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerationSelect = (generation: Generation) => {
    setCurrentGeneration(generation);
    setPrompt(generation.prompt);
    setStyle(generation.style as Style);
    // Note: We can't restore the file from the URL, but we can restore the other fields
  };

  const canGenerate = selectedFile && prompt.trim().length > 0 && !isGenerating;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Studio</h1>
            <p className="text-gray-600">
              Upload an image, add a creative prompt, and generate stunning fashion designs.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Generation Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upload and Result Display */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Original Image</h3>
                  <UploadArea
                    selectedFile={selectedFile}
                    onFileSelect={handleFileSelect}
                    disabled={isGenerating}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Generated Result</h3>
                  <GenerationResult
                    generation={currentGeneration}
                    isGenerating={isGenerating}
                  />
                </div>
              </div>

              {/* Generation Controls */}
              <div className="card space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prompt
                  </label>
                  <PromptInput
                    value={prompt}
                    onChange={setPrompt}
                    disabled={isGenerating}
                    placeholder="Describe your fashion design (e.g., 'Elegant evening gown with floral patterns')"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Style
                  </label>
                  <StyleSelector
                    value={style}
                    onChange={setStyle}
                    disabled={isGenerating}
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <GenerateButton
                    onClick={handleGenerate}
                    disabled={!canGenerate}
                    isLoading={isGenerating}
                  />

                  {isGenerating && (
                    <button
                      onClick={() => setIsGenerating(false)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* History Sidebar */}
            <div className="lg:col-span-1">
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Recent Generations</h3>
                <GenerationHistory
                  generations={generations}
                  onSelect={handleGenerationSelect}
                  selectedId={currentGeneration?.id}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}