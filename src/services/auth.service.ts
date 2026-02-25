import api from './api';
import type { Roles } from '@/types/globals';

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    role: Roles;
    userId: string;
  };
}

/**
 * Auth service for role assignment and user synchronization
 */
export const authService = {
  /**
   * Assign a role to the current user
   * This should be called after sign-in based on the route used
   */
  async assignRole(role: Roles): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/assign-role', { role });
      console.log("response after assign role::", response.data);

      return response.data;
    } catch (error) {
      console.error('Failed to assign role:', error);
      throw error;
    }
  },

  /**
   * Sync user data with backend after sign-in
   * Creates user in database if not exists
   */
  async syncUser(userData: {
    clerkId: string;
    email: string;
    name: string;
  }): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/sync-user', userData);
      console.log("response after syncing user from backend::", response.data);

      return response.data;
    } catch (error) {
      console.error('Failed to sync user:', error);
      throw error;
    }
  },

  /**
   * Sync admin data with backend after sign-in
   * Creates admin in database if not exists
   */
  async syncAdmin(adminData: {
    clerkId: string;
    email: string;
    name: string;
  }): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/sync-admin', adminData);
      return response.data;
    } catch (error) {
      console.error('Failed to sync admin:', error);
      throw error;
    }
  },

  /**
   * Verify current user's role
   */
  async verifyRole(): Promise<{ role: Roles | null }> {
    try {
      const response = await api.get<{ role: Roles | null }>('/auth/verify-role');
      return response.data;
    } catch (error) {
      console.error('Failed to verify role:', error);
      return { role: null };
    }
  },
};

export default authService;
