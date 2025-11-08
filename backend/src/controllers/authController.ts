import { Request, Response, NextFunction } from 'express';
import { createUser, getUserByEmail, verifyPassword } from '../models/User.js';
import { generateTokens } from '../middleware/auth.js';
import { createError } from '../middleware/errorHandler.js';
import { authenticateToken } from '../middleware/auth.js';
import { User, LoginRequest, SignupRequest } from '../../../shared/src/auth.js';

export const authController = {
  async signup(req: Request<{}, {}, SignupRequest>, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;

      // Check if user already exists
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        throw createError('Email already registered', 409, 'EMAIL_EXISTS');
      }

      // Create new user
      const user = await createUser({ email, password, name });

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(user.id, user.email);

      // Set refresh token in httpOnly cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Return user data and access token
      res.status(201).json({
        success: true,
        data: {
          user,
          accessToken,
        },
        message: 'Account created successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request<{}, {}, LoginRequest>, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await getUserByEmail(email);
      if (!user) {
        throw createError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
      }

      // Verify password
      const isValidPassword = await verifyPassword(password, user.password_hash);
      if (!isValidPassword) {
        throw createError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
      }

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(user.id, user.email);

      // Set refresh token in httpOnly cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Return user data and access token (exclude password hash)
      const { password_hash: _, ...userWithoutPassword } = user;

      res.status(200).json({
        success: true,
        data: {
          user: userWithoutPassword,
          accessToken,
        },
        message: 'Login successful',
      });
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // Clear refresh token cookie
      res.clearCookie('refreshToken');

      res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      next(error);
    }
  },

  async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      // This route should be protected by authentication middleware
      if (!req.user) {
        throw createError('User not authenticated', 401, 'NOT_AUTHENTICATED');
      }

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: req.user.id,
            email: req.user.email,
            name: req.user.name,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },
};