<script lang="ts">
  import { Loader } from '@lucide/svelte';
  import { usersMutation } from '@/libs/api/mutations/getAllUsersMutation';

  const mutation = usersMutation();

  const users = mutation.mutateAsync(null);
</script>

<section>
  {#await users}
    <div class="loading">
      <Loader size={32} class="loader" />
      <span>Загрузка пользователей...</span>
    </div>
  {:then response}
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
          {#each response.users as user (user.id)}
            <tr>
              <td>{user.name}</td>

              <td>
                <code>{user.id}</code>
              </td>

              <td>
                <div class="permissions">
                  {#each Object.entries(user.permissions) as [service, permissions] (service)}
                    <div class="permission-group">
                      <span class="service">{service}</span>

                      <div class="permission-list">
                        {#each permissions as permission (permission)}
                          <span class="permission">
                            {permission}
                          </span>
                        {/each}
                      </div>
                    </div>
                  {/each}
                </div>
              </td>

              <td>
                <div class="groups">
                  {#each user.groups as group (group)}
                    <span class="group">{group}</span>
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
        <span>{e.message}</span>
      {:else}
        <span>Произошла неизвестная ошибка</span>
      {/if}
    </div>
  {/await}
</section>

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

  code {
    color: var(--gray);

    font-family: monospace;
    font-size: 0.75rem;
  }

  .permissions {
    display: flex;
    flex-direction: column;

    gap: 0.35rem;
  }

  .permission-group {
    display: flex;
    align-items: center;

    gap: 0.4rem;
  }

  .service {
    color: var(--gray);

    font-size: 0.75rem;
  }

  .permission-list {
    display: flex;
    flex-wrap: wrap;

    gap: 0.25rem;
  }

  .permission {
    padding: 0.15rem 0.4rem;

    border-radius: 0.3rem;

    background-color: color-mix(in srgb, var(--primary) 15%, transparent);

    color: var(--primary);

    font-size: 0.7rem;
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

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
</style>
