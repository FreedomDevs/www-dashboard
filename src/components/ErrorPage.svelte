<script lang="ts">
  import { toast } from "svelte-sonner";

  let { error, reset }: { error: any; reset: () => void } = $props();

  $effect(() => {
    toast("Произошла критическая ошибка при работе сайта: " + error);
    console.error(error);
  });
</script>

<div>
  <h2>Упс, на сайте произошла ошибка</h2>
  <p>Подробнее об ошибке можно прочитать в консоли (F12 -> Консоль)</p>
  <button onclick={reset}>Перезагрузить</button>
</div>

<style>
  div {
    margin-top: 10rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  h2 {
    font-size: 2em;
    font-weight: 600;
  }
  p {
    font-size: 1.1em;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }
  button {
    border-radius: 0.5rem;
    padding: 1rem;
    background-color: #1111ff;
    color: #fff;
    width: fit-content;
  }
</style>
