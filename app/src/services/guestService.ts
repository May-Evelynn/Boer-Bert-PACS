import api from './api';
import { Guest, PaginatedResponse } from '../types';

export const guestService = {
  async getGuests(page = 1, limit = 10): Promise<PaginatedResponse<Guest>> {
    const response = await api.get<PaginatedResponse<Guest>>('/guests', {
      params: { page, limit }
    });
    return response.data;
  },

  async getGuestById(id: string): Promise<Guest> {
    const response = await api.get<Guest>(`/guests/${id}`);
    return response.data;
  },

  async createGuest(data: Partial<Guest>): Promise<Guest> {
    const response = await api.post<Guest>('/guests', data);
    return response.data;
  },

  async updateGuest(id: string, data: Partial<Guest>): Promise<Guest> {
    const response = await api.put<Guest>(`/guests/${id}`, data);
    return response.data;
  },

  async deleteGuest(id: string): Promise<void> {
    await api.delete(`/guests/${id}`);
  }
};
