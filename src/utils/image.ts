export default function arrayBufferToBase64(buffer: Buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  const blob = window.btoa(binary);
  return `data:image/png;base64,${blob}`;
}
