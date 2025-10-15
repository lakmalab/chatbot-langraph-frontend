import type { Sender, Status } from "../enums/enum"

export interface Message {
  sender: Sender
  status: Status
  content:String
}

export interface SendMessage {
  session_id: string
  message: string
  conversation_id:Number
  scheme_type:String
}
