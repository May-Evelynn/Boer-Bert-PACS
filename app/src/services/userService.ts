import api from './api';
import { CreateUserData } from '../types';

export const userService = {
  async createUser(data: CreateUserData): Promise<void> {
    await api.post('/admin/create-user', data);
  }
};
