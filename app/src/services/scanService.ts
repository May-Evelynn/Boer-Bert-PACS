import api from './api';
import { Scan, PaginatedResponse } from '../types';

export const scanService = {
  async getRecentScans(limit = 10): Promise<Scan[]> {
    const response = await api.get<Scan[]>('/scans/recent', {
      params: { limit }
    });
    return response.data;
  },

  async getAllScans(page = 1, limit = 10): Promise<PaginatedResponse<Scan>> {
    const response = await api.get<PaginatedResponse<Scan>>('/scans', {
      params: { page, limit }
    });
    return response.data;
  }
};
