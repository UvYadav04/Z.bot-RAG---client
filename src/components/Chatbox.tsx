import React, { useEffect, useRef, useState } from 'react'
import { useChatContext } from '../context/chatContext';
import { useGetChatIdQuery, useGetChatsQuery } from '../services/chatApiSlice';
import Markdown from "react-markdown"
import { toast } from 'sonner';
export interface messagesInterface {
  content: string,
  role: "user" | "zensky" | "assistant",
  time?: string,
}

export interface userChatInterface {
  messages: messagesInterface[],
  _id: string,
  name: string,
  createdAt: string,
  chat_id: string
}

function ChatBox() {
  const [current, setCurrent] = useState(''); // text input
  const [result, setResult] = useState('');   // streaming result
  const [loading, setLoading] = useState(false)
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const [currentMessages, setCurrentMessages] = useState<messagesInterface[]>([])
  const [currentChatInfo, setCurrentChatInfo] = useState<userChatInterface | null>(null)
  const { currentChatId, currentUsingDocs } = useChatContext()
  const [userChats, setUserChats] = useState<userChatInterface[]>([])
  const { data } = useGetChatsQuery()
  const { data: chatId } = useGetChatIdQuery()
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  // console.log(chatId)

  const streamResponse = async (query: string) => {
    if (query === "") {
      toast.info("please send a valid input")
      return;
    }
    if (currentUsingDocs.size === 0) {
      toast.info("please upload or select some document to query")
      return;
    }
    setLoading(true)
    setCurrent("")
    setCurrentMessages((prev) => {
      return ([...prev, { content: query, time: Date.now().toString(), role: "user" }])
    })
    const res = await fetch("http://127.0.0.1:8000/chat/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ query, creativity: "medium", "selected_chat_id": selectedChat, "document_ids": Array.from(currentUsingDocs) }),
    });
    setLoading(false)

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let response = ""
    while (true) {
      const { done, value } = await reader!.read();
      if (done) {
        console.log(response)
        setCurrentMessages((prev) => {
          return ([...prev, { content: response, time: Date.now().toString(), role: "assistant" }])
        })
        setResult("")
        break;
      }
      const chunk = decoder.decode(value, { stream: true });
      response = response + chunk
      setResult(prev => prev + chunk);
    }
  };
  // auto scroll to bottom while streaming
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [result]);

  useEffect(() => {
    console.log(data)
    if (data) {
      console.log(data)
      setUserChats(data?.chats)
      const currentChats = data?.chats?.find((item) => item._id === (selectedChat || currentChatId))
      console.log(currentChats)
      if (currentChats) {
        setCurrentMessages(currentChats.messages)
        setCurrentChatInfo(currentChats)
      }
    }
  }, [data, currentChatId])

  useEffect(() => {
    if (userChats && selectedChat) {
      const currentChats = data?.chats?.find((item) => item._id === (selectedChat))
      console.log(currentChats)
      if (currentChats) {
        setCurrentMessages(currentChats.messages)
        setCurrentChatInfo(currentChats)
      }
    }
  }, [selectedChat, userChats])

  return (
    <div className="chatPage h-full w-full flex place-content-start place-items-center">
      <div className='w-4/6 h-screen bg-(--background) p-4 pb-1   box-border flex flex-col '>
        <div className="w-full h-full flex flex-col place-items-center place-content-start gap-3 ">
          < div
            ref={messagesRef}
            className="flex-1 flex flex-col overflow-y-scroll w-full h-full p-6 bg-white gap-4"
            style={{ scrollbarWidth: "none" }}
          >
            {loading && <div className="text-gray-500 mb-2">Thinking...</div>
            }
            {currentMessages?.map((item) => {
              return <MessageBox message={item} />
            })}
            {result && <MessageBox message={{ content: result, role: "zensky" }} />}
          </ div>

          < div className="border bottom-0 float-end  box-border w-full bg-white  flex gap-3 rounded-sm" >
            <input
              className="flex-1  px-3 py-[7.5px] outline-none text-sm"
              type="text"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="Ask something..."
            />

            <button
              className="= text-(--text) px-3 "
              onClick={() => streamResponse(current)}
            >
              Enter
            </button>
          </div >
        </div>
      </div>
      <div className='w-1/3 h-screen p-4 pb-1   box-border flex flex-col  '>
        <div className="chatsList bg-white w-full h-full p-3 flex flex-col place-content-start gap-2">
          <h2 className='text-(--text) bg-slate-100 text-xl'>History</h2>
          {userChats?.map((item) => {
            return (
              <div
                onClick={() => setSelectedChat(item.chat_id)}
                className="relative w-full flex place-content-start border-2 rounded-sm box-border px-2 cursor-pointer border-(--barder) text-(--text) h-8"
              >
                <h3 className="w-full min-w-0 overflow-hidden truncate max-w-full">
                  {item.name || item._id}
                </h3>

                {item.createdAt && (
                  <h6 className="w-fit absolute text-[9px] -bottom-[8px] right-1">
                    {new Date(item.createdAt).toDateString()}
                  </h6>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ChatBox


const MessageBox = ({ message }: { message: messagesInterface }) => {
  console.log(message)
  if (!message.role || !message.content)
    return null
  return (
    <div className={`flex w-full ${(message.role === "zensky") || (message.role === "assistant") ? "place-content-end" : "place-content-start"} place-items-center`}>
      <div className="message max-w-[90%] p-2 text-sm line-clamp-1  bg-[#93bac5]/50 rounded-md">
        <Markdown>
          {message.content}
        </Markdown>
      </div>
    </div>
  )
}