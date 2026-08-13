<script lang="ts">
  import { ArrowDown, ArrowUp, ArrowUpDown, Shield } from '@lucide/svelte';

  import type { User } from '@/libs/api/data';

  let {
    users,
    sortBy,
    sortDirection,
    onSort,
    onOpenPermissions,
  }: {
    users: User[];
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    onSort: (field: string) => void;
    onOpenPermissions: (user: User) => void;
  } = $props();

  function countPermissions(permissions: Record<string, string[]>): number {
    return Object.values(permissions).reduce(
      (total, items) => total + items.length,
      0
    );
  }
</script>

<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th>
          <button
            class="sort-button"
            type="button"
            onclick={() => onSort('name')}
          >
            <span>Ник</span>

            {#if sortBy !== 'name'}
              <ArrowUpDown size={14} />
            {:else if sortDirection === 'asc'}
              <ArrowUp size={14} />
            {:else}
              <ArrowDown size={14} />
            {/if}
          </button>
        </th>
        <th>
          <button
            class="sort-button"
            type="button"
            onclick={() => onSort('id')}
          >
            <span>UUID</span>

            {#if sortBy !== 'id'}
              <ArrowUpDown size={14} />
            {:else if sortDirection === 'asc'}
              <ArrowUp size={14} />
            {:else}
              <ArrowDown size={14} />
            {/if}
          </button>
        </th>
        <th>
          <button
            class="sort-button"
            type="button"
            onclick={() => onSort('permissions')}
          >
            <span>Права</span>

            {#if sortBy !== 'permissions'}
              <ArrowUpDown size={14} />
            {:else if sortDirection === 'asc'}
              <ArrowUp size={14} />
            {:else}
              <ArrowDown size={14} />
            {/if}
          </button>
        </th>
        <th>
          <button
            class="sort-button"
            type="button"
            onclick={() => onSort('groups')}
          >
            <span>Группы</span>

            {#if sortBy !== 'groups'}
              <ArrowUpDown size={14} />
            {:else if sortDirection === 'asc'}
              <ArrowUp size={14} />
            {:else}
              <ArrowDown size={14} />
            {/if}
          </button>
        </th>
        <th>
          <button
            class="sort-button"
            type="button"
            onclick={() => onSort('createdAt')}
          >
            <span>Создан</span>

            {#if sortBy !== 'createdAt'}
              <ArrowUpDown size={14} />
            {:else if sortDirection === 'asc'}
              <ArrowUp size={14} />
            {:else}
              <ArrowDown size={14} />
            {/if}
          </button>
        </th>
        <th>
          <button
            class="sort-button"
            type="button"
            onclick={() => onSort('updatedAt')}
          >
            <span>Изменён</span>

            {#if sortBy !== 'updatedAt'}
              <ArrowUpDown size={14} />
            {:else if sortDirection === 'asc'}
              <ArrowUp size={14} />
            {:else}
              <ArrowDown size={14} />
            {/if}
          </button>
        </th>
      </tr>
    </thead>

    <tbody>
      {#if users.length === 0}
        <tr>
          <td colspan="6" class="empty"> Пользователи не найдены </td>
        </tr>
      {:else}
        {#each users as user (user.id)}
          <tr>
            <td>
              <span class="username">
                {user.name}
              </span>
            </td>
            <td>
              <code>{user.id}</code>
            </td>
            <td>
              <button
                class="permissions-button"
                type="button"
                onclick={() => onOpenPermissions(user)}
              >
                <Shield size={14} />

                <span>
                  {countPermissions(user.permissions)}
                </span>

                <span class="permissions-label"> прав </span>
              </button>
            </td>
            <td>
              <div class="groups">
                {#if user.groups.length === 0}
                  <span class="no-groups"> Нет групп </span>
                {:else}
                  {#each user.groups as group (group.id)}
                    <span class="group">
                      {group.name}
                    </span>
                  {/each}
                {/if}
              </div>
            </td>
            <td>
              {new Date(user.createdAt).toLocaleString('ru-RU')}
            </td>
            <td>
              {new Date(user.updatedAt).toLocaleString('ru-RU')}
            </td>
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</div>

<style>
  .table-wrapper {
    width: 100%;
    overflow-x: auto;

    border: 1px solid #222;
    border-radius: 0.6rem;
  }

  table {
    width: 100%;
    min-width: 1000px;

    color: var(--white);

    border-collapse: collapse;
  }

  th,
  td {
    padding: 0.7rem 1rem;

    text-align: left;

    border-bottom: 1px solid #222;
  }

  th {
    background-color: #111;

    color: var(--primary);

    font-size: 0.85rem;
    font-weight: 600;

    white-space: nowrap;
  }

  td {
    background-color: #050505;

    font-size: 0.85rem;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody tr {
    transition: background-color 150ms ease;
  }

  tbody tr:hover td {
    background-color: #0b0b0b;
  }

  .sort-button {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;

    padding: 0;

    border: none;

    background: transparent;

    color: inherit;

    font: inherit;

    cursor: pointer;

    user-select: none;

    transition: color 150ms ease;
  }

  .sort-button:hover {
    color: var(--white);
  }

  .sort-button:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 3px;

    border-radius: 0.2rem;
  }

  .username {
    color: var(--white);

    font-weight: 600;
  }

  code {
    color: var(--gray);

    font-family: monospace;
    font-size: 0.75rem;
  }

  .permissions-button {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;

    padding: 0.35rem 0.55rem;

    border: 1px solid color-mix(in srgb, var(--primary) 25%, transparent);

    border-radius: 0.4rem;

    background-color: color-mix(in srgb, var(--primary) 8%, transparent);

    color: var(--primary);

    font-size: 0.75rem;
    font-weight: 600;

    cursor: pointer;

    transition:
      background-color 150ms ease,
      border-color 150ms ease;
  }

  .permissions-button:hover {
    background-color: color-mix(in srgb, var(--primary) 15%, transparent);

    border-color: color-mix(in srgb, var(--primary) 45%, transparent);
  }

  .permissions-button:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }

  .permissions-label {
    color: var(--gray);

    font-weight: 400;
  }

  .groups {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .group {
    padding: 0.2rem 0.45rem;

    border-radius: 0.3rem;

    background-color: #151515;

    color: var(--gray);

    font-size: 0.75rem;
  }

  .no-groups {
    color: var(--gray);

    font-size: 0.75rem;
    font-style: italic;
  }

  .empty {
    padding: 2rem;

    text-align: center;

    color: var(--gray);
  }
</style>
