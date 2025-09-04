import { ipcMain } from 'electron';
import { exec } from 'child_process';

export function ipcHandlers(mainWindow: Electron.BrowserWindow | null) {
  ipcMain.on("ipc-load-containers", (event) => {
    exec('docker ps -a', (error, stdout, stderr) => {
      if (error) {
        return event.reply("ipc-error-event", error);
      }

      event.reply("ipc-load-containers", stdout);
    });
  })

  ipcMain.on("ipc-load-images", (event) => {
    exec('docker image ls', (error, stdout, stderr) => {
      if (error) {
        return event.reply("ipc-error-event", error);
      }

      event.reply("ipc-load-images", stdout);
    });
  })
}


