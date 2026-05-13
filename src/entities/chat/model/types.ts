export interface Chat {
  sendUserId: string;
  sendUserName: string;
  sendUserImage: string;
  chatId: number;
  receiveUserId: string;
  receiveUserName: string;
  receiveUserImage: string;
  lastMessageText?: string;
  lastMessageDate?: string;
}


export interface Message {
  userId: string;
  userName: string;
  userImage: string;
  messageId: number;
  chatId: number;
  messageText: string;
  sendMassageDate: string;
  file: string | null;
}


export interface ChatResponse<T> {
  data: T;
  errors: any[];
  statusCode: number;
}




