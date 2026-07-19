import type { MeResponse, SuccessResponse } from '@/libs/api/data';
import { api } from '@/libs/api';

export const me = async (): Promise<MeResponse> => {
  const response = await api.get<SuccessResponse<MeResponse>>('/users/me');

  if (!response.data.data) {
    throw new Error('Response data is missing');
  }

  return response.data.data;
};
