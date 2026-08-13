<script lang="ts">
  import { Loader, Search, X } from '@lucide/svelte';

  import { usersMutation } from '@/libs/api/mutations/getAllUsersMutation';
  import { updateUserPermissionsMutation } from '@/libs/api/mutations/updateUserPermissionsMutation';

  import type { User } from '@/libs/api/data';

  import UsersTable from '@/components/users/UsersTable.svelte';
  import PermissionsModal from '@/components/users/PermissionsModal.svelte';

  const mutation = usersMutation();
  const updateMutation = updateUserPermissionsMutation();

  let users = $state<User[]>([]);

  let editingUser = $state<User | null>(null);

  let editingPermissions = $state<Record<string, string[]>>({});

  let isLoading = $state(true);
  let loadError = $state<unknown>(null);

  let search = $state('');

  let sortBy = $state('name');
  let sortDirection = $state<'asc' | 'desc'>('asc');

  async function loadUsers() {
    isLoading = true;
    loadError = null;

    try {
      const response = await mutation.mutateAsync(null);

      users = response.users;
    } catch (error) {
      console.error('Failed to load users:', error);

      loadError = error;
    } finally {
      isLoading = false;
    }
  }

  loadUsers();

  function countPermissions(permissions: Record<string, string[]>): number {
    return Object.values(permissions).reduce(
      (total, items) => total + items.length,
      0
    );
  }

  function getSearchText(user: User): string {
    return [user.name, user.id, ...user.groups.map((group) => group.name)]
      .join(' ')
      .toLowerCase();
  }

  let filteredUsers = $derived.by(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) => getSearchText(user).includes(query));
  });

  let sortedUsers = $derived.by(() => {
    const result = [...filteredUsers];

    result.sort((a, b) => {
      let valueA: string | number;
      let valueB: string | number;

      switch (sortBy) {
        case 'name':
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;

        case 'id':
          valueA = a.id.toLowerCase();
          valueB = b.id.toLowerCase();
          break;

        case 'permissions':
          valueA = countPermissions(a.permissions);
          valueB = countPermissions(b.permissions);
          break;

        case 'groups':
          valueA = a.groups.length;
          valueB = b.groups.length;
          break;

        case 'createdAt':
          valueA = new Date(a.createdAt).getTime();
          valueB = new Date(b.createdAt).getTime();
          break;

        case 'updatedAt':
          valueA = new Date(a.updatedAt).getTime();
          valueB = new Date(b.updatedAt).getTime();
          break;

        default:
          return 0;
      }

      if (valueA < valueB) {
        return sortDirection === 'asc' ? -1 : 1;
      }

      if (valueA > valueB) {
        return sortDirection === 'asc' ? 1 : -1;
      }

      return 0;
    });

    return result;
  });

  function handleSort(field: string) {
    if (sortBy === field) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';

      return;
    }

    sortBy = field;
    sortDirection = 'asc';
  }

  function clearSearch() {
    search = '';
  }

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
        const rest = {
          ...editingPermissions,
        };

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

      <span> Загрузка пользователей... </span>
    </div>
  {:else if loadError}
    <div class="error">
      <p>Не удалось загрузить пользователей</p>

      {#if loadError instanceof Error}
        <span>
          {loadError.message}
        </span>
      {:else}
        <span> Произошла неизвестная ошибка </span>
      {/if}
    </div>
  {:else}
    <div class="toolbar">
      <div class="search">
        <Search size={17} />

        <input
          type="text"
          bind:value={search}
          placeholder="Поиск пользователей..."
          aria-label="Поиск пользователей"
        />

        {#if search}
          <button
            type="button"
            class="clear-search"
            onclick={clearSearch}
            aria-label="Очистить поиск"
          >
            <X size={15} />
          </button>
        {/if}
      </div>

      <div class="results">
        {#if search}
          Найдено:
          <strong>
            {sortedUsers.length}
          </strong>
        {:else}
          Всего:
          <strong>
            {users.length}
          </strong>
        {/if}
      </div>
    </div>

    <UsersTable
      users={sortedUsers}
      {sortBy}
      {sortDirection}
      onSort={handleSort}
      onOpenPermissions={openPermissions}
    />
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

  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: 1rem;

    margin-bottom: 1rem;
  }

  .search {
    display: flex;
    align-items: center;

    gap: 0.6rem;

    width: min(100%, 420px);
    height: 40px;

    padding: 0 0.7rem;

    border: 1px solid #222;
    border-radius: 0.5rem;

    background-color: #050505;

    color: var(--gray);

    transition:
      border-color 150ms ease,
      box-shadow 150ms ease;
  }

  .search:focus-within {
    border-color: color-mix(in srgb, var(--primary) 50%, transparent);

    box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 8%, transparent);
  }

  .search input {
    width: 100%;
    min-width: 0;

    border: none;
    outline: none;

    background: transparent;

    color: var(--white);

    font-size: 0.85rem;
  }

  .search input::placeholder {
    color: var(--gray);
  }

  .clear-search {
    display: flex;
    align-items: center;
    justify-content: center;

    flex-shrink: 0;

    padding: 0.2rem;

    border: none;
    border-radius: 0.25rem;

    background: transparent;

    color: var(--gray);

    cursor: pointer;
  }

  .clear-search:hover {
    color: var(--white);
    background-color: #151515;
  }

  .results {
    color: var(--gray);

    font-size: 0.8rem;

    white-space: nowrap;
  }

  .results strong {
    color: var(--white);
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

  @media (max-width: 700px) {
    .toolbar {
      align-items: stretch;
      flex-direction: column;
    }

    .search {
      width: 100%;
    }
  }
</style>
