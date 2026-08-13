<script lang="ts">
  import { Shield } from '@lucide/svelte';

  import type { User } from '@/libs/api/data';

  let {
    users,
    onOpenPermissions,
  }: {
    users: User[];
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
        <th>Ник</th>
        <th>UUID</th>
        <th>Права</th>
        <th>Группы</th>
        <th>Создан</th>
        <th>Изменён</th>
      </tr>
    </thead>

    <tbody>
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
              {#each user.groups as group (group.id)}
                <span class="group">
                  {group.name}
                </span>
              {/each}
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
</style>
