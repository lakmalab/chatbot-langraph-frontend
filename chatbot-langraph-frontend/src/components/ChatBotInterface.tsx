import { useState, useEffect, useRef } from "react";
import ChatBubble from "../components/ChatBubble";
import ChatService from "../service/chatService";
import sessionService from "../service/sessionService";
import type { Message } from "../types/Message";
import { Sender, Status } from "../enums/enum";
import { Send, Loader2, Sparkles, CirclePlus, ArrowDown } from "lucide-react";

interface Conversation {
  id: number;
  title?: string;
  created_at?: string;
}

function ChatBotInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sessionId = localStorage.getItem("SessionId") || "default_session";
  const conversationId = parseInt(localStorage.getItem("ConversationId") || "1");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    loadMessages();
  }, [conversationId]);

  useEffect(() => {
    if (!isLoading) inputRef.current?.focus();
  }, [isLoading]);

  const loadMessages = async () => {
    try {
      setIsTyping(true);
      const history = await ChatService.fetchMessageHistory();
      setMessages(history);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      content: textToSend,
      sender: Sender.user,
      status: Status.SENDING,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await ChatService.sendMessage({
        message: textToSend,
        session_id: sessionId,
        conversation_id: conversationId,
      });

      setMessages((prev) => [
        ...prev.map((msg) =>
          msg === userMessage ? { ...msg, status: Status.FINISHED } : msg
        ),
        response,
      ]);
    } catch (error: any) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        content: `❌ Sorry, I encountered an error: ${
          error?.response?.data?.detail || error.message || "Unknown error"
        }. Please try again.`,
        sender: Sender.assistant,
        status: Status.FINISHED,
      };
      setMessages((prev) => [
        ...prev.map((msg) =>
          msg === userMessage ? { ...msg, status: Status.FINISHED } : msg
        ),
        errorMessage,
      ]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleAddConversation = async () => {
    try {
      await sessionService.addNewconversation();
      setMessages([]);
      setInputValue("");
      setIsTyping(false);
      await loadMessages();
    } catch (err) {
      console.error("Error adding new conversation:", err);
    }
  };

  const handleDropdown = async () => {
    try {
      const response = await sessionService.getAllConversations();
      if (response?.length > 0) {
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
    setMessages([]);
    setInputValue("");
    setIsTyping(false);
    await loadMessages();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* 🌈 Modern Header with Conversation Controls */}
      <div className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 relative">
        <div className="max-w-4xl mx-auto px-6  py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Pension Assistant
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              AI-powered pension advisor
            </p>
          </div>

          <div className="ml-auto flex items-center gap-2 relative">
            {isTyping && (
              <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Thinking...</span>
              </div>
            )}

            {/* Dropdown Toggle */}
            <button
              onClick={handleDropdown}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Show conversations"
            >
              <ArrowDown className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>

            {/* New Conversation Button */}
            <button
              onClick={handleAddConversation}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Add conversation"
            >
              <CirclePlus className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>

            {/* Dropdown List */}
            {showDropdown && (
              <div className="absolute right-0 top-12 w-64 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-60 overflow-y-auto">
                {conversations.length > 0 ? (
                  conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => handleConversationSelect(conv.id)}
                      className="block w-full text-left px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      {conv.title || `Conversation ${conv.id}`}
                    </button>
                  ))
                ) : (
                  <p className="p-3 text-gray-500 text-center">
                    No conversations
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🧠 Messages Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Welcome to Pension Assistant
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                I'm here to help you understand and calculate your pension
                benefits. Ask me anything about premiums, payouts, or eligibility!
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <ChatBubble key={index} {...message} />
            ))
          )}

          {isTyping && messages.length > 0 && (
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Sparkles className="text-white w-4 h-4" />
              </div>
              <div className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-700 rounded-2xl rounded-tl-none shadow-md">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 💬 Input Area */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-2xl">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about premiums, pension amounts, eligibility..."
                disabled={isLoading}
                className="w-full px-5 py-3 pr-12 border-2 border-gray-200 dark:border-gray-600 rounded-2xl 
                           focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                           dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-200 text-sm placeholder-gray-400"
              />
              {inputValue && (
                <button
                  onClick={() => setInputValue("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputValue.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl 
                         hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed 
                         transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105
                         flex items-center gap-2 font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            Press Enter to send • AI responses may take a moment
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatBotInterface;
