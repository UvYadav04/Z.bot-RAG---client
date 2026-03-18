
import { useState, type Dispatch, type SetStateAction } from 'react';
import { MinusCircleIcon, PlusCircleIcon, SquarePen } from 'lucide-react';
import UserProfile from './UserProfile';
import DocumentSection from './Document';
import { v4 as uuid } from "uuid"
import { useChatContext } from '../context/chatContext';


function Sidebar() {
    const { setCurrentChatId } = useChatContext()
    return (
        <div className='w-1/4 pt-2 px-2  h-screen bg-white text-(--foreground) flex flex-col place-content-start place-items-center'>
            <p className='text-lg font-bold w-full text-start p text-blue-800'>Z.bot</p>
            <div className='border-top h-0 border-blue-800 border mb-2 w-full ' />
            <button className='w-full cursor-pointer py-0 px-3 border-2 text-(--text) border-(--border) flex place-content-center gap-2 place-items-center' onClick={() => {
                setCurrentChatId(uuid())
            }}><h4>New Chat</h4> <SquarePen size={20} /></button>
            <DocumentSection />
            <UserProfile />
        </div>
    )
}

export default Sidebar




