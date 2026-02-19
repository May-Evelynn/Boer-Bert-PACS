import api from './api';
import { Facility, FacilitiesResponse } from '../types';

export interface UpdateFacilityData {
  facilityType: string;
  capacity: number;
  active: boolean;
  broken: boolean;
}

export const facilityService = {
  async getFacilities(): Promise<Facility[]> {
    const response = await api.get<FacilitiesResponse>('/facility/facilities');
    return response.data.facilities;
  },

  async createFacility(facilityType: string, capacity: number): Promise<void> {
    await api.put('/facility/create-facility', { facilityType, capacity });
  },

  async updateFacility(id: number, data: UpdateFacilityData): Promise<void> {
    await api.put(`/facility/update-facility/${id}`, data);
  },

  async deleteFacility(id: number): Promise<void> {
    await api.delete(`/facility/delete-facility/${id}`);
  }
};
