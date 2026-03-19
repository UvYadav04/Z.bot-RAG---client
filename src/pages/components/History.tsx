import React, { useEffect, useState } from 'react'
import { useGetChatIdQuery, useGetChatsQuery, useLazyNewChatQuery, useUpdateCurrentChatIdMutation } from '../../services/chatApiSlice'
import { useChatContext } from '../../context/chatContext'
import { toast } from 'sonner'
import { SquarePen } from 'lucide-react'
import type { userChatInterface } from './Chatbox'
import { useGetUserInfoQuery } from '../../services/userApiSlice'

function History() {

    const [setSelectedChatId, { isLoading: settingChatId }] = useUpdateCurrentChatIdMutation()
    const { currentChatId, setCurrentChatId, selectedChat, setSelectedChat, setCurrentMessages } = useChatContext()
    const [userChats, setUserChats] = useState<userChatInterface[]>([])
    const { data } = useGetChatsQuery()
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
        console.log(data)
        if (data) {
            if (data?.chats)
                setUserChats(data?.chats)
            else
                setCurrentMessages([])
        }
    }, [data])

    useEffect(() => {
        console.log(chatIdInfo)
        if (chatIdInfo?.chatId)
            setCurrentChatId(chatIdInfo.chatId)
        else
            setCurrentChatId("")
    }, [chatIdInfo])

    useEffect(() => {
        if (userChats) {
            console.log(selectedChat)
            console.log(data?.chats)
            const currentChats = data?.chats?.find((item) => (item.chat_id === (selectedChat || currentChatId))) || null
            console.log(currentChats)
            if (currentChats)
                setCurrentMessages(currentChats.messages)
            else
                setCurrentMessages([])
            // setCurrentChatInfo(currentChats)
        }
    }, [selectedChat, currentChatId, userChats])

    if (!userChats || userChats?.length === 0)
        return null;

    return (
        <div className='w-full h-2/5   pb-1   box-border flex flex-col  border-t-2 border-white'>
            <div className="chatsList  w-full h-full  flex flex-col place-content-start gap-2">

                <h2 className='text-white/80 text-xl'>Continue chats...</h2>
                <div className="chatList flex flex-col-reverse gap-1 place-content-start place-items-start w-full overflow-y-scroll " style={{ scrollbarWidth: 'none' }}>
                    {userChats?.map((item) => {
                        return (
                            <div
                                onClick={() => handleSetChatId(item.chat_id)}
                                className={`relative ${item.chat_id === (selectedChat || currentChatId) ? "bg-white/40" : "bg-white/80"} w-full flex place-content-start  rounded-xs box-border px-2 cursor-pointer text-(--text) h-6`}
                            >
                                <h3 className="w-full min-w-0 overflow-hidden truncate max-w-full text-sm">
                                    {item.name || item._id}
                                </h3>

                                {item.createdAt && (
                                    <h6 className="w-fit absolute text-[9px] -bottom-[9px] right-1">
                                        {(() => {
                                            const itemTime = new Date(item.createdAt)
                                            const todayDate = (new Date()).getDate()
                                            if (itemTime.getDate() === todayDate)
                                                return itemTime.toLocaleTimeString()
                                            return itemTime.toDateString()
                                        })()}
                                    </h6>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default History
