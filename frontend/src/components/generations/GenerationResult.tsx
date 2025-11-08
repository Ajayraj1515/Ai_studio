import { Generation } from '@shared/generation';

interface GenerationResultProps {
  generation: Generation | null;
  isGenerating: boolean;
}

export function GenerationResult({ generation, isGenerating }: GenerationResultProps) {
  if (isGenerating) {
    return (
      <div className="aspect-square rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Generating your design...</p>
          <p className="text-sm text-gray-500 mt-2">This usually takes 1-2 seconds</p>
        </div>
      </div>
    );
  }

  if (generation) {
    const isError = generation.status === 'failed';
    const isPending = generation.status === 'pending';

    if (isError) {
      return (
        <div className="aspect-square rounded-lg bg-red-50 border-2 border-red-200 flex items-center justify-center">
          <div className="text-center p-6">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800 font-medium mb-2">Generation Failed</p>
            <p className="text-sm text-red-600">
              {generation.errorMessage || 'Something went wrong. Please try again.'}
            </p>
          </div>
        </div>
      );
    }

    if (isPending) {
      return (
        <div className="aspect-square rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-pulse">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">Processing...</p>
          </div>
        </div>
      );
    }

    if (generation.generatedImageUrl) {
      return (
        <div className="relative">
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
            <img
              src={generation.generatedImageUrl}
              alt="Generated result"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            Generated
          </div>
        </div>
      );
    }
  }

  return (
    <div className="aspect-square rounded-lg bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center">
      <div className="text-center p-6">
        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-gray-600 font-medium">No generation yet</p>
        <p className="text-sm text-gray-500 mt-2">Upload an image and click Generate to start</p>
      </div>
    </div>
  );
}