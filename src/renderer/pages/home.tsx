import useAppState from '../hooks/use-app-state';
import Loading2 from '../components/common/loading2';
import { FiChrome, FiDatabase, FiDisc, FiImage, FiLoader, FiPlay, FiStopCircle, FiTrash2 } from 'react-icons/fi';
import { useState } from 'react';

export default function Home() {
  const { isAppLoading, containers, images, volumes, networks, startContainer, stopContainer, deleteImage, deleteContainer } = useAppState();
  const [selectedTab, setSelectedTab] = useState<"containers" | "images" | "volumes" | "networks">("containers")

  if (isAppLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen text-xs gap-2">
        <Loading2 />
      </div>
    );
  }

  function getTabContent() {
    if (selectedTab === "containers") {
      return (
        <div className='flex flex-col gap-2'>
          <p className='font-bold'>Containers</p>
          {containers.map(container => {
            return <div key={container.id} className='bg-gray-200 w-full p-2 flex items-center gap-2'>
              <p>{container.name}</p>
              <p className='font-bold'>{container.status}</p>
              {container.isProcessing ? <FiLoader className="ml-auto animate-spin" />
                : container.status === "exited" ?
                  <div className='ml-auto flex items-center gap-4'>
                    <button onClick={() => startContainer(container.id)}><FiPlay /></button>
                    <button onClick={() => deleteContainer(container.id)}><FiTrash2 color='red' /></button>
                  </div>
                  :
                  <button className='ml-auto' onClick={() => stopContainer(container.id)}><FiStopCircle /></button>
              }
            </div>
          })}
        </div>
      )

    } else if (selectedTab === "images") {
      return (
        <div className='flex flex-col gap-2'>
          <p className='font-bold'>Images</p>
          {images.map(image => {
            return <div key={image.id} className='bg-gray-200 w-full p-2 flex items-center gap-2'>
              <p>{image.repository.join(",")}</p>
              <p className='font-bold'>{image.size}</p>
              {image.isProcessing ? <FiLoader className="ml-auto animate-spin" /> :
                <button className='ml-auto' onClick={() => deleteImage(image.id)}><FiTrash2 color='red' /></button>
              }
            </div>
          })}
        </div>
      )
    } else if (selectedTab === "volumes") {
      return (
        <div className='flex flex-col gap-2'>
          <p className='font-bold'>Volumes</p>
          {volumes.map(volume => {
            return <div key={volume.name} className='bg-gray-200 w-full p-2 flex items-center gap-2'>
              <p>{volume.name}</p>
            </div>
          })}
        </div>
      )
    } else if (selectedTab === "networks") {
      return (
        <div className='flex flex-col gap-2'>
          <p className='font-bold'>Networks</p>
          {networks.map(network => {
            return <div key={network.id} className='bg-gray-200 w-full p-2 flex items-center gap-2'>
              <p>{network.name}</p>
            </div>
          })}
        </div>
      )
    }
  }

  return (
    <div className="flex h-screen w-screen text-xs gap-2 px-5">
      <div className="flex flex-col gap-3 font-bold border-r border-gray-200 h-screen w-[25%] py-5 max-w-[300px]">
        <button className='flex items-center gap-1' onClick={() => setSelectedTab("containers")}>
          <FiDatabase />
          <p>Containers</p>
        </button>
        <button className='flex items-center gap-1' onClick={() => setSelectedTab("images")}>
          <FiImage />
          <p>Images</p>
        </button>
        <button className='flex items-center gap-1' onClick={() => setSelectedTab("volumes")}>
          <FiDisc />
          <p>Volumes</p>
        </button>
        <button className='flex items-center gap-1' onClick={() => setSelectedTab("networks")}>
          <FiChrome />
          <p>Networks</p>
        </button>
      </div>

      <div className='w-[75%] flex flex-col gap-2 py-4'>
        {getTabContent()}
      </div>
    </div>
  );
}
