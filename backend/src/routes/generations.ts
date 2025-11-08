import { Router } from 'express';
import { generationController } from '../controllers/generationController.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { validateBody, validateQuery } from '../middleware/validation.js';
import { CreateGenerationSchema } from '../../../shared/src/generation.js';
import { z } from 'zod';

const router = Router();

// Apply authentication to all generation routes
router.use(authenticateToken);

// Query validation schema for getting generations
const GetGenerationsQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(20).default(5),
  offset: z.coerce.number().min(0).default(0),
});

// POST /api/generations
router.post(
  '/',
  upload.single('image'),
  validateBody(CreateGenerationSchema),
  generationController.createGeneration
);

// GET /api/generations
router.get(
  '/',
  validateQuery(GetGenerationsQuerySchema),
  generationController.getGenerations
);

// GET /api/generations/:id
router.get('/:id', generationController.getGenerationById);

export { router as generationRoutes };