import { Bot, Send, CirclePlus, ArrowDown } from "lucide-react";
import ChatBubble from "./ChatBubble";
import type { Message } from "../types/Message";
import { useEffect, useState, useRef } from "react";
import chatService from "../service/chatService";
import { Sender, Status } from "../enums/enum";
import sessionService from "../service/sessionService";

interface Conversation {
  id: number;
  title?: string;
  created_at?: string;
}

function ChatBotInterface() {
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionId = localStorage.getItem("sessionId");

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

  const handleAdd = async () => {
    await sessionService.addNewconversation();
    setMessage([]);
    setInputValue("");
    setIsTyping(false);

    const fetched = await chatService.fetchMessageHistory();
    setMessage(fetched);
  };

  const handleDropdown = async () => {
    try {
      const response = await sessionService.getAllConversations();
      if (response && response.length > 0) {
        setConversations(response);
        setShowDropdown(!showDropdown);
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  };

  const handleConversationSelect = async (conversationId: number) => {
    localStorage.setItem("ConversationId", conversationId.toString());
    setShowDropdown(false);

    setMessage([]);
    setInputValue("");
    setIsTyping(false);

    const fetched = await chatService.fetchMessageHistory();
    setMessage(fetched);
  };

  const handleSend = async () => {
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
        conversation_id: Number(localStorage.getItem("ConversationId")),
        scheme_type: "pension",
      };

      const response = await chatService.sendMessage(payload);

      const assistantMessage: Message = {
        content: response.response || "No reply from server.",
        sender: Sender.assistant,
        status: Status.FINISHED,
      };

      setMessage((prev) => {
        const updated = prev.slice(0, -1);
        return [...updated, assistantMessage];
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="relative flex flex-col border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-lg">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center ring-2 ring-white/30">
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

        <div className="relative">
          <button
            onClick={handleDropdown}
            className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-all"
            aria-label="show conversations"
          >
            <ArrowDown className="w-5 h-5" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white text-gray-800 rounded-xl shadow-lg border border-gray-200 z-50 max-h-60 overflow-y-auto">
              {conversations.length > 0 ? (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => handleConversationSelect(conv.id)}
                    className="block w-full text-left px-4 py-2 hover:bg-blue-100 rounded-lg"
                  >
                    {conv.title || `Conversation ${conv.id}`}
                  </button>
                ))
              ) : (
                <p className="p-3 text-gray-500 text-center">No conversations</p>
              )}
            </div>
          )}
        </div>

        <div>
          <button
            onClick={handleAdd}
            className="bg-white/20 p-3 rounded-full hover:bg-white/30 transition-all"
            aria-label="add conversations"
          >
            <CirclePlus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-5 space-y-4 overflow-y-auto max-h-[500px] bg-gradient-to-b from-gray-50 to-white">
        {message.map((msg, index) => (
          <ChatBubble
            key={index}
            content={msg.content}
            sender={msg.sender}
            status={msg.status}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 bg-white flex items-center gap-3">
        <input
          type="text"
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-xl hover:from-blue-700 hover:to-blue-800"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default ChatBotInterface;
