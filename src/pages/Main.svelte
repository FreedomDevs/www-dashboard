<script lang="ts">
  import { Loader } from '@lucide/svelte';

  import { meMutation } from '@/libs/api/mutations/meMutation';
  import AdminDashboard from '@/components/dashboard/AdminDashboard.svelte';
  import UserDashboard from '@/components/dashboard/UserDashboard.svelte';

  const mutation = meMutation();

  const user = mutation.mutateAsync(null);

  function hasPermission(
    permissions: Record<string, string[]>,
    permission: string
  ) {
    const [resource, action] = permission.split(':');

    return permissions[resource]?.includes(action) ?? false;
  }
</script>

{#await user}
  <section class="loading">
    <Loader size={32} class="loader" />
    <span>Загрузка...</span>
  </section>
{:then response}
  {#if hasPermission(response.permissions, 'dashboard:admin')}
    <AdminDashboard />
  {:else}
    <UserDashboard />
  {/if}
{:catch error}
  <section class="error">Не удалось загрузить данные пользователя</section>
{/await}

<style>
  section {
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    padding-bottom: 10rem;

    min-height: 100vh;
    width: 100%;
    box-sizing: border-box;

    color: #fff;
    background-color: var(--background);
  }
  h2 {
    font-size: 2.5rem;
  }
</style>
