import { axiosRequest } from "@/src/app/(auth)/accounts/login/token";
import { Chat, Message, ChatResponse } from "../model/types";

export const chatService = {
  getChats: async (): Promise<ChatResponse<Chat[]>> => {
    const { data } = await axiosRequest.get("/Chat/get-chats");
    return data;
  },

  getChatById: async (chatId: number): Promise<ChatResponse<Message[]>> => {
    const { data } = await axiosRequest.get(`/Chat/get-chat-by-id?chatId=${chatId}`);
    return data;
  },





  createChat: async (receiverUserId: string): Promise<ChatResponse<any>> => {
    const { data } = await axiosRequest.post(`/Chat/create-chat?receiverUserId=${receiverUserId}`);
    return data;
  },






  sendMessage: async (payload: { ChatId: number; MessageText?: string; File?: File }): Promise<ChatResponse<any>> => {
    const formData = new FormData();
    formData.append("ChatId", payload.ChatId.toString());
    if (payload.MessageText) formData.append("MessageText", payload.MessageText);
    if (payload.File) formData.append("File", payload.File);

    const { data } = await axiosRequest.put("/Chat/send-message", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },






  deleteMessage: async (messageId: number): Promise<ChatResponse<any>> => {
    const { data } = await axiosRequest.delete(`/Chat/delete-message?massageId=${messageId}`);
    return data;
  },







  deleteChat: async (chatId: number): Promise<ChatResponse<any>> => {
    const { data } = await axiosRequest.delete(`/Chat/delete-chat?chatId=${chatId}`);
    return data;
  },
};













