import type { Sender, Status } from "../enums/enum"

export interface Message {
  content: string;
  sender: Sender;
  status?: Status;
  requiresConfirmation?: boolean;
  confirmationData?: {
    age?: number;
    desired_pension?: number;
    query_type?: string;
    description?: string;
  };
}

export interface SendMessage {
  message: string;
  session_id: string;
  conversation_id?: number | null;  // Can be number or null
  scheme_type?: string;
}

export interface AbortConversation {
  session_id: string
  conversation_id:Number
}
