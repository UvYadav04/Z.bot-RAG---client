import { useEffect, useState } from 'react'
import { useGetChatIdQuery, useGetChatsQuery, useUpdateCurrentChatIdMutation } from '../../services/chatApiSlice'
import { useChatContext } from '../../context/chatContext'
import { toast } from 'sonner'
import type { userChatInterface } from './Chatbox'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import Retry from './Retry'

function History() {

    const [setSelectedChatId] = useUpdateCurrentChatIdMutation()
    const { currentChatId, setCurrentChatId, selectedChat, setSelectedChat, setCurrentMessages } = useChatContext()
    const [userChats, setUserChats] = useState<userChatInterface[]>([])
    const { data, isLoading: gettingChats, isFetching: fetchingChats, error: errorGettingChats, refetch } = useGetChatsQuery()
    const { data: chatIdInfo } = useGetChatIdQuery()
    


    const handleSetChatId = async (id: string) => {
        const { success, message } = await setSelectedChatId(id).unwrap()
        if (!success) {
            toast.info(message)
            return
        }
        setSelectedChat(id)
        setCurrentChatId(id)
    }

    useEffect(() => {
        if (data) {
            if (data?.chats)
                setUserChats(data?.chats)
            else
                setCurrentMessages([])
        }
    }, [data])

    useEffect(() => {
        if (chatIdInfo?.chatId)
            setCurrentChatId(chatIdInfo.chatId)
        else
            setCurrentChatId("")
    }, [chatIdInfo])

    useEffect(() => {
        if (userChats) {
            const currentChats = data?.chats?.find((item) => (item.chat_id === (selectedChat || currentChatId))) || null
            console.log(data?.chats)
            if (currentChats)
                setCurrentMessages(currentChats.messages)
            else
                setCurrentMessages([])
            // setCurrentChatInfo(currentChats)
        }
    }, [selectedChat, currentChatId, userChats])

    console.log(userChats)

    if (!userChats || userChats?.length === 0)
        return null;


    return (
        <div className="w-full flex flex-col gap-3 min-h-0 flex-1 border-t border-border pt-3">

            {/* Header */}
            <h2 className="text-sm font-semibold text-muted-foreground px-1">
                Continue Chats
            </h2>

            {/* Loading */}
            {(gettingChats || (errorGettingChats && fetchingChats)) && (
                <div className="flex-1 flex items-center justify-center opacity-80">
                    <div className="w-20">
                        <DotLottieReact
                            src="Robot-Bot 3D.lottie"
                            loop
                            autoplay
                        />
                    </div>
                </div>
            )}

            {/* Error */}
            {(errorGettingChats && !gettingChats && !fetchingChats) && (
                <Retry message="Failed to load chats" className="mt-2" retry={refetch} />
            )}

            {/* Chat List */}
            {!gettingChats && !errorGettingChats && (
                <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-1 pr-1" style={{scrollbarWidth:"none"}}>

                    {userChats?.map((item) => {
                        const isActive = item.chat_id === (selectedChat || currentChatId)

                        return (
                            <div
                                key={item.chat_id}
                                onClick={() => handleSetChatId(item.chat_id)}
                                className={`group relative flex flex-col px-3 py-2 pb-1 rounded-xs cursor-pointer transition-all border
                ${isActive
                                        ? "bg-orange-500/10 border-orange-500/30"
                                        : "bg-background hover:bg-muted border-transparent"
                                    }
              `}
                            >
                                {/* Title */}
                                <p className="text-xs truncate">
                                    {item.name || item._id}
                                </p>

                                {/* Time */}
                                {item.createdAt && (
                                    <span className="text-[8px] text-muted-foreground mt-1 absolute right-1 -bottom-2">
                                        {(() => {
                                            const itemTime = new Date(item.createdAt)
                                            const today = new Date()

                                            if (
                                                itemTime.toDateString() === today.toDateString()
                                            ) {
                                                return itemTime.toLocaleTimeString()
                                            }
                                            return itemTime.toDateString()
                                        })()}
                                    </span>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )

}

export default History
