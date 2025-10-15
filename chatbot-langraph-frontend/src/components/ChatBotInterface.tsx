import { Bot, Send } from "lucide-react";
import ChatBubble from "./ChatBubble";
import type { Message } from "../types/Message";
import { useEffect, useState, useRef } from "react";
import chatService from "../service/chatService";
import { Sender, Status } from "../enums/enum";

function ChatBotInterface() {
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMessages = async () => {
      const fetched = await chatService.fetchMessageHistory();
      setMessage(fetched);
    };
    loadMessages();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message, isTyping]);

  const handleSend = async () => {
    //const sessionId = localStorage.getItem("sessionId");
    const sessionId = "7ebba939-e14d-4ae8-928f-f05438e49e41";
    const trimmed = inputValue.trim();
    if (trimmed.length === 0) return;

    const userMessage: Message = {
      content: trimmed,
      sender: Sender.user,
      status: Status.SENDING,
    };

    setMessage((prev) => [...prev, userMessage]);
    setInputValue("");

    const typingMessage: Message = {
      content: "...",
      sender: Sender.assistant,
      status: Status.SENDING,
    };
    setMessage((prev) => [...prev, typingMessage]);

    try {
      const payload = {
        session_id: sessionId,
        message: trimmed,
        conversation_id: Number(localStorage.getItem("ConversationId")) || 11,
        scheme_type: "pension",
      };

      const response = await chatService.sendMessage(payload);

      const assistantMessage: Message = {
        content: response.response || "No reply from server.",
        sender: Sender.assistant,
        status: Status.FINISHED,
      };

      setMessage((prev) => {
        const updated = prev
          .map((m, i) =>
            i === prev.length - 2 
              ? { ...m, status: Status.FINISHED }
              : m
          )
          .slice(0, -1); 
        return [...updated, assistantMessage];
      });
    } catch (error) {
      console.error("Error sending message:", error);

      setMessage((prev) => {
        const updated = prev.map((m, i) =>
          i === prev.length - 2 ? { ...m, status: Status.FAILED } : m
        );
        return updated;
      });
    }
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
            <p className="text-xs text-blue-100">
              {isTyping ? "Typing..." : "Online"}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3 overflow-y-auto max-h-[500px] bg-gray-50">
        {message.map((msg, index) => (
          <ChatBubble
            key={index}
            content={msg.content}
            sender={msg.sender}
            status={msg.status}
          />
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-2xl animate-pulse w-fit">
              <span className="tracking-widest">...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
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
