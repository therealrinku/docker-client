import { ipcMain } from 'electron';
import { exec } from 'child_process';

export function ipcHandlers(mainWindow: Electron.BrowserWindow | null) {
  ipcMain.on("ipc-load-containers", (event) => {
    exec("docker inspect $(docker ps -a -q) | jq '[.[] | {id: .Id, name: .Name, status: .State.Status, ports: .NetworkSettings.Ports}]'", (error, stdout, stderr) => {
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


