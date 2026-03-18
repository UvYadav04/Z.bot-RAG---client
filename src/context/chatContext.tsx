import React, { useContext, useState, type Dispatch, type SetStateAction } from "react"

interface chatContextInterface {
    currentChatId: string,
    setCurrentChatId: Dispatch<SetStateAction<string>>,
    currentUsingDocs: Set<string>,
    setCurrentUsingDocs: Dispatch<SetStateAction<Set<string>>>,
}

const ChatContext = React.createContext<chatContextInterface | null>(null)

export const ChatContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUsingDocs, setCurrentUsingDocs] = useState<Set<string>>(new Set())
    const [currentChatId, setCurrentChatId] = useState<string>("")

    return <ChatContext.Provider value={{ currentUsingDocs, setCurrentUsingDocs, currentChatId, setCurrentChatId }}>
        {children}
    </ChatContext.Provider>
}


export const useChatContext = () => {
    const context = useContext(ChatContext)
    if (!context)
        throw new Error("useChatContext can be used only under Use Chat Context Provider")
    return context
}