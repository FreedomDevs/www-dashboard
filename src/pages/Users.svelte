<script lang="ts">
  import { Loader, X, Shield, Check } from '@lucide/svelte';

  import { usersMutation } from '@/libs/api/mutations/getAllUsersMutation';
  import { updateUserPermissionsMutation } from '@/libs/api/mutations/updateUserPermissionsMutation';

  import { roles } from '@/libs/api/roles';

  import type { User } from '@/libs/api/data';

  const mutation = usersMutation();
  const updateMutation = updateUserPermissionsMutation();

  let users: User[] = [];

  let editingUser: User | null = null;
  let editingPermissions: Record<string, string[]> = {};

  const usersPromise = mutation.mutateAsync(null);

  usersPromise.then((response) => {
    users = response.users;
  });

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
        const { [service]: _, ...rest } = editingPermissions;

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

      users = users.map((user) => {
        if (user.id !== editingUser?.id) {
          return user;
        }

        return {
          ...user,
          permissions: response.permissions,
          updatedAt: new Date().toISOString(),
        };
      });

      editingUser = {
        ...editingUser,
        permissions: response.permissions,
        updatedAt: new Date().toISOString(),
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

  function countPermissions(permissions: Record<string, string[]>): number {
    return Object.values(permissions).reduce(
      (total, items) => total + items.length,
      0
    );
  }

  function countSelectedPermissions(): number {
    return countPermissions(editingPermissions);
  }
</script>

<section>
  {#await usersPromise}
    <div class="loading">
      <Loader size={32} class="loader" />

      <span> Загрузка пользователей... </span>
    </div>
  {:then}
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
                <code>
                  {user.id}
                </code>
              </td>

              <td>
                <button
                  class="permissions-button"
                  type="button"
                  onclick={() => openPermissions(user)}
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
  {:catch e}
    <div class="error">
      <p>Не удалось загрузить пользователей</p>

      {#if e instanceof Error}
        <span>
          {e.message}
        </span>
      {:else}
        <span> Произошла неизвестная ошибка </span>
      {/if}
    </div>
  {/await}
</section>

{#if editingUser}
  <div
    class="modal-backdrop"
    role="presentation"
    onclick={(event) => {
      if (event.target === event.currentTarget) {
        closePermissions();
      }
    }}
  >
    <div
      class="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="permissions-title"
    >
      <div class="modal-header">
        <div>
          <div class="modal-title-row">
            <Shield size={20} />

            <h2 id="permissions-title">Права пользователя</h2>
          </div>

          <p>
            {editingUser.name}
          </p>
        </div>

        <button
          class="close-button"
          type="button"
          aria-label="Закрыть"
          disabled={updateMutation.isPending}
          onclick={closePermissions}
        >
          <X size={20} />
        </button>
      </div>

      <div class="modal-content">
        {#each Object.entries(roles) as [service, permissions]}
          <div class="permission-service">
            <div class="service-header">
              <div>
                <h3>
                  {service}
                </h3>

                <span>
                  {Object.keys(permissions).length}
                  доступных прав
                </span>
              </div>

              <span class="service-selected">
                {editingPermissions[service]?.length ?? 0}
                выбрано
              </span>
            </div>

            <div class="permission-list">
              {#each Object.entries(permissions) as [permission, description]}
                <label class="permission-option">
                  <input
                    type="checkbox"
                    checked={hasPermission(service, permission)}
                    disabled={updateMutation.isPending}
                    onchange={() => togglePermission(service, permission)}
                  />

                  <span class="checkbox">
                    {#if hasPermission(service, permission)}
                      <Check size={13} />
                    {/if}
                  </span>

                  <span class="permission-info">
                    <span class="permission-name">
                      {permission}
                    </span>

                    <span class="permission-description">
                      {description}
                    </span>
                  </span>
                </label>
              {/each}
            </div>
          </div>
        {/each}
      </div>

      <div class="modal-footer">
        <div class="selected-count">
          Выбрано:

          <strong>
            {countSelectedPermissions()}
          </strong>
        </div>

        <div class="modal-actions">
          <button
            class="cancel-button"
            type="button"
            disabled={updateMutation.isPending}
            onclick={closePermissions}
          >
            Отмена
          </button>

          <button
            class="save-button"
            type="button"
            disabled={updateMutation.isPending}
            onclick={savePermissions}
          >
            {#if updateMutation.isPending}
              <Loader size={16} class="loader" />

              Сохранение...
            {:else}
              Сохранить
            {/if}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  section {
    flex: 1;

    min-width: 0;
    min-height: 100vh;

    padding: 1.5rem;

    background-color: var(--background);
  }

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

  /* Modal */

  .modal-backdrop {
    position: fixed;
    z-index: 1000;

    inset: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 1.5rem;

    background-color: rgba(0, 0, 0, 0.7);

    backdrop-filter: blur(6px);
  }

  .modal {
    display: flex;
    flex-direction: column;

    width: min(720px, 100%);
    max-height: min(800px, calc(100vh - 3rem));

    overflow: hidden;

    border: 1px solid #292929;
    border-radius: 0.8rem;

    background-color: #080808;

    box-shadow:
      0 20px 60px rgba(0, 0, 0, 0.5),
      0 0 0 1px rgba(255, 255, 255, 0.02);
  }

  .modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    gap: 1rem;

    padding: 1.25rem 1.4rem;

    border-bottom: 1px solid #222;
  }

  .modal-title-row {
    display: flex;
    align-items: center;

    gap: 0.55rem;

    color: var(--primary);
  }

  .modal-title-row h2 {
    margin: 0;

    color: var(--white);

    font-size: 1rem;
    font-weight: 600;
  }

  .modal-header p {
    margin: 0.35rem 0 0;

    color: var(--gray);

    font-size: 0.8rem;
  }

  .close-button {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 32px;
    height: 32px;

    padding: 0;

    border: none;
    border-radius: 0.4rem;

    background-color: transparent;

    color: var(--gray);

    cursor: pointer;

    transition:
      background-color 150ms ease,
      color 150ms ease;
  }

  .close-button:hover:not(:disabled) {
    background-color: #151515;
    color: var(--white);
  }

  .modal-content {
    flex: 1;

    overflow-y: auto;

    padding: 1rem;
  }

  .permission-service {
    overflow: hidden;

    margin-bottom: 0.75rem;

    border: 1px solid #222;
    border-radius: 0.6rem;

    background-color: #0c0c0c;
  }

  .permission-service:last-child {
    margin-bottom: 0;
  }

  .service-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: 1rem;

    padding: 0.8rem 0.9rem;

    border-bottom: 1px solid #202020;
  }

  .service-header h3 {
    margin: 0;

    color: var(--white);

    font-family: monospace;
    font-size: 0.85rem;
  }

  .service-header span {
    color: var(--gray);

    font-size: 0.7rem;
  }

  .service-header > div {
    display: flex;
    flex-direction: column;

    gap: 0.15rem;
  }

  .service-selected {
    padding: 0.2rem 0.45rem;

    border-radius: 0.3rem;

    background-color: color-mix(in srgb, var(--primary) 10%, transparent);

    color: var(--primary) !important;
  }

  .permission-list {
    display: flex;
    flex-direction: column;
  }

  .permission-option {
    display: flex;
    align-items: center;

    gap: 0.75rem;

    padding: 0.7rem 0.9rem;

    border-bottom: 1px solid #181818;

    cursor: pointer;

    transition: background-color 120ms ease;
  }

  .permission-option:last-child {
    border-bottom: none;
  }

  .permission-option:hover {
    background-color: #111;
  }

  .permission-option input {
    position: absolute;

    width: 1px;
    height: 1px;

    opacity: 0;
    pointer-events: none;
  }

  .checkbox {
    display: flex;
    align-items: center;
    justify-content: center;

    flex-shrink: 0;

    width: 18px;
    height: 18px;

    border: 1px solid #444;
    border-radius: 0.3rem;

    background-color: #090909;

    color: var(--white);

    transition:
      background-color 120ms ease,
      border-color 120ms ease;
  }

  .permission-option:has(input:checked) .checkbox {
    border-color: var(--primary);

    background-color: var(--primary);
  }

  .permission-info {
    display: flex;
    flex-direction: column;

    min-width: 0;

    gap: 0.15rem;
  }

  .permission-name {
    color: var(--white);

    font-family: monospace;
    font-size: 0.8rem;
    font-weight: 600;
  }

  .permission-description {
    color: var(--gray);

    font-size: 0.72rem;
  }

  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: 1rem;

    padding: 0.9rem 1.25rem;

    border-top: 1px solid #222;

    background-color: #0a0a0a;
  }

  .selected-count {
    color: var(--gray);

    font-size: 0.75rem;
  }

  .selected-count strong {
    color: var(--white);
  }

  .modal-actions {
    display: flex;

    gap: 0.5rem;
  }

  .cancel-button,
  .save-button {
    padding: 0.5rem 0.8rem;

    border-radius: 0.4rem;

    font-size: 0.8rem;
    font-weight: 600;

    cursor: pointer;

    transition:
      opacity 150ms ease,
      background-color 150ms ease;
  }

  .cancel-button {
    border: 1px solid #292929;

    background-color: #151515;

    color: var(--gray);
  }

  .cancel-button:hover:not(:disabled) {
    background-color: #1b1b1b;
    color: var(--white);
  }

  .save-button {
    display: inline-flex;
    align-items: center;

    gap: 0.4rem;

    border: 1px solid var(--primary);

    background-color: var(--primary);

    color: var(--white);
  }

  .save-button:hover:not(:disabled) {
    opacity: 0.85;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
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
