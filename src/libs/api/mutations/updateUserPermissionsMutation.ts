import {
  createMutation,
  type CreateMutationOptions,
} from '@tanstack/svelte-query';

import type {
  ErrorResponse,
  UpdateUserPermissionsRequest,
  UpdateUserPermissionsResponse,
} from '../data';

import { updatePermissions } from '../users';

export interface UpdateUserPermissionsVariables {
  idOrName: string;
  data: UpdateUserPermissionsRequest;
}

export function updateUserPermissionsMutation(
  options?: Omit<
    CreateMutationOptions<
      UpdateUserPermissionsResponse,
      ErrorResponse,
      UpdateUserPermissionsVariables
    >,
    'mutationKey' | 'mutationFn'
  >
) {
  return createMutation(() => ({
    mutationKey: ['user-permissions'],
    mutationFn: ({ idOrName, data }: UpdateUserPermissionsVariables) =>
      updatePermissions(idOrName, data),
    ...options,
  }));
}
