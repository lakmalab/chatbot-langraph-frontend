import { Bot, Send } from "lucide-react";
import ChatBubble from "./ChatBubble";
import type { Message } from "../types/Message";
import { useState } from "react";
import chatService from "../service/chatService";

interface ChatBotInterfaceProps {
  messages: Message[];
  onSendMessage?: (message: string) => void;
}

function ChatBotInterface({ messages, onSendMessage }: ChatBotInterfaceProps) {
  const [inputValue, setInputValue] = useState("");

  
  const handleSend = () => {
    //const sessionId = localStorage.getItem("sessionId");
    const sessionId = "b31e7a4b-d6eb-4264-b1c0-d5545f53d035"
    const trimmed = inputValue.trim();
    let message = {
      session_id: sessionId || "",
      message: trimmed,
      conversation_id: Number(localStorage.getItem("ConversationId")) || 11,
      scheme_type: "pension",
    }
    console.log("Sending message:", message);
    chatService.sendMessage(message);
    
    if (trimmed.length === 0) return;

    if (onSendMessage) {
      onSendMessage(trimmed);
    }

    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex flex-col border rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <Bot />
          </div>
          <div>
            <h3 className="font-semibold">AAIB Chat Assistant</h3>
            <p className="text-xs text-blue-100">Online</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3 overflow-y-auto max-h-[500px] bg-gray-50">
        {messages.map((msg, index) => (
          <ChatBubble
            key={index}
            content={msg.content}
            sender={msg.sender}
            status={msg.status}
          />
        ))}
      </div>

      <div className="p-3 border-t bg-gray-100 flex items-center gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl flex items-center justify-center transition-colors"
          aria-label="send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default ChatBotInterface;
