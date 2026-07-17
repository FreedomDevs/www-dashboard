import { writable } from 'svelte/store';
import { checkRefreshTokenMutation } from '../libs/api/mutations/checkRefreshTokenMutation';
import { createRefreshMutation } from '../libs/api/mutations/createRefreshMutation';
import { AccessManager } from '../libs/accessManager';
import { meMutation } from '../libs/api/mutations/meMutation';
import { navigate } from 'svelte-routing';
import { RefreshManager } from '../libs/refreshManager';

export const authLoading = writable(true);

export const BASE_VIEW_PERM_KEY: string = 'dashboard';
export const BASE_VIEW_PERM_VAL: string = 'view';

export async function initAuth() {
  const refreshToken = RefreshManager.get();

  console.log(`refresh token: ${refreshToken}`);

  if (refreshToken) {
    try {
      const refreshMutation = checkRefreshTokenMutation();

      await refreshMutation.mutateAsync({
        refresh_token: refreshToken,
      });

      console.log('refresh token valid');

      try {
        const accessMutation = createRefreshMutation();

        const { token } = await accessMutation.mutateAsync({
          method: 'Web',
          refresh_token: refreshToken,
        });

        AccessManager.set(token);

        console.log(`access token: ${token}`);

        try {
          const userMut = meMutation();

          const { permissions } = await userMut.mutateAsync(null);

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
  console.log('Redirect to SSO');
}
