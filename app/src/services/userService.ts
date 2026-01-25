import api from './api';
import { CreateUserData } from '../types';

export const userService = {
  async createUser(data: CreateUserData): Promise<void> {
    await api.post('/admin/create-user', data);
  },

  async getUsers(): Promise<any[]> {
    const response = await api.get('/users');
    return response.data.users.map((u: any) => ({ ...u, id: u.user_id }));
  },

  async updateUser(id: number, data: Partial<any>): Promise<void> {
    await api.put(`/users/update-user/${id}`, data);
  },

  async deleteUser(id: number): Promise<void> {
    await api.delete(`/users/delete-user/${id}`);
  }
};
