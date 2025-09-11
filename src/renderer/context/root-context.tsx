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
  toggleIsProcessingStateOfContainer: (c_id: string) => void;
}

export const RootContext = createContext<IRootContext>({
  isAppLoading: false,
  images: [],
  containers: [],
  toggleIsProcessingStateOfContainer: (c_id: string) => {}
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
      const message = (args.message ?? args) as string;

      if(message.includes('Is the docker daemon running?')) {
         window.electron.ipcRenderer.sendMessage('ipc-start-docker-daemon');
         return;
      }

      alert(message || 'Something went wrong');
    });
  }, []);

  function toggleIsProcessingStateOfContainer(c_id: string){
    const copy = [...containers];
    const c_index = copy.findIndex(c=>c.id.toString() === c_id);
    copy[c_index].isProcessing = !copy[c_index].isProcessing;
    setContainers(copy);
  }

  return (
    <RootContext.Provider value={{ isAppLoading, images, containers, toggleIsProcessingStateOfContainer}}>
      {children}
    </RootContext.Provider>
  );
}
