import { ipcMain } from 'electron';
import { exec } from 'child_process';

async function asyncExec(cmd: string) {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err || stderr) {
        reject(err || stderr);
      }
      return resolve(stdout);
    })
  }).catch(err => {
    throw err;
  })
}


export function ipcHandlers(_mainWindow: Electron.BrowserWindow | null) {
  ipcMain.on("ipc-start-container", async (event, c_id) => {
    event.reply("ipc-toggle-container-is-processing-state", c_id);

    try {
      await asyncExec(`docker start ${c_id}`);
      ipcMain.emit("ipc-load-containers", event);
      event.reply("ipc-toggle-container-is-processing-state", c_id);
    } catch (err) {
      event.reply("ipc-error-event", err);
    }
  })

  ipcMain.on("ipc-stop-container", async (event, c_id) => {
    event.reply("ipc-toggle-container-is-processing-state", c_id);

    try {
      await asyncExec(`docker stop ${c_id}`);
      ipcMain.emit("ipc-load-containers", event);
      event.reply("ipc-toggle-container-is-processing-state", c_id);
    } catch (err) {
      event.reply("ipc-error-event", err);
    }
  })

  ipcMain.on("ipc-start-docker-daemon", async (event) => {
    try {
      await asyncExec(`open -a Docker`);
      ipcMain.emit("ipc-load-containers", event);
      ipcMain.emit("ipc-load-volumes", event);
      ipcMain.emit("ipc-load-networks", event);
      ipcMain.emit("ipc-load-images", event);
    } catch (err) {
      event.reply("ipc-error-event", err);
    }
  })

  ipcMain.on("ipc-check-docker-daemon-status", async (event) => {
    try {
      await asyncExec(`docker info`);
    } catch (err: any) {
      const isDaemonNotRunning = err?.message?.includes('Is the docker daemon running?')
      event.reply("ipc-check-docker-daemon-status", !isDaemonNotRunning);
    }
  })

  ipcMain.on("ipc-load-containers", async (event) => {
    try {
      const data = await asyncExec("docker ps -a -q | xargs docker inspect | jq '[.[] | {id: .Id, name: .Name, status: .State.Status, ports: .NetworkSettings.Ports}] | flatten'");
      event.reply("ipc-load-containers", data);
    } catch (err) {
      event.reply("ipc-error-event", err);
    }
  })

  ipcMain.on("ipc-load-images", async (event) => {
    try {
      const data = await asyncExec("docker image ls -q | xargs docker inspect | jq '[.[] | {id: .Id, repository: .RepoTags, size: .Size}] | flatten'");
      event.reply("ipc-load-images", data);
    } catch (err) {
      event.reply("ipc-error-event", err);
    }
  })

  ipcMain.on("ipc-load-volumes", async (event) => {
    try {
      const data = await asyncExec("docker volume ls -q | xargs docker inspect | jq '[.[] | {driver: .Driver, name: .Name}] | flatten'");
      event.reply("ipc-load-volumes", data);
    } catch (err) {
      event.reply("ipc-error-event", err);
    }
  })

  ipcMain.on("ipc-load-networks", async (event) => {
    try {
      const data = await asyncExec("docker network ls -q | xargs docker inspect | jq '[.[] | {id: .Id, name: .Name}] | flatten'");
      event.reply("ipc-load-networks", data);
    } catch (err) {
      event.reply("ipc-error-event", err);
    }
  })

  ipcMain.on("ipc-delete-image", async (event, img_id) => {
    event.reply("ipc-toggle-image-is-processing-state", img_id);

    try {
      await asyncExec(`docker image rm ${img_id}`);
      event.reply("ipc-toggle-image-is-processing-state", img_id);
      ipcMain.emit("ipc-load-images", event);
    } catch (err) {
      event.reply("ipc-error-event", err);
    }
  })

  ipcMain.on("ipc-delete-container", async (event, c_id) => {
    event.reply("ipc-toggle-container-is-processing-state", c_id);

    try {
      await asyncExec(`docker rm ${c_id}`);
      event.reply("ipc-toggle-container-is-processing-state", c_id);
      ipcMain.emit("ipc-load-containers", event);
    } catch (err) {
      event.reply("ipc-error-event", err);
    }
  })


  ipcMain.on("ipc-delete-volume", async (event, vol_name) => {
    event.reply("ipc-toggle-volume-is-processing-state", vol_name);

    try {
      await asyncExec(`docker volume rm ${vol_name}`);
      event.reply("ipc-toggle-volume-is-processing-state", vol_name);
      ipcMain.emit("ipc-load-volumes", event);
    } catch (err) {
      event.reply("ipc-error-event", err);
    }
  })


  ipcMain.on("ipc-delete-network", async (event, net_id) => {
    event.reply("ipc-toggle-network-is-processing-state", net_id);

    try {
      await asyncExec(`docker network rm ${net_id}`);
      event.reply("ipc-toggle-network-is-processing-state", net_id);
      ipcMain.emit("ipc-load-networks", event);
    } catch (err) {
      event.reply("ipc-error-event", err);
    }
  })

  ipcMain.on("ipc-create-volume", async (event, volume_name) => {
    try {
      await asyncExec(`docker volume create ${volume_name}`);
      ipcMain.emit("ipc-load-volumes", event);
    } catch (err) {
      event.reply("ipc-error-event", err);
    }
  })
}


