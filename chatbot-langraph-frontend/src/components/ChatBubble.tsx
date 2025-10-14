import { Sender, Status } from "../enums/enum";
import { BotMessageSquare, UserRoundPen, MoreVertical } from "lucide-react";
import type { Message } from "../types/Message";

function ChatBubble(prop: Message) {
  const isBot = prop.sender === Sender.assistant;

  return (
    <div
      className={`flex items-start gap-2.5 ${
        isBot ? "justify-start" : "justify-end"
      }`}
    >
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <BotMessageSquare className="text-gray-700 w-5 h-5" />
        </div>
      )}

      <div
        className={`flex flex-col w-full max-w-[320px] leading-1.5 p-4 rounded-e-xl rounded-es-xl shadow-sm ${
          isBot
            ? "bg-gray-100 border border-gray-200 dark:bg-gray-700 dark:border-gray-600"
            : "bg-blue-600 text-white dark:bg-blue-500"
        }`}
      >

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span
            className={`text-sm font-semibold ${
              isBot ? "text-gray-900 dark:text-white" : "text-white"
            }`}
          >
            {isBot ? "AI Assistant" : "You"}
          </span>
          <span
            className={`text-sm font-normal ${
              isBot ? "text-gray-500 dark:text-gray-400" : "text-gray-200"
            }`}
          >
            12:45
          </span>
        </div>

        <p
          className={`text-sm font-normal py-2.5 ${
            isBot ? "text-gray-900 dark:text-white" : "text-white"
          }`}
        >
          {prop.content}
        </p>

        <span
          className={`text-sm font-normal ${
            isBot ? "text-gray-500 dark:text-gray-400" : "text-gray-200"
          }`}
        >
          {prop.status === Status.SENDING
            ? "Sending..."
            : prop.status === Status.PENDINDG
            ? "Pending"
            : "Delivered"}
        </span>
      </div>

      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <UserRoundPen className="text-gray-700 w-5 h-5" />
        </div>
      )}

      <button
        type="button"
        className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600"
      >
        <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </button>
    </div>
  );
}

export default ChatBubble;
