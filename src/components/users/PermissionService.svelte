<script lang="ts">
  import PermissionOption from './PermissionOption.svelte';

  let {
    service,
    permissions,
    selectedPermissions,
    isPending,
    hasPermission,
    onToggle,
  }: {
    service: string;
    permissions: Record<string, string>;
    selectedPermissions: string[];
    isPending: boolean;
    hasPermission: (service: string, permission: string) => boolean;
    onToggle: (service: string, permission: string) => void;
  } = $props();
</script>

<div class="permission-service">
  <div class="service-header">
    <div>
      <h3>{service}</h3>

      <span>
        {Object.keys(permissions).length}
        доступных прав
      </span>
    </div>

    <span class="service-selected">
      {selectedPermissions.length}
      выбрано
    </span>
  </div>

  <div class="permission-list">
    {#each Object.entries(permissions) as [permission, description] (permission)}
      <PermissionOption
        {service}
        {permission}
        {description}
        checked={hasPermission(service, permission)}
        disabled={isPending}
        {onToggle}
      />
    {/each}
  </div>
</div>

<style>
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

  .service-header > div {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
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
</style>
