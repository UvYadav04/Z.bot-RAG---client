import React, { useContext, useState, type Dispatch, type SetStateAction } from "react"
import type { messagesInterface } from "../pages/components/Chatbox"

interface chatContextInterface {
    currentChatId: string,
    setCurrentChatId: Dispatch<SetStateAction<string>>,
    currentUsingDocs: Set<string>,
    setCurrentUsingDocs: Dispatch<SetStateAction<Set<string>>>,
    selectedChat: string | null,
    setSelectedChat: Dispatch<SetStateAction<string | null>>
    currentMessages: messagesInterface[],
    setCurrentMessages: Dispatch<SetStateAction<messagesInterface[]>>
}

const ChatContext = React.createContext<chatContextInterface | null>(null)

export const ChatContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUsingDocs, setCurrentUsingDocs] = useState<Set<string>>(new Set())
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