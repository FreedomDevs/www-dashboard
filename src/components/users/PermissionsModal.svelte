<script lang="ts">
  import { Shield, X, Loader } from '@lucide/svelte';

  import { roles } from '@/libs/api/roles';
  import type { User } from '@/libs/api/data';

  import PermissionService from './PermissionService.svelte';

  let {
    user,
    permissions,
    isPending,
    onClose,
    onTogglePermission,
    onSave,
    hasPermission,
  }: {
    user: User;
    permissions: Record<string, string[]>;
    isPending: boolean;
    onClose: () => void;
    onTogglePermission: (service: string, permission: string) => void;
    onSave: () => void;
    hasPermission: (service: string, permission: string) => boolean;
  } = $props();

  function countPermissions(permissions: Record<string, string[]>): number {
    return Object.values(permissions).reduce(
      (total, items) => total + items.length,
      0
    );
  }
</script>

<div
  class="modal-backdrop"
  role="presentation"
  onclick={(event) => {
    if (event.target === event.currentTarget) {
      onClose();
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

        <p>{user.name}</p>
      </div>

      <button
        class="close-button"
        type="button"
        aria-label="Закрыть"
        disabled={isPending}
        onclick={onClose}
      >
        <X size={20} />
      </button>
    </div>

    <div class="modal-content">
      {#each Object.entries(roles) as [service, servicePermissions] (service)}
        <PermissionService
          {service}
          permissions={servicePermissions}
          selectedPermissions={permissions[service] ?? []}
          {isPending}
          {hasPermission}
          onToggle={onTogglePermission}
        />
      {/each}
    </div>

    <div class="modal-footer">
      <div class="selected-count">
        Выбрано:

        <strong>
          {countPermissions(permissions)}
        </strong>
      </div>

      <div class="modal-actions">
        <button
          class="cancel-button"
          type="button"
          disabled={isPending}
          onclick={onClose}
        >
          Отмена
        </button>

        <button
          class="save-button"
          type="button"
          disabled={isPending}
          onclick={onSave}
        >
          {#if isPending}
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

<style>
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

  .loader {
    animation: spin 1s linear infinite;
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
