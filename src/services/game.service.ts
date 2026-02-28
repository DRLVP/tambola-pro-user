import api from './api';
import type { Game, ApiResponse, PaginatedResponse } from '@/types';

export const gameService = {
  // Get all games with optional filters
  async getGames(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Game>> {
    const response = await api.get('/games', { params });
    return response.data;
  },

  // Get single game by ID
  async getGame(id: string): Promise<ApiResponse<Game>> {
    const response = await api.get(`/games/${id}`);
    return response.data;
  },

  // Get available games for lobby
  async getAvailableGames(): Promise<ApiResponse<Game[]>> {
    const response = await api.get('/games/available');
    return response.data;
  },

  // Get active/live games
  async getActiveGames(): Promise<ApiResponse<Game[]>> {
    const response = await api.get('/games/active');
    return response.data;
  },

  // Get game results (with winners)
  async getGameResults(id: string): Promise<ApiResponse<Game>> {
    const response = await api.get(`/games/${id}/results`);
    return response.data;
  },
};

export default gameService;
