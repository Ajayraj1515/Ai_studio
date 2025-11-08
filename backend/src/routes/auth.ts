import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { validateBody } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';
import { LoginSchema, SignupSchema } from '../../../shared/src/auth.js';

const router = Router();

// POST /api/auth/signup
router.post('/signup', validateBody(SignupSchema), authController.signup);

// POST /api/auth/login
router.post('/login', validateBody(LoginSchema), authController.login);

// POST /api/auth/logout
router.post('/logout', authController.logout);

// GET /api/auth/me
router.get('/me', authController.getCurrentUser);

export { router as authRoutes };