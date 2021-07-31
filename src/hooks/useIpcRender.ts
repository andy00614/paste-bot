import { useEffect } from 'react';
import { ipcRenderer } from 'electron';
import TextService from '../db/text_service';

export default function useIpcRender() {
  const textService = new TextService();
  useEffect(() => {
    ipcRenderer.on('set-clipboard', (_, text: string) => {
      textService
        .addText({
          text,
          date: new Date(),
        })
        .then(() => {
          return 1;
        })
        .catch((e) => {
          console.log(e);
        });
    });
  }, []);
}
