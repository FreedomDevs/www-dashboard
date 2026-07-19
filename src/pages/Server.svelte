<script lang="ts">
  import Convert from 'ansi-to-html';
  import { onDestroy, onMount } from 'svelte';
  import {
    handleBinaryMessage,
    decodeToText,
    sendBinaryPacket,
    PACKET_TYPES,
  } from '@/libs/emc';

  // Принимаем массив строк логов как проп
  let logs = $state([]);
  let socket: WebSocket;

  const convert = new Convert({
    fg: '#FFF',
    bg: '#000',
    newline: true,
    escapeXML: true,
    // Мапим tty цвета под палитру Майнкрафта
    colors: {
      1: '#ff5555', // Red
      2: '#55ff55', // Green
      3: '#ffff55', // Yellow
      4: '#5555ff', // Blue
      5: '#ff55ff', // Magenta
      6: '#55ffff', // Cyan
      7: '#ffffff', // White
    },
  });

  let viewport;
  let command = $state('');

  // Автоскролл вниз при добавлении новых логов
  $effect(() => {
    if (logs && viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  });

  onMount(() => {
    socket = new WebSocket('ws://localhost:8081/'); // Твой адрес сокета

    // ВАЖНО: говорим сокету работать с байтами, а не со строками
    socket.binaryType = 'arraybuffer';

    socket.onmessage = (ev: MessageEvent<any>) => {
      let [type, data] = handleBinaryMessage(ev.data);

      if (type == PACKET_TYPES.SERVER_LOG) {
        logs = [...logs, decodeToText(data)];
      }
    };

    socket.onopen = () => {
      logs = [...logs, '[Client]: Connected to console server.'];
      const packet = sendBinaryPacket(
        PACKET_TYPES.CLIENT_SUBSCRIBE_TO_LOGS,
        new Uint8Array(0)
      );

      socket.send(new Uint8Array(packet));
      console.log(
        'Subscribe packet sent successfully, status:',
        socket.readyState
      );
    };

    socket.onerror = (err) => {
      logs = [...logs, '[Client ERROR]: WebSocket connection failed.'];
    };

    socket.onclose = () => {
      logs = [...logs, '[Client]: Disconnected from server.'];
    };
  });

  // Незабываем закрывать сокет при уничтожении компонента
  onDestroy(() => {
    if (socket) socket.close();
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!command.trim()) return;

    // Тут вызывай свою функцию отправки команды в tty
    console.log('Sending to tty:', command);

    command = ''; // Очищаем инпут
  }
</script>

<section>
  <!-- Область вывода логов -->
  <div bind:this={viewport}>
    {#each logs as log}
      <!-- {@html} рендерит сгенерированные span'ы от ansi-to-html -->
      <pre>{@html convert.toHtml(log)}</pre>
    {/each}
  </div>

  <!-- Поле ввода внизу -->
  <form onsubmit={handleSubmit}>
    <span>&gt;</span>
    <input type="text" bind:value={command} placeholder="Type a command..." />
  </form>
</section>

<style>
  @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

  section {
    background-color: var(--background);
    flex: 1;
    display: flex;
    flex-direction: column;
    font-family: 'VT323', monospace;
    font-size: 20px;
    padding: 12px;
    /* Пиксельная рамка вокруг всей секции */
    box-shadow:
      -4px 0 0 0 #555,
      4px 0 0 0 #555,
      0 -4px 0 0 #555,
      0 4px 0 0 #555,
      inset -4px -4px 0 0 #3c3c3c,
      inset 4px 4px 0 0 #8b8b8b;
    box-sizing: border-box;
    overflow: hidden;
  }

  /* Область логов */
  section > div {
    flex: 1;
    overflow-y: auto;
    padding-right: 8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  /* Стилизация скроллбара */
  section > div::-webkit-scrollbar {
    width: 8px;
  }
  section > div::-webkit-scrollbar-thumb {
    background: #555;
    box-shadow:
      inset -2px -2px 0 #333,
      inset 2px 2px 0 #888;
  }

  /* Строка лога */
  pre {
    margin: 0;
    color: #fff;
    text-shadow: 2px 2px 0px #222;
    white-space: pre-wrap;
    word-break: break-all;
    font-family: inherit;
  }

  /* Форма ввода снизу */
  form {
    display: flex;
    align-items: center;
    background: rgba(0, 0, 0, 0.4);
    padding: 6px 8px;
    margin-top: 8px;
    box-shadow: inset 0 0 0 2px #555;
  }

  form > span {
    color: #ffaa00;
    margin-right: 8px;
    text-shadow: 2px 2px 0px #2a1a00;
    user-select: none;
  }

  input {
    background: transparent;
    border: none;
    outline: none;
    color: #fff;
    font-family: inherit;
    font-size: inherit;
    flex: 1;
    text-shadow: 2px 2px 0px #222;
  }

  input::placeholder {
    color: #444;
  }
</style>
