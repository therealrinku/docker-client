import {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from 'react';
import type { IImage, IContainer, INetwork, IVolume } from '../global';

interface IRootContext {
  isAppLoading: boolean;
  isDaemonRunning: boolean;
  images: IImage[];
  containers: IContainer[];
  volumes: IVolume[];
  networks: INetwork[];
}

export const RootContext = createContext<IRootContext>({
  isAppLoading: false,
  isDaemonRunning: false,
  images: [],
  containers: [],
  volumes: [],
  networks: [],
});

export function RootContextProvider({ children }: PropsWithChildren) {
  const [isAppLoading, setIsAppLoading] = useState<boolean>(false);
  const [isDaemonRunning, setIsDaemonRunning] = useState(false);

  const [images, setImages] = useState<IImage[]>([]);
  const [containers, setContainers] = useState<IContainer[]>([]);
  const [volumes, setVolumes] = useState<IVolume[]>([]);
  const [networks, setNetworks] = useState<INetwork[]>([]);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('ipc-check-docker-daemon-status');

    if (isDaemonRunning) {
      window.electron.ipcRenderer.sendMessage('ipc-load-containers');
      window.electron.ipcRenderer.sendMessage('ipc-load-images');
      window.electron.ipcRenderer.sendMessage('ipc-load-volumes');
      window.electron.ipcRenderer.sendMessage('ipc-load-networks');
    }
  }, [isDaemonRunning])

  useEffect(() => {
    window.electron.ipcRenderer.on('ipc-check-docker-daemon-status', (running) => {
      setIsDaemonRunning(Boolean(running));
    })

    window.electron.ipcRenderer.on('ipc-toggle-container-is-processing-state', (id) => {
      const copy = [...containers];
      const c_idx = copy.findIndex(ctr => ctr.id.toString() === id);
      copy[c_idx].isProcessing = !copy[c_idx].isProcessing;
      setContainers(copy);
    })

    window.electron.ipcRenderer.on('ipc-toggle-image-is-processing-state', (id) => {
      const copy = [...images];
      const c_idx = copy.findIndex(ctr => ctr.id.toString() === id);
      copy[c_idx].isProcessing = !copy[c_idx].isProcessing;
      setImages(copy);
    })

    window.electron.ipcRenderer.on('ipc-load-containers', (data) => {
      //@ts-expect-error
      setContainers(JSON.parse(data));
    });

    window.electron.ipcRenderer.on('ipc-load-volumes', (data) => {
      //@ts-expect-error
      setVolumes(JSON.parse(data));
    });

    window.electron.ipcRenderer.on('ipc-load-networks', (data) => {
      //@ts-expect-error
      setNetworks(JSON.parse(data));
    });

    window.electron.ipcRenderer.on('ipc-load-images', (data) => {
      //@ts-expect-error
      setImages(JSON.parse(data));
    });
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on('ipc-error-event', (error) => {
      //@ts-expect-error
      const message = (error.message ?? error) as string;
      alert(message || 'Something went wrong');
    });
  }, []);

  return (
    <RootContext.Provider value={{ isAppLoading, images, containers, networks, volumes, isDaemonRunning }}>
      {children}
    </RootContext.Provider>
  );
}
