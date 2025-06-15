export interface Message {
  id_chatmessage: number;
  id_usuario: string;
  nm_usuario: string;
  message: string;
  roomId: string;
  timestamp: Date;
}
