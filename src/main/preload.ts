import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  'ipc-load-images'
  | 'ipc-load-containers'
  | 'ipc-load-volumes'
  | 'ipc-load-networks'
  | 'ipc-error-event'
  | 'ipc-start-docker-daemon'
  | 'ipc-check-docker-daemon-status'
  | 'ipc-start-container'
  | 'ipc-stop-container'
  | 'ipc-toggle-container-is-processing-state'
  | 'ipc-toggle-image-is-processing-state'
  | 'ipc-toggle-network-is-processing-state'
  | 'ipc-toggle-volume-is-processing-state'
  | 'ipc-delete-image'
  | 'ipc-delete-volume'
  | 'ipc-delete-network'
  | 'ipc-delete-container'
  | 'ipc-create-volume'

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
