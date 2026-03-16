import React, { useEffect, useRef, useState } from 'react'

interface currentMessagesInterface {
  message: string,
  writer: "user" | "zensky",
  time?: string,
}

function ChatBox() {
  const [currentChatId, setCurrentChatId] = useState<string>("")
  const [current, setCurrent] = useState(''); // text input
  const [query, setQuery] = useState('');     // triggers stream
  const [result, setResult] = useState('');   // streaming result
  const [loading, setLoading] = useState(false)
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const [currentMessages, setCurrentMessages] = useState<currentMessagesInterface[]>([])
  const streamResponse = async () => {
    setLoading(true)
    const res = await fetch("http://127.0.0.1:8000/chat/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, creativity: "medium" }),
    });
    setLoading(false)

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader!.read();
      if (done) {
        setCurrentMessages((prev) => ({ ...prev, message: result, time: Date.now(), writer: "zensky" }))
        break;
      }
      const chunk = decoder.decode(value, { stream: true });
      setResult(prev => prev + chunk);
    }
  };
  // auto scroll to bottom while streaming
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [result]);

  return (
    <div className='w-3/5 h-screen bg-(--background) p-4 pb-1   box-border flex flex-col '>
      <div className="w-full h-full flex flex-col place-items-center place-content-start gap-3 ">
        < div
          ref={messagesRef}
          className="flex-1 overflow-y-scroll w-full h-full p-6 bg-white"
          style={{ scrollbarWidth: "none" }}
        >
          {loading && <div className="text-gray-500 mb-2">Thinking...</div>
          }
          {currentMessages.map((item) => {
            return <MessageBox message={item} />
          })}
          {result && <MessageBox message={{ message: result, writer: "zensky" }} />}
          <div className="whitespace-pre-wrap">{result}</div>
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
            className="bg-blue-500 text-white px-3 "
            onClick={streamResponse}
          >
            Send
          </button>
        </div >
      </div>
    </div>
  );
}

export default ChatBox


const MessageBox = ({ message }: { message: currentMessagesInterface }) => {
  return (
    <div className={`flex w-full ${message.writer === "zensky" ? "place-content-end" : "place-content-start"} place-items-center`}>
      <div className="message max-w-64 p-2 text-sm break-all  bg-[#93bac5]/50 rounded-md">
        {message.message}
      </div>
    </div>
  )
}