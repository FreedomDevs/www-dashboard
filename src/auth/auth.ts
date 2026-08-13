import { writable } from 'svelte/store';

import { checkRefreshTokenMutation } from '../libs/api/mutations/checkRefreshTokenMutation';
import { createRefreshMutation } from '../libs/api/mutations/createRefreshMutation';
import { meMutation } from '../libs/api/mutations/meMutation';
import { AccessManager } from '../libs/accessManager';
import { RefreshManager } from '../libs/refreshManager';
import { ssoConfig } from '../config/sso.config';

export const authLoading = writable(true);

type InitAuthParams = {
  refreshMutation: ReturnType<typeof createRefreshMutation>;
  checkMutation: ReturnType<typeof checkRefreshTokenMutation>;
  userMutation: ReturnType<typeof meMutation>;
};

export async function initAuth({
                                 refreshMutation,
                                 checkMutation,
                               }: InitAuthParams) {
  const refreshToken = RefreshManager.get();

  if (!refreshToken) {
    redirectToSSO();
    return;
  }

  try {
    await checkMutation.mutateAsync({
      refresh_token: refreshToken,
    });

    const { token } = await refreshMutation.mutateAsync({
      method: 'Web',
      refresh_token: refreshToken,
    });

    AccessManager.set(token);
    authLoading.set(false);

  } catch (error) {
    console.error('Authentication initialization failed:', error);
    redirectToSSO();
  }
}

function redirectToSSO() {
  console.log('Redirecting to SSO');
  window.location.href = ssoConfig.ssoCompareUrl;
}