<script lang="ts">
  import {
    LogOut,
    ChevronLeft,
    LayoutDashboard,
    Users,
    Server,
  } from '@lucide/svelte';

  import type { Component } from 'svelte';

  import { link, useLocation } from 'svelte-routing';
  import { meMutation } from '@/libs/api/mutations/meMutation';

  type UserData = {
    id: string;
    name: string;
    groups: string[];
    permissions: Record<string, string[]>;
    createdAt: string;
    updatedAt: string;
  };

  type NavItem = {
    label: string;
    href: string;
    icon: Component;
    permission?: string;
  };

  type NavCategory = {
    label: string;
    items: NavItem[];
  };

  const userMutation = meMutation();
  const location = useLocation();

  let user: UserData | null = null;
  let loading = true;

  let collapsed = true;
  let isMobile = false;

  const navigation: NavCategory[] = [
    {
      label: 'Dashboard',

      items: [
        {
          label: 'Главная',
          href: '/',
          icon: LayoutDashboard,
        },

        {
          label: 'Юзеры',
          href: '/users',
          icon: Users,
          permission: 'dashboard:admin',
        },

        {
          label: 'Сервер',
          href: '/server',
          icon: Server,
          permission: 'dashboard:admin',
        },
      ],
    },
  ];

  async function loadUser() {
    try {
      user = await userMutation.mutateAsync(null);
    } catch (error) {
      console.error('Failed to load current user:', error);

      user = null;
    } finally {
      loading = false;
    }
  }

  loadUser();

  function hasPermission(permission?: string): boolean {
    if (!permission) {
      return true;
    }

    if (!user) {
      return false;
    }

    const separatorIndex = permission.indexOf(':');

    if (separatorIndex === -1) {
      return false;
    }

    const service = permission.slice(0, separatorIndex);
    const action = permission.slice(separatorIndex + 1);

    return user.permissions?.[service]?.includes(action) ?? false;
  }

  function canAccessPage(page: NavItem): boolean {
    return hasPermission(page.permission);
  }

  function isActive(href: string): boolean {
    const pathname = $location?.pathname ?? '';

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function checkMobile() {
    const mobile = window.innerWidth <= 768;
    isMobile = mobile;
    collapsed = mobile;
  }

  function toggleCollapsed() {
    collapsed = !collapsed;
  }

  function closeMobile() {
    if (isMobile) {
      collapsed = true;
    }
  }

  function exit() {
    localStorage.clear();
  }

  if (typeof window !== 'undefined') {
    checkMobile();

    window.addEventListener('resize', checkMobile);
  }
</script>

<aside class="sidebar" class:collapsed>
  <div class="logo">
    <img src="/favicon.svg" alt="ElysiaCloud" width="34" height="34" />

    <span>ElysiaCloud</span>
  </div>

  <nav class="navigation">
    {#if loading}
      <div class="loading">Загрузка...</div>
    {:else if user}
      {#each navigation as category (category.label)}
        {@const visibleItems = category.items.filter(canAccessPage)}

        {#if visibleItems.length > 0}
          <div class="category">
            <span class="categoryTitle">
              {category.label}
            </span>

            <div class="categoryItems">
              {#each visibleItems as item (item.href)}
                <a
                  href={item.href}
                  use:link
                  class="navItem"
                  class:active={isActive(item.href)}
                  onclick={closeMobile}
                >
                  <svelte:component this={item.icon} />

                  <span>
                    {item.label}
                  </span>
                </a>
              {/each}
            </div>
          </div>
        {/if}
      {/each}
    {:else}
      <div class="loading">Не удалось получить пользователя</div>
    {/if}
  </nav>

  {#if !loading && user}
    <button type="button" class="logout" onclick={exit}>
      <LogOut />

      <span> Выйти </span>
    </button>
  {/if}

  <button
    type="button"
    class="collapse"
    onclick={toggleCollapsed}
    aria-label={collapsed ? 'Развернуть меню' : 'Свернуть меню'}
  >
    <ChevronLeft />
  </button>
</aside>

{#if isMobile && !collapsed}
  <div class="overlay" onclick={closeMobile} aria-hidden="true"></div>
{/if}

<style>
  .sidebar,
  .sidebar *,
  .sidebar *::before,
  .sidebar *::after {
    box-sizing: border-box;
  }

  .sidebar {
    position: sticky;
    top: 0;

    width: 250px;
    min-width: 250px;

    height: 100vh;

    display: flex;
    flex-direction: column;

    padding: 20px 14px;

    background: rgba(0, 11, 20, 0.82);

    border-right: 1px solid rgba(214, 220, 229, 0.08);

    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);

    overflow: visible;

    z-index: 100;

    transition:
      width 0.25s cubic-bezier(0.4, 0, 0.2, 1),
      min-width 0.25s cubic-bezier(0.4, 0, 0.2, 1),
      padding 0.25s cubic-bezier(0.4, 0, 0.2, 1),
      background 0.2s ease;
  }

  .logo {
    display: flex;
    align-items: center;

    width: 100%;
    min-width: 0;

    gap: 11px;

    height: 38px;
    min-height: 38px;

    padding: 2px 10px;

    color: var(--white);

    font-size: 17px;
    font-weight: 600;

    letter-spacing: -0.02em;

    overflow: hidden;
    white-space: nowrap;
  }

  .logo img {
    flex-shrink: 0;

    width: 34px;
    height: 34px;

    object-fit: contain;

    border-radius: var(--radius-sm);
  }

  .logo span {
    min-width: 0;

    opacity: 1;

    transform: translateX(0);

    transition:
      opacity 0.18s cubic-bezier(0.4, 0, 0.2, 1),
      transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);

    will-change: opacity, transform;
  }

  .navigation {
    flex: 1;

    display: flex;
    flex-direction: column;

    width: 100%;
    min-width: 0;

    gap: 0;

    padding: 20px 0;

    overflow: hidden;

    overflow-y: auto;

    scrollbar-width: none;
  }

  .navigation::-webkit-scrollbar {
    display: none;
  }

  .category {
    width: 100%;
    min-width: 0;

    margin-bottom: 18px;
  }

  .category:last-child {
    margin-bottom: 0;
  }

  .categoryTitle {
    display: block;

    padding: 0 12px;

    margin-bottom: 7px;

    color: var(--gray);

    font-size: 11px;
    font-weight: 600;

    line-height: 1.4;

    text-transform: uppercase;

    letter-spacing: 0.06em;

    white-space: nowrap;

    opacity: 1;

    transform: translateX(0);

    transition:
      opacity 0.18s cubic-bezier(0.4, 0, 0.2, 1),
      transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .categoryItems {
    display: flex;
    flex-direction: column;

    width: 100%;

    gap: 5px;
  }

  .navItem {
    display: flex;
    align-items: center;

    width: 100%;
    min-width: 0;

    gap: 12px;

    height: 42px;
    min-height: 42px;

    padding: 0 12px;

    border-radius: var(--radius-sm);

    color: var(--gray);

    font-size: 14px;
    font-weight: 500;

    text-decoration: none;

    overflow: hidden;

    white-space: nowrap;

    transition:
      color 0.15s ease,
      background 0.15s ease,
      transform 0.15s ease;
  }

  .navItem :global(svg) {
    flex-shrink: 0;

    width: 18px;
    height: 18px;

    transition:
      color 0.15s ease,
      transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .navItem span {
    min-width: 0;

    opacity: 1;

    transform: translateX(0);

    transition:
      opacity 0.18s cubic-bezier(0.4, 0, 0.2, 1),
      transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);

    will-change: opacity, transform;
  }

  .navItem:hover {
    background: rgba(255, 51, 102, 0.065);

    color: var(--gray2);
  }

  .navItem:hover :global(svg) {
    color: var(--primary);

    transform: scale(1.15);
  }

  .navItem.active {
    background: rgba(255, 51, 102, 0.095);

    color: var(--white);

    box-shadow:
      0 0 0 1px rgba(255, 51, 102, 0.12),
      0 0 12px rgba(255, 51, 102, 0.08);
  }

  .navItem.active :global(svg) {
    color: var(--primary);

    filter: drop-shadow(0 0 5px rgba(255, 51, 102, 0.45));
  }

  .logout {
    display: flex;
    align-items: center;

    width: 100%;
    min-width: 0;

    height: 42px;
    min-height: 42px;

    gap: 12px;

    padding: 0 12px;

    border: 0;

    border-radius: var(--radius-sm);

    background: transparent;

    color: var(--gray);

    font-family: inherit;

    font-size: 14px;
    font-weight: 500;

    cursor: pointer;

    overflow: hidden;

    white-space: nowrap;

    transition:
      color 0.15s ease,
      background 0.15s ease;
  }

  .logout :global(svg) {
    flex-shrink: 0;

    width: 18px;
    height: 18px;

    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .logout span {
    min-width: 0;

    opacity: 1;

    transform: translateX(0);

    transition:
      opacity 0.18s cubic-bezier(0.4, 0, 0.2, 1),
      transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .logout:hover {
    background: rgba(239, 68, 68, 0.07);

    color: var(--error);
  }

  .logout:hover :global(svg) {
    transform: scale(1.15) translateX(-1px);
  }

  .collapse {
    position: absolute;

    top: 50%;
    right: -13px;

    width: 26px;
    height: 26px;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 0;

    border: 1px solid rgba(214, 220, 229, 0.1);

    border-radius: 50%;

    background: rgba(5, 16, 27, 0.96);

    color: var(--gray);

    cursor: pointer;

    transform: translateY(-50%);

    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);

    transition:
      color 0.15s ease,
      background 0.15s ease,
      border-color 0.15s ease,
      box-shadow 0.15s ease,
      transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    z-index: 10;
  }

  .collapse :global(svg) {
    width: 14px;
    height: 14px;

    flex-shrink: 0;

    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .collapse:hover {
    color: var(--white);

    background: rgba(255, 51, 102, 0.12);

    border-color: rgba(255, 51, 102, 0.2);

    box-shadow: 0 5px 18px rgba(0, 0, 0, 0.3);

    transform: translateY(-50%) scale(1.08);
  }

  .collapse:active {
    transform: translateY(-50%) scale(0.92);
  }

  .collapsed {
    width: 72px;
    min-width: 72px;

    padding-left: 10px;
    padding-right: 10px;

    overflow: hidden;
  }

  .collapsed .logo {
    width: 100%;

    justify-content: center;

    padding-left: 0;
    padding-right: 0;
  }

  .collapsed .logo span {
    opacity: 0;

    transform: translateX(-8px);

    pointer-events: none;
  }

  .collapsed .categoryTitle {
    opacity: 0;

    transform: translateX(-8px);

    pointer-events: none;
  }

  .collapsed .category {
    margin-bottom: 12px;
  }

  .collapsed .categoryItems {
    gap: 5px;
  }

  .collapsed .navItem {
    position: relative;

    width: 100%;
    min-width: 0;

    padding: 0;

    justify-content: center;

    gap: 0;
  }

  .collapsed .navItem :global(svg) {
    position: absolute;

    left: 50%;
    top: 50%;

    width: 18px;
    height: 18px;

    margin: 0;

    transform: translate(-50%, -50%);
  }

  .collapsed .navItem span {
    opacity: 0;

    transform: translateX(-8px);

    pointer-events: none;
  }

  .collapsed .navItem:hover :global(svg) {
    transform: translate(-50%, -50%) scale(1.15);
  }

  .collapsed .logout {
    position: relative;

    width: 100%;
    min-width: 0;

    padding: 0;

    justify-content: center;

    gap: 0;
  }

  .collapsed .logout :global(svg) {
    position: absolute;

    left: 50%;
    top: 50%;

    width: 18px;
    height: 18px;

    margin: 0;

    transform: translate(-50%, -50%);
  }

  .collapsed .logout span {
    opacity: 0;

    transform: translateX(-8px);

    pointer-events: none;
  }

  .collapsed .logout:hover :global(svg) {
    transform: translate(-50%, -50%) scale(1.15);
  }

  .collapsed .collapse :global(svg) {
    transform: rotate(180deg);
  }

  .loading {
    padding: 10px 12px;

    color: var(--gray);

    font-size: 13px;
  }

  .overlay {
    position: fixed;

    inset: 0;

    width: 100vw;
    height: 100vh;

    background: rgba(0, 0, 0, 0.45);

    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);

    z-index: 999;

    animation: fadeIn 0.25s ease;

    cursor: pointer;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    .sidebar {
      position: sticky;
      top: 0;

      left: auto;

      width: 64px;
      min-width: 64px;

      height: 100vh;

      flex-shrink: 0;

      padding: 20px 10px;

      background: rgba(0, 11, 20, 0.96);

      border-right: 1px solid rgba(214, 220, 229, 0.06);

      box-shadow: none;

      z-index: 1000;
    }

    .collapsed {
      width: 64px;
      min-width: 64px;

      padding-left: 10px;
      padding-right: 10px;
    }

    .collapsed .logo {
      width: 100%;

      justify-content: center;

      gap: 0;

      padding-left: 0;
      padding-right: 0;
    }

    .collapsed .logo span {
      opacity: 0;

      transform: translateX(-10px);

      pointer-events: none;
    }

    .collapsed .navItem {
      width: 100%;

      justify-content: center;

      gap: 0;

      padding-left: 0;
      padding-right: 0;
    }

    .collapsed .navItem span {
      opacity: 0;

      transform: translateX(-10px);

      pointer-events: none;
    }

    .collapsed .logout {
      width: 100%;

      justify-content: center;

      gap: 0;

      padding-left: 0;
      padding-right: 0;
    }

    .collapsed .logout span {
      opacity: 0;

      transform: translateX(-10px);

      pointer-events: none;
    }

    .collapsed .collapse {
      right: -13px;
    }

    .collapsed .collapse :global(svg) {
      transform: rotate(0deg);
    }

    .sidebar:not(.collapsed) {
      position: fixed;

      left: 0;
      top: 0;

      width: 260px;
      min-width: 260px;

      height: 100vh;

      padding: 20px 16px;

      background: rgb(0, 11, 20);

      border-right: 1px solid rgba(214, 220, 229, 0.1);

      box-shadow: 8px 0 32px rgba(0, 0, 0, 0.55);

      z-index: 1000;
    }

    .sidebar:not(.collapsed) .logo {
      width: 100%;

      justify-content: flex-start;

      gap: 11px;

      padding-left: 2px;
      padding-right: 10px;
    }

    .sidebar:not(.collapsed) .logo span {
      opacity: 1;

      transform: translateX(0);

      pointer-events: auto;

      transition-delay: 0.06s;
    }

    .sidebar:not(.collapsed) .categoryTitle {
      opacity: 1;

      transform: translateX(0);

      pointer-events: auto;
    }

    .sidebar:not(.collapsed) .navItem {
      width: 100%;

      justify-content: flex-start;

      gap: 12px;

      padding-left: 12px;
      padding-right: 12px;
    }

    .sidebar:not(.collapsed) .navItem :global(svg) {
      position: static;

      width: 18px;
      height: 18px;

      transform: none;
    }

    .sidebar:not(.collapsed) .navItem span {
      opacity: 1;

      transform: translateX(0);

      pointer-events: auto;
    }

    .sidebar:not(.collapsed) .logout {
      width: 100%;

      justify-content: flex-start;

      gap: 12px;

      padding-left: 12px;
      padding-right: 12px;
    }

    .sidebar:not(.collapsed) .logout :global(svg) {
      position: static;

      width: 18px;
      height: 18px;

      transform: none;
    }

    .sidebar:not(.collapsed) .logout span {
      opacity: 1;

      transform: translateX(0);

      pointer-events: auto;

      transition-delay: 0.24s;
    }

    .sidebar:not(.collapsed) .collapse {
      right: -13px;
    }

    .sidebar:not(.collapsed) .collapse :global(svg) {
      transform: rotate(180deg);
    }
  }
</style>
