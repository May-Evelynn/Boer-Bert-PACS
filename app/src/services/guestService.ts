import api from './api';

export interface Guest {
  user_id: number;
  id: number;
  first_name: string;
  last_name: string;
  affix?: string;
}

export interface GuestsResponse {
  guests: Guest[];
}

export interface CreateGuestData {
  first_name: string;
  last_name: string;
  affix?: string;
}

export const guestService = {
  async getGuests(): Promise<Guest[]> {
    const response = await api.get<GuestsResponse>('/guests');
    return response.data.guests.map(g => ({ ...g, id: g.user_id }));
  },

  async createGuest(data: CreateGuestData): Promise<void> {
    await api.post('/guests', data);
  },

  async updateGuest(id: number, data: Partial<CreateGuestData>): Promise<void> {
    await api.put(`/guests/${id}`, data);
  },

  async deleteGuest(id: number): Promise<void> {
    await api.delete(`/guests/${id}`);
  }
};
