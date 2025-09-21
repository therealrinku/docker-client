import { useContext } from 'react';
import { RootContext } from '../context/root-context';

export default function useAppState() {
  const { isAppLoading, isDaemonRunning, images, containers, volumes, networks } = useContext(RootContext);

  function createVolume(name: string){
    window.electron.ipcRenderer.sendMessage('ipc-create-volume', name);
  }

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

  function deleteVolume(name: string) {
    const confirmed = confirm("Are you sure want to delete this volume?");
    if (!confirmed) {
      return;
    }
    window.electron.ipcRenderer.sendMessage('ipc-delete-volume', name);
  }

  function deleteNetwork(id: string) {
    const confirmed = confirm("Are you sure want to delete this network?");
    if (!confirmed) {
      return;
    }
    window.electron.ipcRenderer.sendMessage('ipc-delete-network', id);
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
    deleteNetwork,
    deleteVolume,
    isDaemonRunning,
    checkDockerDaemonStatus,
    createVolume
  }
}
