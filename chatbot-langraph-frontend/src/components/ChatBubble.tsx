import { Sender, Status } from "../enums/enum";
import { BotMessageSquare,UserRoundPen } from "lucide-react";
import type { Message } from "../types/Message";



function ChatBubble(prop : Message) {
  const isBot = prop.sender === Sender.BOT;
  return (
    <>
      <div className={`chat ${isBot ? "chat-start" : "chat-end"}`}>
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            {isBot ? <BotMessageSquare/> : <UserRoundPen />}
            
          </div>
        </div>
        <div className="chat-header">
          {prop.sender}
          <time className="text-xs opacity-50">12:45</time>
        </div>
        <div className="chat-bubble">{prop.content}</div>
        <div className="chat-footer opacity-50">{prop.status}</div>
      </div>
    </>
  );
}

export default ChatBubble;
