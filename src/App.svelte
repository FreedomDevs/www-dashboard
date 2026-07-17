<script lang="ts">
  import { Route, Router } from 'svelte-routing';
  import { Toaster } from 'svelte-sonner';
  import ErrorPage from './components/ErrorPage.svelte';
  import './app.css';
  import './toast.css';
  import SideBar from './components/SideBar.svelte';
  import Users from './pages/Users.svelte';
  import Main from './pages/Main.svelte';
  import AuthGate from '@/auth/AuthGate.svelte';
  import AuthCallback from '@/pages/AuthCallback.svelte';
  import { QueryClientProvider } from '@tanstack/svelte-query';
  import { queryClient } from '@/libs/queryClient';
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

    <AuthGate>
      <svelte:boundary>
        <SideBar />

        <Route path="/">
          <Main />
        </Route>

        <Route path="/users">
          <Users />
        </Route>

        {#snippet failed(error, reset)}
          <ErrorPage {error} {reset} />
        {/snippet}
      </svelte:boundary>
    </AuthGate>
  </Router>
</QueryClientProvider>
