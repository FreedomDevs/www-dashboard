<script lang="ts">
  import { api } from "@/libs/api";
  import { Loader } from "@lucide/svelte";
</script>

<section>
  {#await api.get("https://elysium-services.mcbeeland.ru/users")}
    <Loader />
  {:then users}
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
        {#each users.data.data.users as user}
          <tr>
            <td>{user.name}</td>
            <td>{user.id}</td>
            <td>{JSON.stringify(user.permissions)}</td>
            <td>{JSON.stringify(user.groups)}</td>
            <td>{user.createdAt}</td>
            <td>{user.updatedAt}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:catch e}
    <p>
      {e.message}<br />
      {e.error}<br />
      {e.statusCode}
    </p>
  {/await}
</section>

<style>
  section {
    background-color: var(--background);
    flex: 1;
  }

  table {
    color: #fff;
    width: 100%;
    /* 1. Объединяем границы в одну линию */
    border-collapse: collapse;

    /* По желанию: скругляем углы всей таблице (требует overflow) */
    border-radius: 0.5rem;
    overflow: hidden;
  }

  /* 2. Задаем легкую границу только для строк или ячеек */
  th,
  td {
    border-bottom: 1px solid var(--primary); /* Тонкая линия снизу (для темной темы) */
    padding: 0.6rem 1rem; /* Внутренние отступы для читаемости */
    text-align: left; /* Выравнивание текста по левому краю */
  }

  th {
    background-color: #111; /* Выделяем шапку таблицы фоном */
    font-weight: 600;
    color: var(--primary);
  }

  p {
    color: lightcoral;
  }
</style>
