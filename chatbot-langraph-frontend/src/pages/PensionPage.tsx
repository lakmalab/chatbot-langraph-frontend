import { MessageCircle, X } from "lucide-react";
import { useState, useEffect } from "react";
import ChatBotInterface from "../components/ChatBotInterface";

function PensionPage() {
  const [IsOpen, setIsOpen] = useState(false);

  return (
    <>
    <div className="bg-gradient-to-b from-[#e9f5db] to-[#a3c9a8] h-screen w-screen">

        <h1 className="flex items-center justify-center h-screen text-8xl font-extrabold text-center text-white">
          Hi Welcome To AAIB
        </h1>

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
      </div>
      {IsOpen && (
       <div className="fixed bottom-1 top-3 right-25 w-96 max-h-[100vh] rounded-2xl shadow-2xl flex flex-col z-30 bg-gray-900/90 backdrop-blur-md overflow-hidden">
  <ChatBotInterface />
</div>

      )}
    </>
  );
}

export default PensionPage;
