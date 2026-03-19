
import { SquarePen } from 'lucide-react';
import UserProfile from './UserProfile';
import DocumentSection from './Document';
import { useChatContext } from '../context/chatContext';
import History from './History';
import { useLazyNewChatQuery } from '../services/chatApiSlice';
import { toast } from 'sonner';


function Sidebar() {
    const { setCurrentChatId, setSelectedChat } = useChatContext()
    const [createNewChat, { isLoading: creatingNewChat }] = useLazyNewChatQuery()


    // console.log(data)

    const handleNewChat = async () => {
        const { chatId, success, message } = await createNewChat().unwrap()
        if (!success) {
            toast.info(message)
            return
        }
        toast.info(chatId)
        setSelectedChat(chatId)
        setCurrentChatId(chatId)
    }

    return (
        <div className='w-1/4 pt-2 px-2  h-screen  text-(--foreground) flex flex-col place-content-start place-items-center'>
            {/* <p className='text-lg font-bold w-full text-start p text-blue-800'>Z.bot</p> */}
            <div className='border-top h-0 border-white border mb-2 w-full ' />
            <button className='w-full cursor-pointer py-0  rounded-sm text-(--text) bg-white/80 flex place-content-center gap-2 place-items-center' onClick={() => {
                handleNewChat()
            }}><h4>New Chat</h4> <SquarePen size={20} /></button>
            <DocumentSection />
            <History />
            <UserProfile />
        </div>
    )
}

export default Sidebar




