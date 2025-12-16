import api from './api';
import { AuthResponse, ChangePasswordResponse, LoginCredentials, User } from '../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', {
      username: credentials.username,
      password: credentials.password
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  async changePassword(username: string, oldPassword: string, newPassword: string): Promise<ChangePasswordResponse> {
    const response = await api.post('/auth/change-password', {
      username,
      oldPassword,
      newPassword
    });
    return response.data;
  }
};
