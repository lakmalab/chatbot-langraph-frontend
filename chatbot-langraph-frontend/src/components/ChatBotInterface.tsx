import { Bot, Send, CirclePlus } from "lucide-react";
import ChatBubble from "./ChatBubble";
import type { Message } from "../types/Message";
import { useEffect, useState, useRef } from "react";
import chatService from "../service/chatService";
import { Sender, Status } from "../enums/enum";
import sessionService from "../service/sessionService";

function ChatBotInterface() {
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionId = localStorage.getItem("sessionId");

  useEffect(() => {
    const loadMessages = async () => {
      const fetched = await chatService.fetchMessageHistory();
      console.log(fetched);
      setMessage(fetched);
    };
    loadMessages();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message, isTyping]);

  const handleadd = async () => {
    try {
      const response = await sessionService.addNewconversation();

      setMessage([]);
      setInputValue("");
      setIsTyping(false);

      const fetched = await chatService.fetchMessageHistory();
      setMessage(fetched);
    } catch (error) {
      console.error("Failed to add new conversation:", error);
    }
  };
  const handleSend = async () => {
    //const sessionId = "7ebba939-e14d-4ae8-928f-f05438e49e41";
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
      status: Status.PENDINDG,
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
            i === prev.length - 2 ? { ...m, status: Status.FINISHED } : m
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
    <div className="flex flex-col border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-lg">
      <div
        className="bg-gradient-to-r from-blue-600 to-blue-700
       text-white p-5 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex 
          items-center justify-center ring-2 ring-white/30"
          >
            <Bot className="w-6 h-6" />
          </div>

          <div>
            <h3 className="font-semibold text-lg">AAIB Chat Assistant</h3>

            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isTyping ? "bg-yellow-300 animate-pulse" : "bg-green-300"
                }`}
              />
              <p className="text-sm text-blue-50">
                {isTyping ? "Typing..." : "Online"}
              </p>
            </div>
          </div>
        </div>
        <div
          className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex 
          items-center justify-center ring-2 ring-white/30"
        >
          <button
            onClick={handleadd}
            className="bg-gradient-to-r from-blue-600 to-blue-900
           hover:from-blue-700 hover:to-blue-800 text-white p-3 rounded-full  flex items-center justify-center transition-all shadow-md hover:shadow-lg active:scale-95"
            aria-label="add conversations"
          >
            <CirclePlus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        className="p-5 space-y-4 overflow-y-auto max-h-[500px]
       bg-gradient-to-b from-gray-50 to-white"
      >
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
            <div
              className="bg-gray-200 text-gray-800 px-5 py-3 rounded-2xl
             rounded-tl-sm animate-pulse w-fit shadow-sm"
            >
              <span className="flex gap-1">
                <span
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 bg-white flex items-center gap-3">
        <input
          type="text"
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 p-3 rounded-xl border border-gray-300 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
        />
        <button
          onClick={handleSend}
          className="bg-gradient-to-r from-blue-600 to-blue-700
           hover:from-blue-700 hover:to-blue-800 text-white p-3 rounded-xl flex items-center justify-center transition-all shadow-md hover:shadow-lg active:scale-95"
          aria-label="send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default ChatBotInterface;
