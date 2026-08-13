import type {
  MeResponse,
  SuccessResponse,
  UsersResponse,
  UpdateUserPermissionsRequest,
  UpdateUserPermissionsResponse,
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

export const updatePermissions = async (
  idOrName: string,
  data: UpdateUserPermissionsRequest
): Promise<UpdateUserPermissionsResponse> => {
  const response = await api.put<
    SuccessResponse<UpdateUserPermissionsResponse>
  >(`/users/${encodeURIComponent(idOrName)}/permissions`, data);

  if (!response.data.data) {
    throw new Error('Response data is missing');
  }

  return response.data.data;
};
