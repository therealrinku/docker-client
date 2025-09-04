import {
  Dispatch,
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from 'react';
import type { IImage, IContainer } from '../global';

interface IRootContext {
  isAppLoading: boolean;
  images: IImage[];
  containers: IContainer[];
}

export const RootContext = createContext<IRootContext>({
  isAppLoading: false,
  images: [],
  containers: [],
});

export function RootContextProvider({ children }: PropsWithChildren) {
  const [isAppLoading, setIsAppLoading] = useState<boolean>(false);
  const [images, setImages] = useState<IImage[]>([]);
  const [containers, setContainers] = useState<IContainer[]>([]);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('ipc-load-containers');
    window.electron.ipcRenderer.sendMessage('ipc-load-images');

    window.electron.ipcRenderer.on('ipc-load-containers', (args) => {
      //@ts-expect-error
      setContainers(JSON.parse(args));
    });

    window.electron.ipcRenderer.on('ipc-load-images', (args) => {
      //@ts-expect-error
      setImages(JSON.parse(args));
    });
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on('ipc-error-event', (args) => {
      //@ts-expect-error
      const message = args.message as string;
      alert(message || 'Something went wrong');
    });
  }, []);

  return (
    <RootContext.Provider value={{ isAppLoading, images, containers }}>
      {children}
    </RootContext.Provider>
  );
}
