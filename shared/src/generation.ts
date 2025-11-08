import { z } from 'zod';

export const StyleEnum = z.enum(['photorealistic', 'artistic', 'minimalist', 'vintage']);

export const CreateGenerationSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(500, 'Prompt must be less than 500 characters'),
  style: StyleEnum,
});

export const GenerationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  prompt: z.string(),
  style: z.string(),
  originalImageUrl: z.string().url(),
  generatedImageUrl: z.string().url().nullable(),
  status: z.enum(['pending', 'completed', 'failed']),
  errorMessage: z.string().nullable(),
  createdAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable(),
});

export type CreateGenerationRequest = z.infer<typeof CreateGenerationSchema>;
export type Generation = z.infer<typeof GenerationSchema>;
export type Style = z.infer<typeof StyleEnum>;

export interface GenerationResponse {
  generation: Generation;
  message: string;
}

export interface GenerationsListResponse {
  generations: Generation[];
  total: number;
}

export interface GenerationError {
  error: string;
  code: string;
  retryable: boolean;
}