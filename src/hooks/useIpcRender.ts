import { useEffect } from 'react';
import { ipcRenderer } from 'electron';
import TextService from '../db/text_service';
import { IpcEventName } from '../var';

export default function useIpcRender() {
  const textService = new TextService();
  useEffect(() => {
    ipcRenderer.on(IpcEventName.setText, (_, text: string) => {
      textService
        .addText({
          text,
          date: new Date(),
          type: 'text',
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
