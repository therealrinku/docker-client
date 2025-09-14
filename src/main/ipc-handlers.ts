import { ipcMain } from 'electron';
import { exec } from 'child_process';

export function ipcHandlers(_mainWindow: Electron.BrowserWindow | null) {
  ipcMain.on("ipc-start-container", (event, c_id) => {
    event.reply("ipc-toggle-container-is-processing-state", c_id);

    exec(`docker start ${c_id}`, (error, _stdout, stderr) => {
      if (error || stderr) {
        return event.reply("ipc-error-event", error ?? stderr);
      }

      ipcMain.emit("ipc-load-containers", event);
      event.reply("ipc-toggle-container-is-processing-state", c_id);
    })
  })

  ipcMain.on("ipc-stop-container", (event, c_id) => {
    event.reply("ipc-toggle-container-is-processing-state", c_id);

    exec(`docker stop ${c_id}`, (error, _stdout, stderr) => {
      if (error || stderr) {
        return event.reply("ipc-error-event", error ?? stderr);
      }

      ipcMain.emit("ipc-load-containers", event);
      event.reply("ipc-toggle-container-is-processing-state", c_id);
    })
  })

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
    exec("docker image ls -q | xargs docker inspect | jq '[.[] | {id: .Id, repository: .RepoTags, size: .Size}]'", (error, stdout, stderr) => {
      if (error || stderr) {
        return event.reply("ipc-error-event", error ?? stderr);
      }
      event.reply("ipc-load-images", stdout);
    });
  })

  ipcMain.on("ipc-load-volumes", (event) => {
    exec("docker volume ls -q | xargs -I {} docker inspect {} | jq '[.[] | {driver: .Driver, name: .\"Volume Name\"}]'", (error, stdout, stderr) => {
      if (error || stderr) {
        return event.reply("ipc-error-event", error ?? stderr);
      }
      event.reply("ipc-load-volumes", stdout);
    });
  })

  ipcMain.on("ipc-load-networks", (event) => {
    exec("docker network ls | xargs docker inspect | jq '[.[] | {id: .\"Network Id\", name: .Name}]'", (error, stdout, stderr) => {
      if (error || stderr) {
        return event.reply("ipc-error-event", error ?? stderr);
      }
      event.reply("ipc-load-networks", stdout);
    });
  })

  ipcMain.on("ipc-delete-image", (event, img_id) => {
    event.reply("ipc-toggle-image-is-processing-state", img_id);

    exec(`docker image rm ${img_id}`, (error, _stdout, stderr) => {
      if (error || stderr) {
        return event.reply("ipc-error-event", error ?? stderr);
      }

      event.reply("ipc-toggle-image-is-processing-state", img_id);
      ipcMain.emit("ipc-load-images", event);
    });
  })

  ipcMain.on("ipc-delete-container", (event, c_id) => {
    event.reply("ipc-toggle-container-is-processing-state", c_id);

    exec(`docker rm ${c_id}`, (error, _stdout, stderr) => {
      if (error || stderr) {
        return event.reply("ipc-error-event", error ?? stderr);
      }

      event.reply("ipc-toggle-container-is-processing-state", c_id);
      ipcMain.emit("ipc-load-containers", event);
    });
  })
}


