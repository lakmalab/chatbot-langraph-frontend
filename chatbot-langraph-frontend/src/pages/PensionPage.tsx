import { MessageCircle, X } from "lucide-react";
import { useState, useEffect } from "react";
import ChatBotInterface from "../components/ChatBotInterface";
import type { Message } from "../types/Message";
import { Sender, Status } from "../enums/enum";
import chatService, { ChatService } from "../service/chatService";

function PensionPage() {
  const [IsOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<Message[]>([]);

 useEffect(() => {
  const loadMessages = async () => {
    const fetched = await chatService.fetchMessageHistory();
    setMessage(fetched);
  };
  loadMessages();
}, []);


  return (
    <>
      <h1 className="text-center text-3xl font-bold ">Hi Lakmal</h1>
      <button
        onClick={() => setIsOpen(!IsOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white 
        rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-50"
        aria-label={IsOpen ? "Close chat" : "Open chat"}
      >
        {IsOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>
      {IsOpen && (
        <div className="fixed bottom-25 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-30  border-1 ">
          <ChatBotInterface messages={message} />
        </div>
      )}
    </>
  );
}

export default PensionPage;
