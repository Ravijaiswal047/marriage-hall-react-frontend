import { apiClient } from '@/lib/api/client';
import type {
  AuthResponseDTO,
  LoginRequestDTO,
  SignupRequestDTO,
  UserProfileResponseDTO,
} from '@/types/api';

export const authApi = {
  signup: async (data: SignupRequestDTO): Promise<AuthResponseDTO> => {
    const res = await apiClient.post<AuthResponseDTO>('/auth/signup', data);
    return res.data;
  },

  login: async (data: LoginRequestDTO): Promise<AuthResponseDTO> => {
    const res = await apiClient.post<AuthResponseDTO>('/auth/login', data);
    return res.data;
  },

  getCurrentUser: async (): Promise<UserProfileResponseDTO> => {
    const res = await apiClient.get<UserProfileResponseDTO>('/auth/me');
    return res.data;
  },
};

