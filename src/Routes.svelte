<script>
  import { Route } from 'svelte-routing';
  import SideBar from './components/SideBar.svelte';
  import Main from './pages/Main.svelte';
  import Users from './pages/Users.svelte';
  import ErrorPage from './components/ErrorPage.svelte';
  import Server from './pages/Server.svelte';
</script>

<svelte:boundary>
  <SideBar />

  <Route path="/">
    <Main />
  </Route>

  <Route path="/users">
    <Users />
  </Route>

  <Route path="/server">
    <Server />
  </Route>

  {#snippet failed(error, reset)}
    <ErrorPage {error} {reset} />
  {/snippet}
</svelte:boundary>
