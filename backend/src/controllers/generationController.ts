import { Request, Response, NextFunction } from 'express';
import { createGeneration, getGenerationById, getGenerationsByUserId, updateGenerationStatus } from '../models/Generation.js';
import { createError } from '../middleware/errorHandler.js';
import { validateUpload } from '../middleware/upload.js';
import { CreateGenerationRequest, Generation } from '../../../shared/src/generation.js';
import { v4 as uuidv4 } from 'uuid';

export const generationController = {
  async createGeneration(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate uploaded file
      validateUpload(req, res, next);

      if (!req.user) {
        throw createError('User not authenticated', 401, 'NOT_AUTHENTICATED');
      }

      const { prompt, style } = req.body as CreateGenerationRequest;
      const imageFile = req.file!;

      // Create generation record
      const generation = await createGeneration({
        userId: req.user.id,
        prompt,
        style,
        originalImageUrl: imageFile.publicUrl,
      });

      // Start async generation process
      processGenerationAsync(generation.id);

      res.status(201).json({
        success: true,
        data: { generation },
        message: 'Generation started successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  async getGenerations(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw createError('User not authenticated', 401, 'NOT_AUTHENTICATED');
      }

      const { limit, offset } = req.query as { limit: number; offset: number };

      const generations = await getGenerationsByUserId(req.user.id, limit, offset);

      res.status(200).json({
        success: true,
        data: {
          generations,
          total: generations.length,
          limit,
          offset,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getGenerationById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw createError('User not authenticated', 401, 'NOT_AUTHENTICATED');
      }

      const { id } = req.params;

      const generation = await getGenerationById(id);

      if (!generation) {
        throw createError('Generation not found', 404, 'GENERATION_NOT_FOUND');
      }

      // Ensure the generation belongs to the authenticated user
      if (generation.userId !== req.user.id) {
        throw createError('Access denied', 403, 'ACCESS_DENIED');
      }

      res.status(200).json({
        success: true,
        data: { generation },
      });
    } catch (error) {
      next(error);
    }
  },
};

// Async function to simulate the generation process
async function processGenerationAsync(generationId: string) {
  try {
    // Simulate processing delay (1-2 seconds)
    const delay = Math.random() * 1000 + 1000; // 1000-2000ms
    await new Promise(resolve => setTimeout(resolve, delay));

    // 20% chance of "model overloaded" error
    const shouldFail = Math.random() < 0.2;

    if (shouldFail) {
      await updateGenerationStatus(
        generationId,
        'failed',
        null,
        'Model overloaded, please try again later'
      );
    } else {
      // Generate mock result image URL
      const mockImageUrl = `https://picsum.photos/seed/${uuidv4()}/512/512.jpg`;

      await updateGenerationStatus(
        generationId,
        'completed',
        mockImageUrl,
        null
      );
    }
  } catch (error) {
    console.error('Error processing generation:', error);
    await updateGenerationStatus(
      generationId,
      'failed',
      null,
      'Generation processing failed'
    );
  }
}