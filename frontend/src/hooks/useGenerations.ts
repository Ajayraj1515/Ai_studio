import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Generation, CreateGenerationRequest } from '@shared/generation';
import { generationsService } from '@/services/generations';
import toast from 'react-toastify';

export function useGenerations() {
  const queryClient = useQueryClient();

  const {
    data: generations = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['generations'],
    queryFn: () => generationsService.getGenerations(5),
    staleTime: 1000 * 30, // 30 seconds
    refetchOnWindowFocus: false,
  });

  const createGeneration = useMutation({
    mutationFn: ({ data, imageFile }: { data: CreateGenerationRequest; imageFile: File }) =>
      generationsService.createGeneration(data, imageFile),
    onSuccess: (newGeneration) => {
      // Add the new generation to the cache
      queryClient.setQueryData(['generations'], (old: Generation[] = []) => [newGeneration, ...old.slice(0, 4)]);

      // Start polling for updates
      generationsService.pollGenerationStatus(newGeneration.id, (updatedGeneration) => {
        queryClient.setQueryData(['generations'], (old: Generation[] = []) => {
          const index = old.findIndex(g => g.id === updatedGeneration.id);
          if (index !== -1) {
            const updated = [...old];
            updated[index] = updatedGeneration;
            return updated;
          }
          return old;
        });

        // Show toast when generation completes or fails
        if (updatedGeneration.status === 'completed') {
          toast.success('Image generated successfully!');
        } else if (updatedGeneration.status === 'failed') {
          toast.error(updatedGeneration.errorMessage || 'Generation failed');
        }
      });

      toast.success('Generation started!');
    },
    onError: (error: any) => {
      console.error('Generation creation error:', error);
      // Error toast is handled by the API client
    },
  });

  const refreshGenerations = () => {
    queryClient.invalidateQueries({ queryKey: ['generations'] });
  };

  return {
    generations,
    isLoading,
    error,
    createGeneration,
    refreshGenerations,
  };
}

export function useGeneration(id: string) {
  return useQuery({
    queryKey: ['generation', id],
    queryFn: () => generationsService.getGenerationById(id),
    enabled: !!id,
    staleTime: 1000 * 30, // 30 seconds
  });
}