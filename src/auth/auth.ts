import { writable } from 'svelte/store';
import { checkRefreshTokenMutation } from '../libs/api/mutations/checkRefreshTokenMutation';
import { createRefreshMutation } from '../libs/api/mutations/createRefreshMutation';
import { AccessManager } from '../libs/accessManager';
import { meMutation } from '../libs/api/mutations/meMutation';
import { navigate } from 'svelte-routing';
import { RefreshManager } from '../libs/refreshManager';
import { ssoConfig } from '../config/sso.config';

export const authLoading = writable(true);

export const BASE_VIEW_PERM_KEY: string = 'dashboard';
export const BASE_VIEW_PERM_VAL: string = 'view';

type InitAuthParams = {
  refreshMutation: ReturnType<typeof createRefreshMutation>;
  checkMutation: ReturnType<typeof checkRefreshTokenMutation>;
  userMutation: ReturnType<typeof meMutation>;
};

export async function initAuth({
  refreshMutation,
  checkMutation,
  userMutation,
}: InitAuthParams) {
  const refreshToken = RefreshManager.get();

  console.log(`refresh token: ${refreshToken}`);

  if (refreshToken) {
    try {

      await checkMutation.mutateAsync({
        refresh_token: refreshToken,
      });

      console.log('refresh token valid');

      try {
        const { token } = await refreshMutation.mutateAsync({
          method: 'Web',
          refresh_token: refreshToken,
        });

        AccessManager.set(token);

        console.log(`access token: ${token}`);

        try {
          const { permissions } = await userMutation.mutateAsync(null);

          let isAccess = false;

          if (permissions[BASE_VIEW_PERM_KEY]) {
            for (const key of permissions[BASE_VIEW_PERM_KEY]) {
              if (key === BASE_VIEW_PERM_VAL) {
                isAccess = true;
                break;
              }
            }
          }

          if (!isAccess) {
            navigate('/forbiden');
            return;
          }

          authLoading.set(false);
        } catch (e) {
          console.log(e);
          redirectToSSO();
          return;
        }
      } catch (e) {
        console.log(e);
        redirectToSSO();
        return;
      }
    } catch (e) {
      console.log(e);
      redirectToSSO();
      return;
    }
  } else {
    redirectToSSO();
    return;
  }

  authLoading.set(false);
}

function redirectToSSO() {
  // window.location.href = ssoConfig.ssoCompareUrl;
  console.log('Redirect to SSO');
}
