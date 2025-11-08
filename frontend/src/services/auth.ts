import { apiClient } from './api';
import { LoginRequest, SignupRequest, User, AuthResponse } from '@shared/auth';

export class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<{ user: User; accessToken: string }>('/api/auth/login', credentials);

    // Store access token
    localStorage.setItem('accessToken', response.data.accessToken);

    return {
      user: response.data.user,
      message: 'Login successful',
    };
  }

  async signup(userData: SignupRequest): Promise<AuthResponse> {
    const response = await apiClient.post<{ user: User; accessToken: string }>('/api/auth/signup', userData);

    // Store access token
    localStorage.setItem('accessToken', response.data.accessToken);

    return {
      user: response.data.user,
      message: 'Account created successfully',
    };
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout');
    } finally {
      // Always clear local token
      localStorage.removeItem('accessToken');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get<{ user: User }>('/api/auth/me');
      return response.data.user;
    } catch (error) {
      // If we can't get the current user, clear the token
      localStorage.removeItem('accessToken');
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }
}

export const authService = new AuthService();