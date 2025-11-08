import { getDatabase } from '../database/setup.js';
import { v4 as uuidv4 } from 'uuid';
import { Generation, CreateGenerationRequest, Style } from '../../../shared/src/generation.js';

export interface CreateGenerationData extends CreateGenerationRequest {
  userId: string;
  originalImageUrl: string;
}

export async function createGeneration(data: CreateGenerationData): Promise<Generation> {
  const db = getDatabase();
  const id = uuidv4();

  const stmt = db.prepare(`
    INSERT INTO generations (id, user_id, prompt, style, original_image_url, status)
    VALUES (?, ?, ?, ?, ?, 'pending')
  `);

  stmt.run(id, data.userId, data.prompt, data.style, data.originalImageUrl);

  const generation = await getGenerationById(id);
  if (!generation) {
    throw new Error('Failed to create generation');
  }

  return generation;
}

export async function getGenerationById(id: string): Promise<Generation | null> {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT
      id,
      user_id,
      prompt,
      style,
      original_image_url as originalImageUrl,
      generated_image_url as generatedImageUrl,
      status,
      error_message as errorMessage,
      created_at as createdAt,
      completed_at as completedAt
    FROM generations
    WHERE id = ?
  `);

  const row = stmt.get(id) as any;
  if (!row) return null;

  return {
    id: row.id,
    userId: row.user_id,
    prompt: row.prompt,
    style: row.style,
    originalImageUrl: row.originalImageUrl,
    generatedImageUrl: row.generatedImageUrl,
    status: row.status,
    errorMessage: row.errorMessage,
    createdAt: row.createdAt,
    completedAt: row.completedAt,
  };
}

export async function getGenerationsByUserId(
  userId: string,
  limit: number = 5,
  offset: number = 0
): Promise<Generation[]> {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT
      id,
      user_id,
      prompt,
      style,
      original_image_url as originalImageUrl,
      generated_image_url as generatedImageUrl,
      status,
      error_message as errorMessage,
      created_at as createdAt,
      completed_at as completedAt
    FROM generations
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `);

  const rows = stmt.all(userId, limit, offset) as any[];
  return rows.map(row => ({
    id: row.id,
    userId: row.user_id,
    prompt: row.prompt,
    style: row.style,
    originalImageUrl: row.originalImageUrl,
    generatedImageUrl: row.generatedImageUrl,
    status: row.status,
    errorMessage: row.errorMessage,
    createdAt: row.createdAt,
    completedAt: row.completedAt,
  }));
}

export async function updateGenerationStatus(
  id: string,
  status: 'completed' | 'failed',
  generatedImageUrl: string | null = null,
  errorMessage: string | null = null
): Promise<Generation | null> {
  const db = getDatabase();
  const stmt = db.prepare(`
    UPDATE generations
    SET
      status = ?,
      generated_image_url = ?,
      error_message = ?,
      completed_at = ?
    WHERE id = ?
  `);

  const result = stmt.run(
    status,
    generatedImageUrl,
    errorMessage,
    new Date().toISOString(),
    id
  );

  if (result.changes === 0) {
    return null;
  }

  return await getGenerationById(id);
}

export async function countUserGenerations(userId: string): Promise<number> {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT COUNT(*) as count
    FROM generations
    WHERE user_id = ?
  `);

  const result = stmt.get(userId) as { count: number };
  return result.count;
}