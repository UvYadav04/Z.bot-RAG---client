import  { useCallback, useEffect, useRef, useState } from 'react'
import { useChatContext } from '../../context/chatContext';
import { useGetChatsQuery} from '../../services/chatApiSlice';
import Markdown from "react-markdown"
import { toast } from 'sonner';
import { useGetUserInfoQuery } from '../../services/userApiSlice';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

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
  const { currentUsingDocs, selectedChat, currentMessages, setCurrentMessages } = useChatContext()
  const { refetch } = useGetChatsQuery()

  const streamResponse = useCallback(async (query: string) => {
    try {
      if (query === "") {
        toast.info("please send a valid input")
        return;
      }
      // toast.info(currentUsingDocs.size)
      if (currentUsingDocs.size === 0) {
        toast.info("please upload or select some document to query")
        return;
      }
      setLoading(true)
      setCurrent("")
      setCurrentMessages((prev) => {
        return ([...prev, { content: query, time: Date.now().toString(), role: "user" }])
      })
      const controller = new AbortController();

      const timeout = setTimeout(() => {
        controller.abort();
      }, 10000)
      const res = await fetch(`${import.meta.env.VITE_SERVER_URI}/chat/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ query, creativity: "medium", "selected_chat_id": selectedChat, "document_ids": Array.from(currentUsingDocs) }),
        signal: controller.signal
      });
      clearTimeout(timeout)
      setLoading(false)
      if (!res.ok) {

        const errorText = await res.text(); // or res.json()
        throw new Error(errorText || "Something went wrong");
      }
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let response = ""
      while (true) {
        const { done, value } = await reader!.read();
        if (done) {
          if (currentMessages.length === 0)
            refetch()
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
    } catch (error) {
      setLoading(false)
      setCurrentMessages((prev) => {
        return ([...prev, { content: "I am sorry, I couldnot generate response, please try again!!", time: Date.now().toString(), role: "assistant" }])
      })
      setResult("")
    }
  }, [currentMessages, currentUsingDocs, setCurrentMessages, setResult])
  // auto scroll to bottom while streaming
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTo({
        top: messagesRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [result, currentMessages]);

  useEffect(() => {
    const handleKeyDown = (e:KeyboardEvent) => {
      if (e.key === 'Enter' && current !== "") { 
        if (e.shiftKey) {
          e.preventDefault();

          const target = e.target as HTMLTextAreaElement;
          const start = target.selectionStart;
          const end = target.selectionEnd;

          const newValue =
            current.slice(0, start) + "\n" + current.slice(end);

          setCurrent(newValue);

          // move cursor to correct position
          setTimeout(() => {
            target.selectionStart = target.selectionEnd = start + 1;
          }, 0);

        } else {
          e.preventDefault();
          streamResponse(current)
        }
      }

    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [current, streamResponse]);



  return (
    <div className="chatPage h-full w-full flex place-content-center place-items-center ">
      <div className='md:w-4/6 w-full h-screen   pb-1   box-border flex flex-col  px-2 '>
        <div className="w-full h-full flex flex-col place-items-center place-content-start gap-3 relative ">
          < div
            ref={messagesRef}
            className="flex-1 flex flex-col overflow-y-scroll w-full h-full p-6 px-0  gap-4"
            style={{ scrollbarWidth: "none" }}
          >

            {
              currentMessages.length === 0 && <div className="h-full w-full flex place-content-center place-items-center">
                <div className="w-[70%] h-auto">
                  <DotLottieReact
                    src="Ai Robot Animation.lottie"
                    loop
                    autoplay
                  />
                </div>
              </div>
            }
            {currentMessages?.map((item) => {
              return <MessageBox message={item} />
            })}
            {result && <MessageBox message={{ content: result, role: "zensky" }} />}
            {loading && <MessageBox message={{ content: "Thinking...", role: "zensky" }} />}
          </ div>

          < div className="border bottom-0 float-end  box-border w-full bg-white  flex gap-3 p-1 rounded-sm" >
            <textarea
              rows={1}
              className="flex-1  px-3 py-[4px] outline-none text-md whitespace-pre-wrap resize-none"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="Ask something..."
              style={{scrollbarWidth:'none'}}
            />

            <button
              className="px-3 bg-slate-500 rounded-md text-white "
              onClick={() => streamResponse(current)}
            >
              Enter
            </button>
          </div >
        </div>
      </div>

    </div>
  );
}

export default ChatBox


const MessageBox = ({ message }: { message: messagesInterface }) => {
  const { data: userInfo } = useGetUserInfoQuery()

  if (!message.role || !message.content)
    return null
  return (
    <div className={`flex w-fit max-w-full  ${(message.role === "zensky") || (message.role === "assistant") ? "place-content-end   flex-row-reverse  ml-auto" : "place-content-start  mr-auto "} place-items-end gap-1 h-fit `}>
      <div className="size-8 rounded-full bg-white flex place-content-center place-items-center">
        {message.role === "user" ? (userInfo?.info?.name ? userInfo.info.name.charAt(0) : "U") : "Z"}
      </div>
      <div className={`rounded-md  ${(message.role === "zensky") || (message.role === "assistant") ? "rounded-br-none" : "rounded-bl-none"} message max-w-[85%] p-2 text-sm  rounded-md h-fit bg-white`}>
        <Markdown
          components={{
            pre: ({ children }) => (
              <div className="max-w-full overflow-x-auto">
                <pre className="p-3 rounded-lg">{children}</pre>
              </div>
            ),
            code: ({ children }) => (
              <code className="break-words">{children}</code>
            ),
          }}
        >
          {message.content}
        </Markdown>
      </div>
    </div>
  )
}