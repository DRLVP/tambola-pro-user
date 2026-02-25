import api from './api';
import type { User, ApiResponse, PaginatedResponse } from '@/types';

export const userService = {
  // Get current user profile
  async getProfile(): Promise<ApiResponse<User>> {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update user profile
  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  // Get user's game history
  async getGameHistory(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<{ gameId: string; gameName: string; result: string; amount: number; playedAt: string }>> {
    const response = await api.get('/users/game-history', { params });
    return response.data;
  },

  // Get user's winnings
  async getWinnings(): Promise<ApiResponse<{ total: number; breakdown: { pattern: string; count: number; amount: number }[] }>> {
    const response = await api.get('/users/winnings');
    return response.data;
  },

  // Admin: Get all users
  async getAllUsers(params?: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<User>> {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  // Admin: Get user by ID
  async getUser(id: string): Promise<ApiResponse<User>> {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  // Admin: Update user
  async updateUser(id: string, data: Partial<User>): Promise<ApiResponse<User>> {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
  },

  // Admin: Ban/unban user
  async toggleUserBan(id: string, banned: boolean): Promise<ApiResponse<User>> {
    const response = await api.post(`/admin/users/${id}/ban`, { banned });
    return response.data;
  },

  // Admin: Delete user
  async deleteUser(id: string): Promise<ApiResponse<null>> {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },
};

export default userService;
