import type { Session, conversation,SessionData } from "../types/Session";
import { apiRequest } from "./apiService";

//const sessionId = localStorage.getItem("sessionId");
const sessionId = "7ebba939-e14d-4ae8-928f-f05438e49e41"

export class SessionService {

  fetchSession = async (): Promise<Session> => {
    try {
      const data = await apiRequest<Session>("/session/create", "POST");
      const fetchedSession: Session = data
      return fetchedSession;
    } catch (error) {
      console.error("Failed to fetch Sessions:", error);
      return [] as unknown as Session;
    }
  };

 fetchConversation = async (): Promise<conversation | null> => {
  try {

    if (!sessionId) {
      console.warn("No sessionId found in localStorage.");
      return null;
    }

    const data = await apiRequest<SessionData>(`/chat/conversations/${sessionId}`, "GET");
    console.warn("data",data);
    if (data?.conversations?.length) {
      const conversation = data.conversations[0]; // take the first conversation
      localStorage.setItem("ConversationId", conversation.id.toString());
      console.log("Conversation ID:", conversation.id);
      return conversation;
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch conversation:", error);
    return null;
  }
};

}
export default new SessionService();