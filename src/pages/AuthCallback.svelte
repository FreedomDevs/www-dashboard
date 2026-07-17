<script>
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';
  import { RefreshManager } from '@/libs/refreshManager';

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    const refreshToken = params.get('token');

    if (!refreshToken) {
      navigate('/');
      return;
    }

    RefreshManager.set(refreshToken);
    navigate('/');
  });
</script>

<div>Авторизация пожалуйста подождите</div>
