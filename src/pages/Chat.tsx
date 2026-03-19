import React from 'react'
import Sidebar from '../components/Sidebar'
import ChatBox from '../components/Chatbox'

function Chat() {
  return (
    <div className='w-full h-full flex place-content-between place-items-center bg-slate-500 gap-2' style={{
      background:`url(public/background.jpg)`
      }}>
        <Sidebar />
          <ChatBox/>
    </div>
  )
}

export default Chat
