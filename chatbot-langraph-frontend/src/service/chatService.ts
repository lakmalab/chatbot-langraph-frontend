import type { Message, SendMessage } from "../types/Message";
import { apiRequest } from "./apiService";
import { Sender, Status } from "../enums/enum";



const initialMessages: Message[] = [
  {
    content: "Hi, how can I help you?",
    sender: Sender.assistant,
    status: Status.FINISHED,
  },
];

export class ChatService {
  fetchMessageHistory = async (): Promise<Message[]> => {
    try {
      const ConversationId = localStorage.getItem("ConversationId");
      const data = await apiRequest<any>(`/chat/history/${ConversationId}`, "GET");
      console.log("HELLO", data);

      const fetchedData = Array.isArray(data)
        ? data
        : Array.isArray(data.messages)
        ? data.messages
        : [];

      const fetchedMessages: Message[] = fetchedData.map((msg: any) => ({
        sender: msg.role === "assistant" ? Sender.assistant : Sender.user,
        content: msg.content,
      }));

      return [...initialMessages, ...fetchedMessages];

    } catch (error) {
      console.error("Failed to fetch messages:", error);
      return initialMessages; 
    }
  };

  
sendMessage = async (message: SendMessage): Promise<Message> => {
  try {
    const data = await apiRequest<Message>(`/chat/message`, "POST", message); 
    console.log("Message sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Failed to send message:", error);
    return "" as unknown as Message;
  }
};
}

export default new ChatService();
