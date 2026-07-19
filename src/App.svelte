<script lang="ts">
  import { Route, Router } from 'svelte-routing';
  import { Toaster } from 'svelte-sonner';
  import './app.css';
  import './toast.css';
  import AuthGate from '@/auth/AuthGate.svelte';
  import AuthCallback from '@/pages/AuthCallback.svelte';
  import { QueryClientProvider } from '@tanstack/svelte-query';
  import { queryClient } from '@/libs/queryClient';
  import Routes from './Routes.svelte';
</script>

<QueryClientProvider client={queryClient}>
  <Router>
    <Toaster
      theme="dark"
      position="top-center"
      richColors
      toastOptions={{
        class: 'toast',
      }}
    />

    <Route path="/auth/callback">
      <AuthCallback />
    </Route>

    {#if !globalThis.NOAUTH}
      <AuthGate>
        <Routes />
      </AuthGate>
    {:else}
      <Routes />
    {/if}
  </Router>
</QueryClientProvider>
