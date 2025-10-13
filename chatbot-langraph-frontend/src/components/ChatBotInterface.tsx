
function ChatBotInterface() {
  return (
    <>
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          </div>
          <div>
            <h3 className="font-semibold">AAIB Chat Assistant</h3>
            <p className="text-xs text-blue-100">Online</p>
          </div>
        </div>
        <button
          className="hover:bg-blue-700 p-2 rounded-full transition-colors"
          aria-label= "close"
        >
        </button>
      </div>
    </>
  );
}

export default ChatBotInterface;
