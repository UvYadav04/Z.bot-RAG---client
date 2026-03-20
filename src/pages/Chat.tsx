import React from 'react'
import Sidebar from './components/Sidebar'
import ChatBox from './components/Chatbox'

function Chat() {
  return (
    <div className='w-full h-full flex place-content-between place-items-start relative bg-slate-500 gap-2' style={{
      background:`url(public/background.jpg)`
    }}>
      <img src='public\transparent-logo2.png' className='absolute top-1 right-1'  width="80px" />
        <Sidebar />
          <ChatBox/>
    </div>
  )
}

export default Chat
