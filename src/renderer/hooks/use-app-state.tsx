import { useContext } from 'react';
import { RootContext } from '../context/root-context';

export default function useAppState() {
  const { isAppLoading, isDaemonRunning, images, containers, volumes, networks } = useContext(RootContext);

  function fetchContainers() {
    window.electron.ipcRenderer.sendMessage('ipc-load-containers');
  }

  function fetchImages() {
    window.electron.ipcRenderer.sendMessage('ipc-load-images');
  }

  function startContainer(id: string) {
    window.electron.ipcRenderer.sendMessage('ipc-start-container', id);
  }

  function stopContainer(id: string) {
    window.electron.ipcRenderer.sendMessage('ipc-stop-container', id);
  }

  function deleteImage(id: string) {
    const confirmed = confirm("Are you sure want to delete this image?");
    if (!confirmed) {
      return;
    }
    window.electron.ipcRenderer.sendMessage('ipc-delete-image', id);
  }

  function deleteContainer(id: string) {
    const confirmed = confirm("Are you sure want to delete this container?");
    if (!confirmed) {
      return;
    }
    window.electron.ipcRenderer.sendMessage('ipc-delete-container', id);
  }

  function checkDockerDaemonStatus() {
    window.electron.ipcRenderer.sendMessage('ipc-check-docker-daemon-status');
  }

  return {
    images,
    containers,
    volumes,
    networks,
    fetchContainers,
    fetchImages,
    isAppLoading,
    startContainer,
    stopContainer,
    deleteImage,
    deleteContainer,
    isDaemonRunning,
    checkDockerDaemonStatus
  }
}
