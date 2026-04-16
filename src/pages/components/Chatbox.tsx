import { useCallback, useEffect, useRef, useState } from 'react'
import { useChatContext } from '../../context/chatContext';
import { useGetChatsQuery } from '../../services/chatApiSlice';
import Markdown from "react-markdown"
import { toast } from 'sonner';
import { useGetUserInfoQuery } from '../../services/userApiSlice';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import clsx from 'clsx';

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
      if (currentUsingDocs === undefined) {
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
        body: JSON.stringify({ query, creativity: "medium", "selected_chat_id": selectedChat, "document_ids": currentUsingDocs ? [currentUsingDocs] : [] }),
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
          setCurrentMessages((prev) => {
            return ([...prev, { content: response, time: Date.now().toString(), role: "assistant" }])
          })
          setResult("")
          if (currentMessages.length === 0)
          refetch()
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        console.log(chunk)
        if (!chunk)
          continue;
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
    const handleKeyDown = (e: KeyboardEvent) => {
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

  console.log(currentMessages)


  return (
    <div className="h-full w-full flex justify-center">

      {/* container */}
      <div className="w-full max-w-4xl h-full flex flex-col px-4 py-3">

        {/* messages */}
        <div
          ref={messagesRef}
          className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-4 pr-2"
          style={{ scrollbarWidth: "none" }}
        >
          {currentMessages.length === 0 && (
            <div className="flex-1 flex items-center justify-center opacity-80">
              <div className="w-[60%] max-w-md">
                <DotLottieReact src="Ai Robot Animation.lottie" loop autoplay />
              </div>
            </div>
          )}

          {currentMessages?.map((item, i) => (
            <MessageBox key={i} message={item} />
          ))}

          {result && <MessageBox message={{ content: result, role: "zensky" }} />}
          {loading && <MessageBox message={{ content: "Thinking...", role: "zensky" }} />}
        </div>

        {/* input */}
        <div className="mt-3 border border-border bg-background/80 backdrop-blur rounded-xl p-2 flex gap-2 items-end shadow-sm">

          <textarea
            rows={1}
            className="flex-1 px-3 py-2 outline-none text-sm resize-none bg-transparent max-h-32 overflow-y-auto"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            placeholder="Ask something..."
          />

          <button
            className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-all shadow-sm hover:shadow-md"
            onClick={() => streamResponse(current)}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatBox


const MessageBox = ({ message }: { message: messagesInterface }) => {
  const { data: userInfo } = useGetUserInfoQuery()
  const messageByUser = message.role === "user"
  if (!message.role || !message.content)
    return null
  return (
    <div
      className={`flex w-full ${message.role === "assistant" || message.role === "zensky"
        ? "justify-end"
        : "justify-start"
        }`}
    >
      <div className={clsx("flex items-end gap-2 max-w-[85%]",
        !messageByUser && "flex-row-reverse"
      )}>

        {/* avatar */}
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm shrink-0">
          {messageByUser
            ? userInfo?.info?.name?.charAt(0) || "U"
            : "Z"}
        </div>

        {/* message */}
        <div
          className={`px-3 py-2 rounded-xl text-sm shadow-sm break-words
        ${!messageByUser
              ? "bg-orange-500 text-white rounded-br-none"
              : "bg-muted text-foreground rounded-bl-none"
            }
      `}
        >
          <Markdown
            components={{
              pre: ({ children }) => (
                <div className="overflow-x-auto">
                  <pre className="p-3 rounded-lg bg-black/80 text-white text-xs">
                    {children}
                  </pre>
                </div>
              ),
              code: ({ children }) => (
                <code className="break-words bg-black/10 px-1 rounded">
                  {children}
                </code>
              ),
            }}
          >
            {message.content}
          </Markdown>
        </div>
      </div>
    </div>
  )
}