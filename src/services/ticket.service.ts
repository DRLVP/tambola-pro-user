import api from './api';
import type { Ticket, ApiResponse, PaginatedResponse, PurchaseTicketForm } from '@/types';

export const ticketService = {
  // Get user's tickets
  async getMyTickets(params?: {
    gameId?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Ticket>> {
    const response = await api.get('/tickets/my', { params });
    return response.data;
  },

  // Get ticket by ID
  async getTicket(id: string): Promise<ApiResponse<Ticket>> {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  // Purchase tickets
  async purchaseTickets(data: PurchaseTicketForm): Promise<ApiResponse<Ticket[]>> {
    const response = await api.post('/tickets/purchase', data);
    return response.data;
  },

  // Mark number on ticket
  async markNumber(ticketId: string, number: number): Promise<ApiResponse<Ticket>> {
    const response = await api.post(`/tickets/${ticketId}/mark`, { number });
    return response.data;
  },
};

export default ticketService;
