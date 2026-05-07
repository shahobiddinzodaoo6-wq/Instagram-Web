import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatService } from "./chat.service";

export const useChats = () => {
  return useQuery({
    queryKey: ["chats"],
    queryFn: () => chatService.getChats(),
  });
};

export const useChatMessages = (chatId: number | null) => {
  return useQuery({
    queryKey: ["messages", chatId],
    queryFn: () => (chatId ? chatService.getChatById(chatId) : null),
    enabled: !!chatId,
  });
};






export const useCreateChat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (receiverUserId: string) => chatService.createChat(receiverUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};




export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { ChatId: number; MessageText?: string; File?: File }) =>
      chatService.sendMessage(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["messages", variables.ChatId] });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (messageId: number) => chatService.deleteMessage(messageId),
    onSuccess: () => {
      // We don't know the chatId here easily without passing it, 
      // but usually we invalidate all messages or the specific chatId
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};








export const useDeleteChat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (chatId: number) => chatService.deleteChat(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};







