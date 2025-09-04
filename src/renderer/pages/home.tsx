import useAppState from '../hooks/use-app-state';
import Loading2 from '../components/common/loading2';
import { FiDatabase, FiImage } from 'react-icons/fi';
import { useState } from 'react';

export default function Home() {
  const { isAppLoading } = useAppState();
  const [selectedTab, setSelectedTab] = useState<"containers" | "images">("containers")

  if (isAppLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen text-xs gap-2">
        <Loading2 />
      </div>
    );
  }

  function getTabContent(){
    if(selectedTab === "containers"){
      
    } else if (selectedTab === "images") {
      
    }
  }
  
  return (
    <div className="flex flex-col h-screen w-screen text-xs gap-2 px-5">
      <div className="flex flex-col gap-3 font-bold border-r border-gray-200 h-screen w-[25%] py-5 max-w-[300px]">
        <button className='flex items-center gap-1' onClick={()=>setSelectedTab("containers")}>
          <FiDatabase />
          <p>Containers</p>
        </button>
        <button className='flex items-center gap-1' onClick={()=>setSelectedTab("images")}>
          <FiImage />
          <p>Images</p>
        </button>
      </div>

      <div>
          {getTabContent()}
      </div>
    </div>
  );
}
