export const PACKET_TYPES = {
  SERVER_ERROR: 1,
  SERVER_LOG: 2,
  CLIENT_SUBSCRIBE_TO_LOGS: 3,
  CLIENT_SEND_COMMAND: 4,
  CLIENT_STOP_SERVER: 5,
  CLIENT_START_SERVER: 6,
  CLIENT_RESTART_SERVER: 7,
  CLIENT_SUBSCRIBE_TO_MONITORINGS: 8,
  SERVER_MONITORINGS: 9,
  SERVER_FIRST_MONITORINGS: 10,
};

export function handleBinaryMessage(buffer: ArrayBuffer): [number, ArrayBuffer] {
  const view = new DataView(buffer);

  const packetType = view.getUint32(0, true);
  const payloadBuffer = buffer.slice(4);

  return [packetType, payloadBuffer];
}

export function decodeToText(buffer: ArrayBuffer): string {
  const decoder = new TextDecoder('utf-8');
  const payloadText = decoder.decode(buffer);

  return payloadText;
}

export function sendBinaryPacket(type: number, payloadBytes: Uint8Array<ArrayBuffer>): ArrayBuffer {
  // Выделяем память: 4 байта под тип + длина текстовых байт
  const buffer = new ArrayBuffer(4 + payloadBytes.byteLength);
  const view = new DataView(buffer);

  // Записываем первые 4 байта: тип пакета в Little-Endian (true)
  view.setUint32(0, type, true);

  // Записываем текстовые байты сразу после первых 4 байт
  const uint8Layout = new Uint8Array(buffer, 4);
  uint8Layout.set(payloadBytes);

  return buffer;
}


export function sendBinaryPacketText(type: number, text: string): ArrayBuffer {
  const encoder = new TextEncoder();
  const payloadBytes = encoder.encode(text);

  return sendBinaryPacket(type, payloadBytes);
}
