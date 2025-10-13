import type { Sender, Status } from "../enums/enum"

export interface Message {
  sender: Sender
  status: Status
  content:String
}