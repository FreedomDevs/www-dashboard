<script>
  import { onMount } from 'svelte';
  import { RefreshManager } from '@/libs/refreshManager';

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    const refreshToken = params.get('token');

    if (!refreshToken) {
      window.location.href = '/';
      return;
    }

    RefreshManager.set(refreshToken);
    window.location.href = '/';
  });
</script>

<div>Авторизация пожалуйста подождите</div>
