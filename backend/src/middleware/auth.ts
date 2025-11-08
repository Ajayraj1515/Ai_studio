import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createError } from './errorHandler.js';
import { getUserById } from '../models/User.js';
import { JWTPayload } from '../../../shared/src/auth.js';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
      };
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw createError('Access token required', 401, 'MISSING_TOKEN');
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    const user = await getUserById(decoded.userId);
    if (!user) {
      throw createError('User not found', 401, 'USER_NOT_FOUND');
    }

    // Attach user info to request
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(createError('Invalid or expired token', 401, 'INVALID_TOKEN'));
    } else {
      next(error);
    }
  }
}

export function generateTokens(userId: string, email: string) {
  const accessToken = jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
}