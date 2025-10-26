import { Sender, Status } from "../enums/enum";
import { BotMessageSquare, UserRoundPen, CheckCircle, XCircle, Sparkles } from "lucide-react";
import type { Message } from "../types/Message";

function formatMessage(content: string) {
  // Convert markdown-like patterns to HTML
  return content
    .replace(/\n/g, "<br/>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/_(.*?)_/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code class='bg-gray-200 dark:bg-gray-600 px-1 rounded'>$1</code>");
}

interface ChatBubbleProps extends Message {
  onConfirm?: () => void;
  onCancel?: () => void;
}

function ChatBubble(prop: ChatBubbleProps) {
  const isBot = prop.sender === Sender.assistant;

  return (
    <div
      className={`flex items-start gap-3 ${
        isBot ? "justify-start" : "justify-end"
      } animate-fadeIn`}
    >
      {isBot && (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
          <Sparkles className="text-white w-5 h-5" />
        </div>
      )}

      <div
        className={`flex flex-col w-full max-w-[85%] sm:max-w-[75%] leading-relaxed ${
          isBot
            ? "items-start"
            : "items-end"
        }`}
      >
        <div className={`flex items-center gap-2 mb-1 px-1 ${isBot ? "" : "flex-row-reverse"}`}>
          <span
            className={`text-xs font-semibold ${
              isBot ? "text-gray-700 dark:text-gray-300" : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {isBot ? "AI Assistant" : "You"}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {prop.status === Status.SENDING ? "Sending..." : 
             prop.status === Status.PENDINDG ? "Pending" : 
             ""}
          </span>
        </div>

        <div
          className={`p-4 shadow-lg transition-all duration-200 hover:shadow-xl ${
            isBot
              ? "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-3xl rounded-tl-md"
              : "bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-3xl rounded-tr-md"
          }`}
        >
          <div
            className={`text-sm leading-relaxed ${
              isBot ? "text-gray-800 dark:text-gray-100" : "text-white"
            }`}
            dangerouslySetInnerHTML={{
              __html: formatMessage(prop.content.toString()),
            }}
          />

          {isBot && prop.confirmationData && (
            <div className="mt-3 p-3 bg-blue-50 dark:bg-gray-600 rounded-xl border border-blue-200 dark:border-gray-500">
              <div className="text-xs space-y-1">
                {prop.confirmationData.age && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-blue-700 dark:text-blue-300">👤 Age:</span>
                    <span className="text-gray-700 dark:text-gray-200">{prop.confirmationData.age} years</span>
                  </div>
                )}
                {prop.confirmationData.desired_pension && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-blue-700 dark:text-blue-300">💰 Pension:</span>
                    <span className="text-gray-700 dark:text-gray-200">{prop.confirmationData.desired_pension} LKR/month</span>
                  </div>
                )}
              </div>
            </div>
          )}


          {isBot && prop.requiresConfirmation && (
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={prop.onConfirm}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 
                         hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-all duration-200 
                         font-semibold text-sm shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
              >
                <CheckCircle className="w-4 h-4" />
                Yes, Proceed
              </button>
              <button
                onClick={prop.onCancel}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 
                         hover:from-red-600 hover:to-rose-700 text-white rounded-xl transition-all duration-200 
                         font-semibold text-sm shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
              >
                <XCircle className="w-4 h-4" />
                No, Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {!isBot && (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center shadow-lg flex-shrink-0">
          <UserRoundPen className="text-white w-5 h-5" />
        </div>
      )}
    </div>
  );
}

const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
`;
document.head.appendChild(style);

export default ChatBubble;