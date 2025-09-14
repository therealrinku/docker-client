import {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from 'react';
import type { IImage, IContainer, INetwork, IVolume } from '../global';

interface IRootContext {
  isAppLoading: boolean;
  images: IImage[];
  containers: IContainer[];
  volumes: IVolume[];
  networks: INetwork[];
}

export const RootContext = createContext<IRootContext>({
  isAppLoading: false,
  images: [],
  containers: [],
  volumes: [],
  networks: []
});

export function RootContextProvider({ children }: PropsWithChildren) {
  const [isAppLoading, setIsAppLoading] = useState<boolean>(false);

  const [images, setImages] = useState<IImage[]>([]);
  const [containers, setContainers] = useState<IContainer[]>([]);
  const [volumes, setVolumes] = useState<IVolume[]>([]);
  const [networks, setNetworks] = useState<INetwork[]>([]);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('ipc-load-containers');
    window.electron.ipcRenderer.sendMessage('ipc-load-images');
    window.electron.ipcRenderer.sendMessage('ipc-load-volumes');
    window.electron.ipcRenderer.sendMessage('ipc-load-networks');

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

    window.electron.ipcRenderer.on('ipc-load-containers', (args) => {
      //@ts-expect-error
      setContainers(JSON.parse(args));
    });

    window.electron.ipcRenderer.on('ipc-load-volumes', (args) => {
      //@ts-expect-error
      setVolumes(JSON.parse(args));
    });

    window.electron.ipcRenderer.on('ipc-load-networks', (args) => {
      //@ts-expect-error
      setNetworks(JSON.parse(args));
    });

    window.electron.ipcRenderer.on('ipc-load-images', (args) => {
      //@ts-expect-error
      setImages(JSON.parse(args));
    });
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on('ipc-error-event', (args) => {
      //@ts-expect-error
      const message = (args.message ?? args) as string;

      if (message.includes('Is the docker daemon running?')) {
        window.electron.ipcRenderer.sendMessage('ipc-start-docker-daemon');
        return;
      }

      alert(message || 'Something went wrong');
    });
  }, []);

  return (
    <RootContext.Provider value={{ isAppLoading, images, containers, networks, volumes }}>
      {children}
    </RootContext.Provider>
  );
}
