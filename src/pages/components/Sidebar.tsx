import { Menu, SquarePen } from "lucide-react"
import { useChatContext } from "../../context/chatContext"
import { useLazyNewChatQuery } from "../../services/chatApiSlice"
import { toast } from "sonner"
import DocumentSection from "./Document"
import History from "./History"
import UserProfile from "./UserProfile"
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet"
import { Button } from "../../components/ui/button"
function Sidebar() {
    return (
        <>
            {/* ✅ Mobile Navbar */}
            <div className=" lg:hidden flex place-content-start  place-items-center p-2">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu size={20} />
                        </Button>
                    </SheetTrigger>

                    <SheetContent side="left" style={{ background:'url(public/background.jpg)'}} className="w-44 p-0 bg-slate-600">
                        <SidebarContent />
                    </SheetContent>
                </Sheet>

                {/* <h2 className="ml-3 font-semibold">Z.bot</h2> */}
            </div>

            {/* ✅ Desktop Sidebar */}
            <div className="lg:flex hidden  w-1/4 h-screen">
                <SidebarContent />
            </div>
        </>
    )
}

export default Sidebar






function SidebarContent() {
    const { setCurrentChatId, setSelectedChat } = useChatContext()
    const [createNewChat] = useLazyNewChatQuery()

    const handleNewChat = async () => {
        const { chatId, success, message } = await createNewChat().unwrap()
        if (!success) {
            toast.info(message)
            return
        }
        setSelectedChat(chatId)
        setCurrentChatId(chatId)
    }

    return (
        <div className='w-full h-full pt-0 px-2 flex flex-col gap-2'>
            <div className=' h-0 border-white mb-2 w-full ' />
            <button
                className='w-full cursor-pointer py-1 max-h-[10%] rounded-sm text-(--text) bg-white/80 flex place-content-center gap-2 place-items-center'
                onClick={handleNewChat}
            >
                <h4>New Chat</h4>
                <SquarePen size={20} />
            </button>

            <DocumentSection />
            <History />
            <UserProfile />
        </div>
    )
}