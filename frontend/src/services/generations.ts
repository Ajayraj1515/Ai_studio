import { apiClient } from './api';
import { CreateGenerationRequest, Generation, GenerationsListResponse } from '@shared/generation';

export class GenerationsService {
  async createGeneration(data: CreateGenerationRequest, imageFile: File): Promise<Generation> {
    const formData = new FormData();
    formData.append('prompt', data.prompt);
    formData.append('style', data.style);
    formData.append('image', imageFile);

    const response = await apiClient.upload<{ generation: Generation }>('/api/generations', formData);

    return response.data.generation;
  }

  async getGenerations(limit: number = 5, offset: number = 0): Promise<Generation[]> {
    const response = await apiClient.get<{ generations: Generation[] }>('/api/generations', {
      limit,
      offset,
    });

    return response.data.generations;
  }

  async getGenerationById(id: string): Promise<Generation | null> {
    try {
      const response = await apiClient.get<{ generation: Generation }>(`/api/generations/${id}`);
      return response.data.generation;
    } catch (error) {
      return null;
    }
  }

  // Poll for generation status updates
  async pollGenerationStatus(id: string, onUpdate: (generation: Generation) => void): Promise<void> {
    const poll = async () => {
      try {
        const generation = await this.getGenerationById(id);
        if (generation) {
          onUpdate(generation);

          // Stop polling if generation is completed or failed
          if (generation.status === 'completed' || generation.status === 'failed') {
            return;
          }
        }

        // Continue polling
        setTimeout(poll, 2000); // Poll every 2 seconds
      } catch (error) {
        // Stop polling on error
        console.error('Error polling generation status:', error);
      }
    };

    poll();
  }
}

export const generationsService = new GenerationsService();