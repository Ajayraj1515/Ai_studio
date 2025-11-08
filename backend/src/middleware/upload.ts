import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createError } from './errorHandler.js';

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `img-${uniqueSuffix}${ext}`);
  },
});

// File filter for images only
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG and PNG images are allowed'), false);
  }
};

// Configure upload middleware
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1, // Only one file allowed
  },
});

// Middleware to validate uploaded file
export function validateUpload(req: any, res: any, next: any) {
  if (!req.file) {
    return next(createError('Image file is required', 400, 'MISSING_FILE'));
  }

  // Additional validation if needed
  const file = req.file;
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (file.size > maxSize) {
    // Clean up uploaded file
    fs.unlinkSync(file.path);
    return next(createError('File size must be less than 10MB', 400, 'FILE_TOO_LARGE'));
  }

  // Generate public URL for the uploaded file
  const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
  file.publicUrl = `${baseUrl}/uploads/${file.filename}`;

  next();
}