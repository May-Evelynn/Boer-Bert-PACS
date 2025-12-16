import api from './api';
import { Scan, ScansResponse } from '../types';

export interface LogScanData {
  tag_id: number;
  location_id: number;
  inout: 'in' | 'out';
}

export const scanService = {
  async getScans(): Promise<Scan[]> {
    const response = await api.get<ScansResponse>('/druppel/scans');
    return response.data.scans;
  },

  async logScan(data: LogScanData): Promise<void> {
    await api.post('/druppel/scans', data);
  }
};
