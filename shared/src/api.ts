import { z } from 'zod';

export const ApiErrorSchema = z.object({
  error: z.string(),
  code: z.string(),
  details: z.record(z.any()).optional(),
});

export const SuccessResponseSchema = z.object({
  success: z.literal(true),
  data: z.any(),
});

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  code: z.string(),
  details: z.record(z.any()).optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;
export type SuccessResponse<T = any> = { success: true; data: T };
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}