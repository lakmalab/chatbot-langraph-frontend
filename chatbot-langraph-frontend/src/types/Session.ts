
export interface Session {
  session_id: String
  created_at: Date
  expires_at: Date
}

export interface conversation {
  id: String
  title: String
  created_at: Date
  updated_at: Date
}

export interface SessionData {
  session_id: string;
  conversations: conversation[];
}
