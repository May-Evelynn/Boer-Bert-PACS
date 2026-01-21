import api from './api';
import { Keyfob, KeyfobsResponse } from '../types';

export interface AttachUserData {
  userId: number;
  keyfobId: number;
}

export interface DetachUserData {
  keyfobId: number;
}

export interface SetKeyfobKeyData {
  keyfobId: number;
  newKey: number;
}

export interface InitKeyfobData {
  keyfob_key: number;
}

export interface SetBuitengebruikData {
  keyfobId: number;
  buitengebruik: boolean;
}

export interface ToggleKeyfobData {
  toggle: 0 | 1;
}

export const druppelService = {
  async getKeyfobs(): Promise<Keyfob[]> {
    const response = await api.get<KeyfobsResponse>('/druppel/keyfobs');
    return response.data.keyfobs;
  },

  async attachUserToKeyfob(data: AttachUserData): Promise<void> {
    await api.put('/druppel/attach-user', data);
  },

  async detachUserFromKeyfob(data: DetachUserData): Promise<void> {
    await api.put('/druppel/detach-user', data);
  },

  async setKeyfobKey(data: SetKeyfobKeyData): Promise<void> {
    await api.put('/druppel/set-keyfob-key', data);
  },

  async initKeyfob(data: InitKeyfobData): Promise<void> {
    await api.put('/druppel/init-keyfob', data);
  },

  async toggleKeyfob(keyfobId: number, data: ToggleKeyfobData): Promise<void> {
    await api.patch(`/druppel/toggle-keyfob/${keyfobId}`, data);
  },

  async attachUser(userId: number, keyfobId: number): Promise<void> {
    await api.put('/druppel/attach-user', { userId, keyfobId });
  }
};
