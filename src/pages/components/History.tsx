import React, { useEffect, useState } from 'react'
import { useGetChatIdQuery, useGetChatsQuery, useLazyNewChatQuery, useUpdateCurrentChatIdMutation } from '../../services/chatApiSlice'
import { useChatContext } from '../../context/chatContext'
import { toast } from 'sonner'
import { Loader, SquarePen } from 'lucide-react'
import type { userChatInterface } from './Chatbox'
import { useGetUserInfoQuery } from '../../services/userApiSlice'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

function History() {

    const [setSelectedChatId, { isLoading: settingChatId }] = useUpdateCurrentChatIdMutation()
    const { currentChatId, setCurrentChatId, selectedChat, setSelectedChat, setCurrentMessages } = useChatContext()
    const [userChats, setUserChats] = useState<userChatInterface[]>([])
    const { data, isLoading: gettingChats } = useGetChatsQuery()
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

    if (!userChats || userChats?.length === 0)
        return null;

    return (
        <div className='w-full h-[40%]   pb-1   box-border flex flex-col place-content-start place-items-center border-t-2 border-white'>
            {gettingChats && <div className='lg:size-32 size-20 my-auto'>
                <DotLottieReact
                    // src="public/robo.lottie"
                    src="public/Robot-Bot 3D.lottie"
                    loop
                    autoplay
                />
            </div>}
            {
                !gettingChats && <div className="chatsList  w-full h-full  flex flex-col place-content-start gap-2 pt-1">

                    <h2 className='text-white/80 text-xl font-semibold -mb-1 bg-slate-100/10 px-1 font-mono rounded-sm'>Continue Chats</h2>
                    <div className="chatList flex flex-col gap-1 place-content-start place-items-start w-full overflow-y-scroll " style={{ scrollbarWidth: 'none' }}>
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
            }
        </div>
    )
}

export default History
