import React, { useContext, useState, type Dispatch, type SetStateAction } from "react"
import type { messagesInterface } from "../pages/components/Chatbox"

interface chatContextInterface {
    currentChatId: string,
    setCurrentChatId: Dispatch<SetStateAction<string>>,
    currentUsingDocs: string | undefined,
    setCurrentUsingDocs: Dispatch<SetStateAction<string | undefined>>,
    selectedChat: string | null,
    setSelectedChat: Dispatch<SetStateAction<string | null>>
    currentMessages: messagesInterface[],
    setCurrentMessages: Dispatch<SetStateAction<messagesInterface[]>>
}

const ChatContext = React.createContext<chatContextInterface | null>(null)

export const ChatContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUsingDocs, setCurrentUsingDocs] = useState<string | undefined>(undefined)
    const [currentChatId, setCurrentChatId] = useState<string>("")
    const [selectedChat, setSelectedChat] = useState<string | null>(null)
    const [currentMessages, setCurrentMessages] = useState<messagesInterface[]>([])


    return <ChatContext.Provider value={{ currentUsingDocs, setCurrentUsingDocs, currentChatId, setCurrentChatId, selectedChat, setSelectedChat, currentMessages, setCurrentMessages }}>
        {children}
    </ChatContext.Provider>
}


export const useChatContext = () => {
    const context = useContext(ChatContext)
    if (!context)
        throw new Error("useChatContext can be used only under Use Chat Context Provider")
    return context
}