import api from './api';
import { Facility, FacilitiesResponse } from '../types';

export const facilityService = {
  async getFacilities(): Promise<Facility[]> {
    const response = await api.get<FacilitiesResponse>('/facility/facilities');
    return response.data.facilities;
  },

  async createFacility(facilityType: string, capacity: number): Promise<void> {
    await api.put('/facility/create-facility', { facilityType, capacity });
  },

  async deleteFacility(id: number): Promise<void> {
    await api.delete(`/facility/delete-facility/${id}`);
  }
};
