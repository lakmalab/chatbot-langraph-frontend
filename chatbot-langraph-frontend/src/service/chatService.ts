import type { Message } from "../types/Message";
import { apiRequest } from "./apiService";

export class ChatService {
  fetchMessageHistory = async (): Promise<Message[]> => {
    try {
      const messages = await apiRequest<Message[]>("/chat/history/11", "GET");
      return messages;
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      return [];
    }
  };
}
export default new ChatService();