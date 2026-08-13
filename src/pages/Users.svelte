<script lang="ts">
  import { Loader } from '@lucide/svelte';

  import { usersMutation } from '@/libs/api/mutations/getAllUsersMutation';
  import { updateUserPermissionsMutation } from '@/libs/api/mutations/updateUserPermissionsMutation';

  import type { User } from '@/libs/api/data';

  import UsersTable from '@/components/users/UsersTable.svelte';
  import PermissionsModal from '@/components/users/PermissionsModal.svelte';

  const mutation = usersMutation();
  const updateMutation = updateUserPermissionsMutation();

  let users: User[] = [];

  let editingUser: User | null = null;
  let editingPermissions: Record<string, string[]> = {};

  let isLoading = true;
  let loadError: unknown = null;

  async function loadUsers() {
    isLoading = true;
    loadError = null;

    try {
      const response = await mutation.mutateAsync(null);

      users = response.users;
    } catch (error) {
      loadError = error;
    } finally {
      isLoading = false;
    }
  }

  loadUsers();

  function openPermissions(user: User) {
    editingUser = user;

    editingPermissions = Object.fromEntries(
      Object.entries(user.permissions).map(([service, permissions]) => [
        service,
        [...permissions],
      ])
    );
  }

  function closePermissions() {
    if (updateMutation.isPending) {
      return;
    }

    editingUser = null;
    editingPermissions = {};
  }

  function hasPermission(service: string, permission: string): boolean {
    return editingPermissions[service]?.includes(permission) ?? false;
  }

  function togglePermission(service: string, permission: string) {
    const current = editingPermissions[service] ?? [];

    if (current.includes(permission)) {
      const next = current.filter((item) => item !== permission);

      if (next.length === 0) {
        const rest = { ...editingPermissions };

        delete rest[service];

        editingPermissions = rest;
      } else {
        editingPermissions = {
          ...editingPermissions,
          [service]: next,
        };
      }

      return;
    }

    editingPermissions = {
      ...editingPermissions,
      [service]: [...current, permission],
    };
  }

  async function savePermissions() {
    if (!editingUser) {
      return;
    }

    try {
      const response = await updateMutation.mutateAsync({
        idOrName: editingUser.id,

        data: {
          permissions: editingPermissions,
        },
      });

      const updatedAt = new Date().toISOString();

      users = users.map((user) => {
        if (user.id !== editingUser?.id) {
          return user;
        }

        return {
          ...user,
          permissions: response.permissions,
          updatedAt,
        };
      });

      editingUser = {
        ...editingUser,
        permissions: response.permissions,
        updatedAt,
      };

      editingPermissions = Object.fromEntries(
        Object.entries(response.permissions).map(([service, permissions]) => [
          service,
          [...permissions],
        ])
      );

      closePermissions();
    } catch (error) {
      console.error('Failed to update permissions:', error);
    }
  }
</script>

<section>
  {#if isLoading}
    <div class="loading">
      <Loader size={32} class="loader" />
      <span>Загрузка пользователей...</span>
    </div>
  {:else if loadError}
    <div class="error">
      <p>Не удалось загрузить пользователей</p>

      {#if loadError instanceof Error}
        <span>{loadError.message}</span>
      {:else}
        <span>Произошла неизвестная ошибка</span>
      {/if}
    </div>
  {:else}
    <UsersTable {users} onOpenPermissions={openPermissions} />
  {/if}
</section>

{#if editingUser}
  <PermissionsModal
    user={editingUser}
    permissions={editingPermissions}
    isPending={updateMutation.isPending}
    onClose={closePermissions}
    onTogglePermission={togglePermission}
    onSave={savePermissions}
    {hasPermission}
  />
{/if}

<style>
  section {
    flex: 1;
    min-width: 0;
    min-height: 100vh;
    padding: 1.5rem;
    background-color: var(--background);
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    min-height: 200px;
    color: var(--gray);
  }

  .loader {
    animation: spin 1s linear infinite;
  }

  .error {
    padding: 1rem;
    border: 1px solid var(--error);
    border-radius: 0.5rem;
    background-color: color-mix(in srgb, var(--error) 10%, transparent);
    color: var(--error);
  }

  .error p {
    margin: 0 0 0.3rem;
    font-weight: 600;
  }

  .error span {
    font-size: 0.8rem;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
</style>
