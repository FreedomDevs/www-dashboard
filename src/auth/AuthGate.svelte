<script lang="ts">
  import { onMount } from 'svelte';

  import { authLoading } from './auth';
  import { initAuth } from './auth';

  onMount(async () => {
    await initAuth();
  });
</script>

{#if $authLoading}
  <div class="loading">Проверяем авторизацию...</div>
{:else}
  <slot />
{/if}
