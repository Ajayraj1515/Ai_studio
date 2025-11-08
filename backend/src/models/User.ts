import { getDatabase } from '../database/setup.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { User } from '../../../shared/src/auth.js';

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
}

export async function createUser(userData: CreateUserData): Promise<User> {
  const db = getDatabase();
  const id = uuidv4();
  const hashedPassword = await bcrypt.hash(userData.password, 12);

  const stmt = db.prepare(`
    INSERT INTO users (id, email, password_hash, name)
    VALUES (?, ?, ?, ?)
  `);

  try {
    stmt.run(id, userData.email.toLowerCase(), hashedPassword, userData.name);
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      throw new Error('Email already exists');
    }
    throw error;
  }

  const user = await getUserById(id);
  if (!user) {
    throw new Error('Failed to create user');
  }

  return user;
}

export async function getUserByEmail(email: string): Promise<(User & { password_hash: string }) | null> {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT id, email, password_hash, name, created_at, updated_at
    FROM users
    WHERE email = ?
  `);

  const row = stmt.get(email.toLowerCase()) as any;
  if (!row) return null;

  return {
    id: row.id,
    email: row.email,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    password_hash: row.password_hash,
  };
}

export async function getUserById(id: string): Promise<User | null> {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT id, email, name, created_at, updated_at
    FROM users
    WHERE id = ?
  `);

  const row = stmt.get(id) as any;
  if (!row) return null;

  return {
    id: row.id,
    email: row.email,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}