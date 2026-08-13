import type {
  MeResponse,
  SuccessResponse,
  UsersResponse,
} from '@/libs/api/data';
import { api } from '@/libs/api';

export const me = async (): Promise<MeResponse> => {
  const response = await api.get<SuccessResponse<MeResponse>>('/users/me');

  if (!response.data.data) {
    throw new Error('Response data is missing');
  }

  return response.data.data;
};

export const getAll = async (): Promise<UsersResponse> => {
  const response = await api.get<SuccessResponse<UsersResponse>>('/users');

  if (!response.data.data) {
    throw new Error('Response data is missing');
  }

  return response.data.data;
};
