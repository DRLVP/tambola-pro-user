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
};

export default userService;
