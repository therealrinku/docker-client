import { useContext } from 'react';
import { RootContext } from '../context/root-context';

export default function useAppState() {
  const { isAppLoading, images, containers } = useContext(RootContext);

  function fetchContainers() {
    window.electron.ipcRenderer.sendMessage('ipc-load-containers');
  }

  function fetchImages() {
    window.electron.ipcRenderer.sendMessage('ipc-load-images');
  }

  return {
    images,
    containers,
    fetchContainers,
    fetchImages,
    isAppLoading
  }
}
