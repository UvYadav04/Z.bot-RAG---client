import Sidebar from './components/Sidebar'
import ChatBox from './components/Chatbox'

function Chat() {
  return (
    <div
      className="h-screen w-screen overflow-hidden flex bg-background text-foreground"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      <img
        src="/transparent-logo2.png"
        className="absolute top-4 right-4 z-10 opacity-80"
        width="70"
      />

      <div className="relative z-10 flex w-full h-full">

        <div className=" shrink-0 border-r border-border  backdrop-blur ">
          <Sidebar />
        </div>

        <div className="flex-1 min-h-0 flex flex-col">
          <ChatBox />
        </div>

      </div>
    </div>
  )
}

export default Chat