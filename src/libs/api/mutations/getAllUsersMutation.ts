import {
  createMutation,
  type CreateMutationOptions,
} from '@tanstack/svelte-query';

import type { ErrorResponse, UsersResponse } from '../data';
import { getAll } from '../users';

export function usersMutation(
  options?: Omit<
    CreateMutationOptions<UsersResponse, ErrorResponse, null>,
    'mutationKey' | 'mutationFn'
  >
) {
  return createMutation(() => ({
    mutationKey: ['users'],
    mutationFn: getAll,
    ...options,
  }));
}
