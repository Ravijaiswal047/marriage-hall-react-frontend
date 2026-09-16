import { apiClient } from '@/lib/api/client';
import type { HallRequestDTO, HallSearchParams, SpringPage } from '@/types/api';
import type { Hall } from '@/types/common';

export const hallsApi = {
  getHalls: async (params: HallSearchParams): Promise<SpringPage<Hall>> => {
    const res = await apiClient.get<SpringPage<Hall>>('/halls', { params });
    return res.data;
  },

  getCities: async (): Promise<string[]> => {
    const res = await apiClient.get<string[]>('/halls/cities');
    return res.data;
  },

  createHall: async (data: HallRequestDTO): Promise<Hall> => {
    const res = await apiClient.post<Hall>('/halls/create-hall', data);
    return res.data;
  },

  getHallById: async (hallId: string): Promise<Hall> => {
    const res = await apiClient.get<Hall>(`/halls/${hallId}`);
    return res.data;
  },

  getVendorHalls: async (vendorId: string): Promise<Hall[]> => {
    const res = await apiClient.get<Hall[]>(`/halls/vendor/${vendorId}`);
    return res.data;
  },

  updateHall: async (hallId: string, data: HallRequestDTO): Promise<Hall> => {
    const res = await apiClient.put<Hall>(`/halls/${hallId}`, data);
    return res.data;
  },

  deleteHall: async (hallId: string): Promise<void> => {
    await apiClient.delete(`/halls/${hallId}`);
  },
};

