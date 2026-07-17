import {
  createMutation,
  type CreateMutationOptions,
} from '@tanstack/svelte-query';

import type { ErrorResponse, MeResponse } from '../data';
import { me } from '../users';

export function meMutation(
  options?: Omit<
    CreateMutationOptions<MeResponse, ErrorResponse, null>,
    'mutationKey' | 'mutationFn'
  >
) {
  return createMutation(() => ({
    mutationKey: ['me'],
    mutationFn: me,
    ...options,
  }));
}
