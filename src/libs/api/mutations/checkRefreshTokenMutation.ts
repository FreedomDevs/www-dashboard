import {
  createMutation,
  type CreateMutationOptions,
} from '@tanstack/svelte-query';

import type {
  CheckRefreshTokenRequest,
  ErrorResponse,
  SuccessResponse,
} from '../data';
import { checkRefreshToken } from '../auth';

export function checkRefreshTokenMutation(
  options?: Omit<
    CreateMutationOptions<
      SuccessResponse<null>,
      ErrorResponse,
      CheckRefreshTokenRequest
    >,
    'mutationKey' | 'mutationFn'
  >
) {
  return createMutation(() => ({
    mutationKey: ['check_refresh'],
    mutationFn: checkRefreshToken,
    ...options,
  }));
}
