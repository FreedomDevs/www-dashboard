<script lang="ts">
  import {
    ArrowRight,
    Server,
    User,
    ShieldCheck,
    Loader,
  } from '@lucide/svelte';

  import { meMutation } from '@/libs/api/mutations/meMutation';
  import { go } from '@/libs/go';

  const mutation = meMutation();
  const userPromise = mutation.mutateAsync(null);
</script>

{#await userPromise}
  <section class="loading">
    <Loader size={30} class="loader" />
    <span>Загрузка...</span>
  </section>
{:then user}
  <section class="dashboard">
    <div class="hero">
      <div class="hero-content">
        <span class="eyebrow">ELYSIA CLOUD</span>

        <h1>
          Добро пожаловать,
          <span>{user.name}</span>!
        </h1>

        <p>
          Рады видеть вас в Elysia Cloud. Управляйте своими серверами и
          аккаунтом из одного места.
        </p>
      </div>

      <div class="hero-decoration">
        <div class="glow"></div>

        <div class="logo">
          <img src="/favicon.svg" alt="Elysia Cloud" />
        </div>
      </div>
    </div>

    <div class="cards">
      <button class="card" onclick={() => go('/servers')}>
        <div class="icon">
          <Server size={22} />
        </div>

        <div class="card-content">
          <h2>Мои серверы</h2>
          <p>Просматривайте и управляйте своими серверами.</p>
        </div>

        <ArrowRight class="arrow" size={20} />
      </button>

      <button
        class="card"
        onclick={() => go('https://sso.elysiac.fun/settings/account')}
      >
        <div class="icon">
          <User size={22} />
        </div>

        <div class="card-content">
          <h2>Мой аккаунт</h2>
          <p>Управление профилем и настройками аккаунта.</p>
        </div>

        <ArrowRight class="arrow" size={20} />
      </button>

      <button
        class="card"
        onclick={() => go('https://sso.elysiac.fun/settings/security')}
      >
        <div class="icon">
          <ShieldCheck size={22} />
        </div>

        <div class="card-content">
          <h2>Безопасность</h2>
          <p>Управление паролем и настройками безопасности.</p>
        </div>

        <ArrowRight class="arrow" size={20} />
      </button>
    </div>

    <div class="tip">
      <div class="tip-dot"></div>

      <div>
        <strong>Всё готово к работе</strong>

        <p>Используйте боковое меню, чтобы перейти к нужному разделу.</p>
      </div>
    </div>
  </section>
{:catch err}
  <section class="error">
    <h2>Не удалось загрузить профиль</h2>
    <p>Попробуйте обновить страницу.</p>
  </section>
{/await}

<style>
  .dashboard {
    position: relative;

    display: flex;
    flex-direction: column;

    width: 100%;
    min-height: 100vh;

    box-sizing: border-box;

    padding: 50px;

    overflow: hidden;

    color: #fff;
    background: var(--background);
  }

  .hero {
    position: relative;

    display: flex;
    align-items: center;
    justify-content: space-between;

    min-height: 330px;

    padding: 55px 60px;

    box-sizing: border-box;

    overflow: hidden;

    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 20px;

    background:
      radial-gradient(
        circle at 85% 50%,
        rgba(255, 51, 102, 0.12),
        transparent 35%
      ),
      rgba(255, 255, 255, 0.025);
  }

  .hero-content {
    position: relative;
    z-index: 2;

    max-width: 700px;
  }

  .eyebrow {
    display: inline-block;

    margin-bottom: 15px;

    color: var(--primary);

    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.18em;
  }

  h1 {
    margin: 0;

    font-size: clamp(2.4rem, 4vw, 4rem);
    line-height: 1.05;
    letter-spacing: -0.045em;
  }

  h1 span {
    color: var(--primary);
  }

  .hero p {
    max-width: 580px;

    margin: 22px 0 0;

    color: var(--gray, #8f889e);

    font-size: 1rem;
    line-height: 1.7;
  }

  .hero-decoration {
    position: relative;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 300px;
    height: 300px;

    flex-shrink: 0;
  }

  .glow {
    position: absolute;

    width: 180px;
    height: 180px;

    border-radius: 50%;

    background: #e43d6c;

    opacity: 0.28;
    filter: blur(70px);
  }

  .logo {
    position: relative;
    z-index: 2;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 145px;
    height: 145px;

    border-radius: 32px;

    overflow: hidden;

    background: #e43d6c;

    box-shadow:
      0 0 60px rgba(228, 61, 108, 0.25),
      0 20px 50px rgba(0, 0, 0, 0.35);

    transform: rotate(-4deg);

    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
  }

  .logo img {
    display: block;

    width: 100%;
    height: 100%;

    object-fit: cover;
  }

  .hero:hover .logo {
    transform: rotate(0deg) scale(1.04);

    box-shadow:
      0 0 80px rgba(228, 61, 108, 0.35),
      0 25px 60px rgba(0, 0, 0, 0.4);
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);

    gap: 18px;

    margin-top: 20px;
  }

  .card {
    position: relative;

    display: flex;
    align-items: center;

    gap: 16px;

    width: 100%;

    padding: 24px;

    box-sizing: border-box;

    text-align: left;

    color: #fff;

    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 16px;

    background: rgba(255, 255, 255, 0.025);

    cursor: pointer;

    transition:
      transform 0.2s ease,
      border-color 0.2s ease,
      background 0.2s ease;
  }

  .card:hover {
    transform: translateY(-3px);

    border-color: rgba(255, 51, 102, 0.3);

    background: rgba(255, 51, 102, 0.035);
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 46px;
    height: 46px;

    flex-shrink: 0;

    border-radius: 12px;

    color: var(--primary);
    background: rgba(255, 51, 102, 0.1);
  }

  .card-content {
    flex: 1;
  }

  .card h2 {
    margin: 0 0 5px;

    font-size: 0.95rem;
    font-weight: 650;
  }

  .card p {
    margin: 0;

    color: var(--gray, #8f889e);

    font-size: 0.78rem;
    line-height: 1.5;
  }

  .arrow {
    color: var(--gray, #8f889e);

    transition:
      color 0.2s ease,
      transform 0.2s ease;
  }

  .card:hover .arrow {
    color: var(--primary);
    transform: translateX(3px);
  }

  .tip {
    display: flex;
    align-items: center;

    gap: 14px;

    margin-top: 20px;
    padding: 18px 20px;

    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 14px;

    background: rgba(255, 255, 255, 0.018);
  }

  .tip-dot {
    width: 8px;
    height: 8px;

    flex-shrink: 0;

    border-radius: 50%;

    background: var(--success, #22c55e);

    box-shadow: 0 0 12px rgba(34, 197, 94, 0.5);
  }

  .tip strong {
    font-size: 0.82rem;
  }

  .tip p {
    margin: 3px 0 0;

    color: var(--gray, #8f889e);

    font-size: 0.75rem;
  }

  .loading,
  .error {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    width: 100%;
    min-height: 100vh;

    gap: 12px;

    box-sizing: border-box;

    color: var(--gray, #8f889e);
    background: var(--background);
  }

  .loader {
    color: var(--primary);

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

  @media (max-width: 1000px) {
    .dashboard {
      padding: 30px;
    }

    .hero {
      padding: 40px;
    }

    .hero-decoration {
      width: 200px;
      height: 200px;
    }

    .logo {
      width: 100px;
      height: 100px;

      padding: 20px;
    }

    .cards {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 650px) {
    .dashboard {
      padding: 20px;
    }

    .hero {
      min-height: auto;
      padding: 35px 25px;
    }

    .hero-decoration {
      display: none;
    }

    h1 {
      font-size: 2.2rem;
    }
  }
</style>
