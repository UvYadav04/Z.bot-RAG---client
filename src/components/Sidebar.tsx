
import { useState, type Dispatch, type SetStateAction } from 'react';
import { MinusCircleIcon, PlusCircleIcon } from 'lucide-react';
import UserProfile from './UserProfile';
import DocumentSection from './Document';


function Sidebar() {

    return (
        <div className='w-1/5 pt-2 px-2  h-screen bg-white text-(--foreground) flex flex-col place-content-start place-items-center'>
            <p className='text-lg font-bold w-full text-start p text-blue-800'>Z.bot</p>
            <div className='border-top h-0 border-blue-800 border mb-2 w-full ' />
          <DocumentSection/>
            <UserProfile />
        </div>
    )
}

export default Sidebar




