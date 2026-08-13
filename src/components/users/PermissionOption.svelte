<script lang="ts">
  import { Check } from '@lucide/svelte';

  let {
    service,
    permission,
    description,
    checked,
    disabled,
    onToggle,
  }: {
    service: string;
    permission: string;
    description: string;
    checked: boolean;
    disabled: boolean;
    onToggle: (service: string, permission: string) => void;
  } = $props();
</script>

<label class="permission-option">
  <input
    type="checkbox"
    {checked}
    {disabled}
    onchange={() => onToggle(service, permission)}
  />

  <span class="checkbox">
    {#if checked}
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

<style>
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
</style>
