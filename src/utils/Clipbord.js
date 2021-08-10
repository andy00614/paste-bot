import { clipboard } from 'electron';
import fs from 'fs';
import path from 'path';
import md5 from 'md5';
import { IpcEventName } from '../var';

export default class Clipbord {
  prePasteText = '';

  prePasteImgName = null;

  constructor(mainWindow) {
    this.mainWindow = mainWindow;
  }

  ipcMain2Render = (...arg) => {
    this.mainWindow.webContents.send(...arg);
  };

  saveText = () => {
    // 复制完image好像会覆盖它，让它变为空
    const pasteText = clipboard.readText();
    if (this.prePasteText !== pasteText) {
      this.ipcMain2Render(IpcEventName.setText, pasteText);
    }
    this.prePasteText = pasteText;
  };

  saveImage = () => {
    const imgText = clipboard.readImage();
    const imgBuffer = imgText.toPNG();
    const imgName = md5(imgBuffer);
    if (this.prePasteImgName && this.prePasteImgName === imgName) {
      return;
    }
    fs.writeFile(
      path.join(__dirname, `../assets/${imgName}.png`),
      imgBuffer,
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('save success');
        }
      }
    );
    this.ipcMain2Render(IpcEventName.setImg, {
      name: imgName,
      buffer: imgBuffer,
    });
    this.prePasteImgName = imgName;
  };
}
