<script lang="ts">
  import { Camera, Menu, User, Users } from "@lucide/svelte";
  import { link } from "svelte-routing";

  const pages = {
    Dashboard: [
      {
        name: "Главная",
        icon: { c: Menu, p: { size: 24 } },
        url: "/",
      },
      {
        name: "Юзеры",
        icon: { c: Users, p: { size: 24 } },
        url: "/users",
      },
    ],
  };
</script>

<nav>
  <div style="display: flex;margin-bottom:0.2rem;">
    <img
      width="24px"
      height="24px"
      style="border-radius:0.3rem;"
      src="/favicon.svg"
      alt="Лого"
    />
    <p style="padding-left:0.2rem;">Elysia Dashboard</p>
  </div>

  <hr
    style="background-color:var(--primary);height:2px;border: none;width: 114%;transform:translate(-6%);"
  />

  {#each Object.entries(pages) as [key, value]}
    <p style="color:var(--gray);">{key}</p>
    <ul>
      {#each value as page}
        <li>
          <a
            style="display:flex;flex-direction:row;padding-left:0.3rem;margin-bottom:0.2rem;"
            href={page.url}
            use:link
          >
            <svelte:component this={page.icon.c} {...page.icon.p} />
            <p style="padding-left:0.3rem;">{page.name}</p>
          </a>
        </li>
      {/each}
    </ul>
  {/each}
</nav>

<style>
  nav {
    background-color: #000;
    color: var(--white);

    border-color: var(--primary);
    border-right-width: 2px;

    padding: 0.2rem 0.7rem;

    width: 230px;
    flex-shrink: 0;
  }

  a {
    transition-property: color;
    transition-duration: 200ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

    &::before {
      content: "";
      opacity: 0;
      width: 2px;
      margin-right: 4px;
      background-color: var(--primary);

      transition-property: opacity;
      transition-duration: 150ms;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }

    &:hover {
      color: var(--primary);
    }
    &:hover::before {
      opacity: 1;
    }
  }
</style>
