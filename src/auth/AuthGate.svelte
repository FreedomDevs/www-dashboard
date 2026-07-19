<script lang="ts">
  import { onMount } from 'svelte';

  import { authLoading } from './auth';
  import { initAuth } from './auth';
  import { createRefreshMutation } from '@/libs/api/mutations/createRefreshMutation';
  import { checkRefreshTokenMutation } from '@/libs/api/mutations/checkRefreshTokenMutation';
  import { meMutation } from '@/libs/api/mutations/meMutation';

  const refreshMutation = createRefreshMutation();
  const checkMutation = checkRefreshTokenMutation();
  const userMutation = meMutation();

  onMount(async () => {
    await initAuth({
      refreshMutation,
      checkMutation,
      userMutation,
    });
  });
</script>

{#if $authLoading}
  <div class="loading">Проверяем авторизацию...</div>
{:else}
  <slot />
{/if}
