import type { Message, SendMessage, AbortConversation } from "../types/Message";
import { apiRequest } from "./apiService";
import { Sender, Status } from "../enums/enum";
import { log } from "console";

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

      if (!ConversationId) {
        console.log("No conversation ID found, returning initial messages");
        return initialMessages;
      }

      const data = await apiRequest<any>(
        `/chat/history/${ConversationId}`,
        "GET"
      );
      console.log("Message history response:", data);

      const fetchedData = Array.isArray(data)
        ? data
        : Array.isArray(data.messages)
        ? data.messages
        : [];

      const fetchedMessages: Message[] = fetchedData.map((msg: any) => ({
        sender: msg.role === "assistant" ? Sender.assistant : Sender.user,
        content: msg.content,
        status: Status.FINISHED,
        requiresConfirmation: msg.metadata?.awaiting_confirmation || false,
        confirmationData: msg.metadata?.query_params,
      }));

      return [...initialMessages, ...fetchedMessages];
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      return initialMessages;
    }
  };

  sendMessage = async (message: SendMessage): Promise<Message> => {
    try {
      console.log("Sending message:", message);

      const payload = {
        message: message.message.trim(),
        session_id: message.session_id,
        conversation_id: message.conversation_id || null,
        scheme_type: "PENSION",
      };

      console.log("Payload being sent:", payload);

      const data = await apiRequest<any>(`/chat/message`, "POST", payload);
      console.log("Message response:", data);

      return {
        sender: Sender.assistant,
        content: data.response || data.content || "",
        status: Status.FINISHED,
        requiresConfirmation: data.metadata?.requires_approval || false,
        confirmationData: data.metadata?.query_params,
      };
    } catch (error: any) {
      console.error("Failed to send message:", error);
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      throw error;
    }
  };

  sendConfirmation = async (
    sessionId: string,
    conversationId: number,
    confirmed: boolean,
    email?: string,
    password?: string
  ): Promise<Message> => {
    const payload = {
      session_id: sessionId,
      conversation_id: conversationId,
      approved: confirmed,
      modified_email: email || null,
      modified_password: password || null,
    };

    const data = await apiRequest<any>(
      `/chat/approve-credential`,
      "POST",
      payload
    );

    console.log("Confirmation response:", data);
    return {
      sender: Sender.assistant,
      content: data.response || data.content || "",
      status: Status.FINISHED,
      requiresConfirmation: data.metadata?.awaiting_confirmation || false,
      confirmationData: data.metadata?.query_params,
    };
  };

  abortConversation = async (Abort: AbortConversation): Promise<String> => {
    try {
      const data = await apiRequest<String>(`/chat/abort`, "POST", Abort);
      console.log("abort request sent successfully:", data);
      return data;
    } catch (error) {
      console.error("Failed to send String request:", error);
      return "";
    }
  };
}

export default new ChatService();
