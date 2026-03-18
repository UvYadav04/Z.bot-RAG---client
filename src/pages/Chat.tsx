import React from 'react'
import Sidebar from '../components/Sidebar'
import ChatBox from '../components/Chatbox'

function Chat() {
  return (
      <div className='w-full h-full flex place-content-start place-items-center bg-(--background) gap-2'>
        <Sidebar />
          <ChatBox/>
    </div>
  )
}

export default Chat
