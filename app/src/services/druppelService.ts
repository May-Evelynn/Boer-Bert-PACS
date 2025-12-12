import api from './api';
import { Druppel, PaginatedResponse } from '../types';

export const druppelService = {
  async getDruppels(page = 1, limit = 10): Promise<PaginatedResponse<Druppel>> {
    const response = await api.get<PaginatedResponse<Druppel>>('/druppels', {
      params: { page, limit }
    });
    return response.data;
  },

  async getDruppelById(id: string): Promise<Druppel> {
    const response = await api.get<Druppel>(`/druppels/${id}`);
    return response.data;
  },

  async createDruppel(data: Partial<Druppel>): Promise<Druppel> {
    const response = await api.post<Druppel>('/druppels', data);
    return response.data;
  },

  async updateDruppel(id: string, data: Partial<Druppel>): Promise<Druppel> {
    const response = await api.put<Druppel>(`/druppels/${id}`, data);
    return response.data;
  },

  async deleteDruppel(id: string): Promise<void> {
    await api.delete(`/druppels/${id}`);
  }
};
