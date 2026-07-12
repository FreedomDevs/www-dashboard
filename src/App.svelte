<script lang="ts">
  import { Route, Router } from "svelte-routing";
  import { Toaster } from "svelte-sonner";
  import ErrorPage from "./components/ErrorPage.svelte";
  import "./app.css";
  import "./toast.css";
  import SideBar from "./components/SideBar.svelte";
  import Users from "./pages/Users.svelte";
  import Main from "./pages/Main.svelte";
</script>

<Router let:location>
  <Toaster
    theme="dark"
    position="top-center"
    richColors
    toastOptions={{
      class: "toast",
    }}
  />

  <svelte:boundary>
    <SideBar />
    <Route path="/"><Main /></Route>
    <Route path="/users"><Users /></Route>

    {#snippet failed(error, reset)}
      <ErrorPage {error} {reset} />
    {/snippet}
  </svelte:boundary>
</Router>
