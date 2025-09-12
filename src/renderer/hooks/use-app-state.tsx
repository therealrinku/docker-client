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

  function startContainer(id: number){
    window.electron.ipcRenderer.sendMessage('ipc-start-container', id);
  }

  function stopContainer(id: number) {
    window.electron.ipcRenderer.sendMessage('ipc-stop-container', id);
  }

  function deleteImage(id: number){
    window.electron.ipcRenderer.sendMessage('ipc-delete-image', id);
  }

  return {
    images,
    containers,
    fetchContainers,
    fetchImages,
    isAppLoading,
    startContainer,
    stopContainer,
    deleteImage
  }
}
