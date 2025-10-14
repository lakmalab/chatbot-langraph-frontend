import type { Message } from "../types/Message";
import { apiRequest } from "./apiService";
import { Sender, Status } from "../enums/enum";




export class ChatService {

  fetchMessageHistory = async (): Promise<Message[]> => {
    try {
      const ConversationId = localStorage.getItem("ConversationId");
      const data = await apiRequest<any>(`/chat/history/${ConversationId}`, "GET");
       console.log("HELLO",data)
      const fetchedMessages: Message[] = Array.isArray(data)
        ? data
        : Array.isArray(data.messages)
        ? data.messages
        : [];

      const initialMessages: Message[] = [
        {
          content: "Hi, how can I help you?",
          sender: Sender.assistant,
          status: Status.FINISHED,
        },
        ...fetchedMessages,
      ];

      return initialMessages;
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      return [];
    }
  };
}

export default new ChatService();
