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
            {/* Mobile */}
            <div className="lg:hidden flex items-center p-2 fixed top-2 left-2 ">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu size={20} />
                        </Button>
                    </SheetTrigger>

                    <SheetContent
                        side="left"
                        className="w-72 p-0 bg-background/95 backdrop-blur border-r border-border"
                    >
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>

            <div className=" hidden lg:flex h-full w-72 ">
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
        <div className="h-full flex w-full flex-col p-3 gap-2 bg-background/80 backdrop-blur ">

            {/* New Chat Button */}
            <button
                onClick={handleNewChat}
                className="flex items-center justify-center gap-2 px-3 py-[8px] rounded-sm
        bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium 
        transition-all shadow-sm hover:shadow-md"
            >
                <SquarePen size={18} />
                New Chat
            </button>

            {/* Documents */}
            <div className="flex flex-col min-h-0">
                <DocumentSection />
            </div>

            {/* History */}
            <div className="flex flex-col min-h-0 flex-1">
                <History />
            </div>

            {/* User */}
            <UserProfile />
        </div>
    )
}