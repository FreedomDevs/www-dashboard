<script lang="ts">
  import { Line } from 'svelte-chartjs';
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler,
  } from 'chart.js';

  import { Users, UserPlus, ShieldCheck, UsersRound } from '@lucide/svelte';

  import { usersMutation } from '@/libs/api/mutations/getAllUsersMutation';
  import type { User } from '@/libs/api/data';
  import { SvelteDate } from 'svelte/reactivity';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler
  );

  const mutation = usersMutation();

  const usersPromise = mutation.mutateAsync(null);

  function formatDate(date: Date) {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
    });
  }

  function isToday(date: Date) {
    const now = new Date();

    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }

  function isThisMonth(date: Date) {
    const now = new Date();

    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }

  function buildRegistrationChart(users: User[]) {
    const now = new Date();

    const days = Array.from({ length: 30 }, (_, index) => {
      const date = new SvelteDate(now);

      date.setHours(0, 0, 0, 0);
      date.setDate(now.getDate() - (29 - index));

      return date;
    });

    const labels = days.map(formatDate);

    const registrations = days.map((day) => {
      const nextDay = new SvelteDate(day);
      nextDay.setDate(day.getDate() + 1);

      return users.filter((user) => {
        const created = new Date(user.createdAt);

        return created >= day && created < nextDay;
      }).length;
    });

    return {
      labels,
      datasets: [
        {
          label: 'Регистрации',
          data: registrations,
          borderColor: '#ff3366',
          backgroundColor: 'rgba(255, 51, 102, 0.12)',
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 6,
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        displayColors: false,

        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y;

            return `${value} ${value === 1 ? 'регистрация' : 'регистраций'}`;
          },
        },
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },

        ticks: {
          color: '#8f889e',
          maxTicksLimit: 10,
        },

        border: {
          display: false,
        },
      },

      y: {
        beginAtZero: true,

        ticks: {
          color: '#8f889e',
          precision: 0,
        },

        grid: {
          color: 'rgba(255, 255, 255, 0.06)',
        },

        border: {
          display: false,
        },
      },
    },
  };
</script>

{#await usersPromise}
  <section class="loading">
    <div class="loading-spinner"></div>
    <span>Загрузка статистики...</span>
  </section>
{:then response}
  {@const users = response.users}
  {@const chartData = buildRegistrationChart(users)}

  {@const totalUsers = users.length}
  {@const todayRegistrations = users.filter((user) =>
    isToday(new Date(user.createdAt))
  ).length}

  {@const monthRegistrations = users.filter((user) =>
    isThisMonth(new Date(user.createdAt))
  ).length}

  {@const adminUsers = users.filter((user) =>
    user.permissions?.dashboard?.includes('admin')
  ).length}

  <section class="dashboard">
    <header class="header">
      <div>
        <span class="eyebrow">ELYSiA CLOUD</span>

        <h1>Dashboard</h1>

        <p>Обзор пользователей и активности платформы</p>
      </div>

      <div class="date">
        {new Date().toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </div>
    </header>

    <div class="stats">
      <article class="stat-card">
        <div class="stat-icon">
          <Users size={21} />
        </div>

        <div class="stat-content">
          <span>Всего пользователей</span>
          <strong>{totalUsers}</strong>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon">
          <UserPlus size={21} />
        </div>

        <div class="stat-content">
          <span>Регистраций за месяц</span>
          <strong>+{monthRegistrations}</strong>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon">
          <UsersRound size={21} />
        </div>

        <div class="stat-content">
          <span>Регистраций сегодня</span>
          <strong>+{todayRegistrations}</strong>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon">
          <ShieldCheck size={21} />
        </div>

        <div class="stat-content">
          <span>Администраторы</span>
          <strong>{adminUsers}</strong>
        </div>
      </article>
    </div>

    <div class="content-grid">
      <article class="card chart-card">
        <div class="card-header">
          <div>
            <h2>Регистрации</h2>
            <p>Количество новых пользователей за последние 30 дней</p>
          </div>

          <span class="badge"> 30 дней </span>
        </div>

        <div class="chart">
          <Line data={chartData} options={chartOptions} />
        </div>
      </article>

      <article class="card overview-card">
        <div class="card-header">
          <div>
            <h2>Обзор</h2>
            <p>Текущее состояние пользователей</p>
          </div>
        </div>

        <div class="overview">
          <div class="overview-row">
            <div>
              <span class="dot primary"></span>
              Всего пользователей
            </div>

            <strong>{totalUsers}</strong>
          </div>

          <div class="overview-row">
            <div>
              <span class="dot success"></span>
              Администраторы
            </div>

            <strong>{adminUsers}</strong>
          </div>

          <div class="overview-row">
            <div>
              <span class="dot warning"></span>
              Регистрации сегодня
            </div>

            <strong>{todayRegistrations}</strong>
          </div>

          <div class="overview-row">
            <div>
              <span class="dot info"></span>
              За текущий месяц
            </div>

            <strong>{monthRegistrations}</strong>
          </div>
        </div>
      </article>
    </div>

    <article class="card recent-card">
      <div class="card-header">
        <div>
          <h2>Последние пользователи</h2>
          <p>Недавно зарегистрированные аккаунты</p>
        </div>
      </div>

      <div class="users-list">
        {#each [...users]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5) as user (user.id)}
          <div class="user-row">
            <div class="avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div class="user-info">
              <strong>{user.name}</strong>

              <span>
                Зарегистрирован
                {new Date(user.createdAt).toLocaleDateString('ru-RU')}
              </span>
            </div>

            <span class="user-groups">
              {user.groups.length}
              {user.groups.length === 1 ? 'группа' : 'группы'}
            </span>
          </div>
        {/each}
      </div>
    </article>
  </section>
{:catch error}
  {@const errorMessage =
    error instanceof Error ? error.message : 'Неизвестная ошибка'}

  <section class="error">
    <h2>Не удалось загрузить dashboard</h2>
    <p>{errorMessage}</p>
  </section>
{/await}

<style>
  .dashboard {
    width: 100%;
    min-height: 100vh;

    box-sizing: border-box;

    padding: 32px 40px;

    color: var(--white, #fff);
    background: var(--background);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    margin-bottom: 32px;
  }

  .eyebrow {
    color: var(--primary);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.14em;
  }

  h1 {
    margin: 6px 0 4px;

    font-size: 2.2rem;
    font-weight: 700;
    letter-spacing: -0.04em;
  }

  .header p {
    margin: 0;

    color: var(--gray, #8f889e);
    font-size: 0.95rem;
  }

  .date {
    color: var(--gray, #8f889e);

    padding: 10px 14px;

    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 10px;

    background: rgba(255, 255, 255, 0.025);

    font-size: 0.85rem;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;

    margin-bottom: 20px;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 14px;

    padding: 20px;

    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 14px;

    background: rgba(255, 255, 255, 0.025);

    transition:
      border-color 0.2s ease,
      transform 0.2s ease;
  }

  .stat-card:hover {
    border-color: rgba(255, 51, 102, 0.25);
    transform: translateY(-2px);
  }

  .stat-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 44px;
    height: 44px;

    flex-shrink: 0;

    border-radius: 11px;

    color: var(--primary);
    background: rgba(255, 51, 102, 0.1);
  }

  .stat-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .stat-content span {
    color: var(--gray, #8f889e);
    font-size: 0.8rem;
  }

  .stat-content strong {
    font-size: 1.5rem;
    font-weight: 700;
  }

  .content-grid {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
    gap: 20px;

    margin-bottom: 20px;
  }

  .card {
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 14px;

    background: rgba(255, 255, 255, 0.025);

    overflow: hidden;
  }

  .chart-card {
    min-width: 0;
  }

  .card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    padding: 22px 22px 0;
  }

  .card-header h2 {
    margin: 0 0 5px;

    font-size: 1rem;
    font-weight: 650;
  }

  .card-header p {
    margin: 0;

    color: var(--gray, #8f889e);

    font-size: 0.8rem;
  }

  .badge {
    padding: 6px 9px;

    color: var(--gray, #8f889e);

    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 7px;

    font-size: 0.7rem;
  }

  .chart {
    height: 330px;

    padding: 25px 20px 20px;
  }

  .overview {
    display: flex;
    flex-direction: column;

    padding: 25px 22px 22px;
    gap: 4px;
  }

  .overview-row {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 14px 0;

    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .overview-row:last-child {
    border-bottom: none;
  }

  .overview-row div {
    display: flex;
    align-items: center;
    gap: 9px;

    color: var(--gray, #8f889e);

    font-size: 0.82rem;
  }

  .overview-row strong {
    font-size: 0.9rem;
  }

  .dot {
    width: 7px;
    height: 7px;

    border-radius: 50%;
  }

  .dot.primary {
    background: var(--primary);
  }

  .dot.success {
    background: var(--success, #22c55e);
  }

  .dot.warning {
    background: var(--warning, #f59e0b);
  }

  .dot.info {
    background: var(--info, #3b82f6);
  }

  .recent-card {
    margin-bottom: 40px;
  }

  .users-list {
    display: flex;
    flex-direction: column;

    margin-top: 20px;
  }

  .user-row {
    display: flex;
    align-items: center;
    gap: 13px;

    padding: 14px 22px;

    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }

  .avatar {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 36px;
    height: 36px;

    flex-shrink: 0;

    border-radius: 9px;

    color: var(--primary);
    background: rgba(255, 51, 102, 0.1);

    font-weight: 700;
  }

  .user-info {
    display: flex;
    flex-direction: column;
    gap: 3px;

    flex: 1;
  }

  .user-info strong {
    font-size: 0.85rem;
  }

  .user-info span {
    color: var(--gray, #8f889e);
    font-size: 0.75rem;
  }

  .user-groups {
    color: var(--gray, #8f889e);

    font-size: 0.75rem;
  }

  .loading,
  .error {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    min-height: 100vh;

    gap: 12px;

    color: var(--gray, #8f889e);
    background: var(--background);
  }

  .loading-spinner {
    width: 28px;
    height: 28px;

    border: 3px solid rgba(255, 255, 255, 0.08);
    border-top-color: var(--primary);

    border-radius: 50%;

    animation: spin 0.8s linear infinite;
  }

  .error h2 {
    margin: 0;

    color: #fff;
  }

  .error p {
    margin: 0;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 1100px) {
    .stats {
      grid-template-columns: repeat(2, 1fr);
    }

    .content-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 700px) {
    .dashboard {
      padding: 20px;
    }

    .header {
      flex-direction: column;
      gap: 15px;
    }

    .stats {
      grid-template-columns: 1fr;
    }
  }
</style>
