import { ipcMain } from 'electron';
import { exec } from 'child_process';

export function ipcHandlers(_mainWindow: Electron.BrowserWindow | null) {
  ipcMain.on("ipc-start-docker-daemon", (event) => {
    exec("open -a Docker", (error, _stdout, stderr) => {
      if (error || stderr) {
        return event.reply("ipc-error-event", error ?? stderr);
      }


      ipcMain.emit("ipc-load-containers", event);
      ipcMain.emit("ipc-load-images", event);
    })
  })

  ipcMain.on("ipc-load-containers", (event) => {
    exec("docker inspect $(docker ps -a -q) | jq '[.[] | {id: .Id, name: .Name, status: .State.Status, ports: .NetworkSettings.Ports}]'", (error, stdout, stderr) => {
      if (error || stderr) {
        return event.reply("ipc-error-event", error ?? stderr);
      }

      event.reply("ipc-load-containers", stdout);
    });
  })

  ipcMain.on("ipc-load-images", (event) => {
    exec("docker image ls -q | xargs -I {} docker inspect {} | jq '[.[] | {id: .Id, repository: .RepoTags, size: .Size}]'", (error, stdout, stderr) => {
      if (error || stderr) {
        return event.reply("ipc-error-event", error ?? stderr);
      }

      event.reply("ipc-load-images", stdout);
    });
  })
}


