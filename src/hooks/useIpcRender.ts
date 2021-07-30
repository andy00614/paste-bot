import { useEffect } from 'react';
import { ipcRenderer } from 'electron';

export default function useIpcRender() {
  useEffect(() => {
    ipcRenderer.on('set-clipboard', (_, text) => {
      console.log(text);
    });
  }, []);
}
