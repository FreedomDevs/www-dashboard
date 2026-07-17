<script lang="ts">
  import { Menu, Users } from '@lucide/svelte';
  import { link } from 'svelte-routing';

  const pages = {
    Dashboard: [
      {
        name: 'Главная',
        icon: { c: Menu, p: { size: 24 } },
        url: '/',
      },
      {
        name: 'Юзеры',
        icon: { c: Users, p: { size: 24 } },
        url: '/users',
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
    style="background-color:var(--primary);height:2px;border: none;width: 113%;transform:translate(-6%);"
  />

  {#each Object.entries(pages) as [key, value] (key)}
    <p style="color:var(--gray);">{key}</p>
    <ul>
      {#each value as page (page.url)}
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

<style ✂prettier:content✂="CiAgbmF2IHsKICAgIGJhY2tncm91bmQtY29sb3I6ICMwMDA7CiAgICBjb2xvcjogdmFyKC0td2hpdGUpOwoKICAgIGJvcmRlci1jb2xvcjogdmFyKC0tcHJpbWFyeSk7CiAgICBib3JkZXItcmlnaHQtd2lkdGg6IDJweDsKCiAgICBwYWRkaW5nOiAwLjJyZW0gMC43cmVtOwoKICAgIHdpZHRoOiAyMzBweDsKICAgIGZsZXgtc2hyaW5rOiAwOwogIH0KCiAgYSB7CiAgICB0cmFuc2l0aW9uLXByb3BlcnR5OiBjb2xvcjsKICAgIHRyYW5zaXRpb24tZHVyYXRpb246IDIwMG1zOwogICAgdHJhbnNpdGlvbi10aW1pbmctZnVuY3Rpb246IGN1YmljLWJlemllcigwLjQsIDAsIDAuMiwgMSk7CgogICAgJjo6YmVmb3JlIHsKICAgICAgY29udGVudDogJyc7CiAgICAgIG9wYWNpdHk6IDA7CiAgICAgIHdpZHRoOiAycHg7CiAgICAgIG1hcmdpbi1yaWdodDogNHB4OwogICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1wcmltYXJ5KTsKCiAgICAgIHRyYW5zaXRpb24tcHJvcGVydHk6IG9wYWNpdHk7CiAgICAgIHRyYW5zaXRpb24tZHVyYXRpb246IDE1MG1zOwogICAgICB0cmFuc2l0aW9uLXRpbWluZy1mdW5jdGlvbjogY3ViaWMtYmV6aWVyKDAuNCwgMCwgMC4yLCAxKTsKICAgIH0KCiAgICAmOmhvdmVyIHsKICAgICAgY29sb3I6IHZhcigtLXByaW1hcnkpOwogICAgfQoKICAgICY6aG92ZXI6OmJlZm9yZSB7CiAgICAgIG9wYWNpdHk6IDE7CiAgICB9CiAgfQo="></style>
