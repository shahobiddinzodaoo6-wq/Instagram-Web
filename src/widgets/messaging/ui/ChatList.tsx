"use client";

import React from "react";
import { SquarePen, ChevronDown, Play } from "lucide-react";
import { useChats, useChatMessages } from "@/src/entities/chat/api/chat.queries";
import { useMyProfile, useRecommendedUsers } from "@/src/entities/user/api/user.queries";
import { Chat } from "@/src/entities/chat/model/types";
import { urlImage } from "@/src/app/(auth)/accounts/login/token";

interface ChatListProps {
  onSelectChat: (chat: Chat) => void;
  onNewChat: () => void;
  selectedChatId?: number;
}

const ChatItem: React.FC<{ 
  chat: Chat; 
  isSelected: boolean; 
  onSelect: (chat: Chat) => void;
  currentUserId?: string;
  currentUserName?: string;
}> = ({ chat, isSelected, onSelect, currentUserId, currentUserName }) => {
  const { data: messagesResponse } = useChatMessages(chat.chatId);
  const messages = messagesResponse?.data || [];
  const lastMessage = messages[messages.length - 1];

  // Logic to find the other participant
  const isMeSender = (currentUserId && String(chat.sendUserId) === String(currentUserId)) || 
                     (currentUserName && chat.sendUserName === currentUserName);
  
  const otherUserName = isMeSender ? chat.receiveUserName : chat.sendUserName;
  const otherUserImage = isMeSender ? chat.receiveUserImage : chat.sendUserImage;

  return (
    <div
      onClick={() => onSelect(chat)}
      className={`flex items-center gap-3 px-5 py-2 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors ${
        isSelected ? "bg-zinc-50 dark:bg-zinc-900" : ""
      }`}
    >
      <div className="relative shrink-0">
        <div className="w-14 h-14 rounded-full overflow-hidden bg-zinc-200 border border-zinc-100 dark:border-zinc-800">
          <img 
            src={otherUserImage ? `${urlImage}/${otherUserImage}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
            className="w-full h-full object-cover" 
            alt={otherUserName}
          />
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
<<<<<<< HEAD

        <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100">{otherUserName || "User"}</p>

        <p className="font-medium text-sm text-zinc-900">{chat.receiveUserName}</p>
=======
        <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">{otherUserName || "User"}</p>
>>>>>>> 296d2ea4eee6019da83f41667417a55e8c6dce02
        {lastMessage && (
          <p className="text-zinc-500 text-xs truncate">
            {lastMessage.messageText} · {new Date(lastMessage.sendMassageDate).getHours()} ч.
          </p>
        )}
      </div>
    </div>
  );
};

export const ChatList: React.FC<ChatListProps> = ({ onSelectChat, onNewChat, selectedChatId }) => {
  const { data: chatsResponse, isLoading: isChatsLoading } = useChats();
  const { data: profileResponse, isLoading: isProfileLoading } = useMyProfile();
  const { data: recommendedUsersResponse } = useRecommendedUsers();
  
  const chats = [...(chatsResponse?.data || [])].sort((a, b) => {
    const dateA = a.lastMessageDate ? new Date(a.lastMessageDate).getTime() : 0;
    const dateB = b.lastMessageDate ? new Date(b.lastMessageDate).getTime() : 0;
    
    if (dateA !== dateB) {
      return dateB - dateA;
    }
    return b.chatId - a.chatId;
  });
  
  const profile = profileResponse?.data;
  const recommendedUsers = recommendedUsersResponse?.data || [];

  return (
    <div className="w-full md:w-[350px] h-full flex flex-col border-r border-zinc-200 bg-white shrink-0">
      {/* Header */}
      <div className="p-5 flex items-center justify-between pb-3">
        <div className="flex items-center gap-1 cursor-pointer group">
          <span className="font-bold text-xl">{profile?.userName || "..."}</span>
          <ChevronDown className="w-4 h-4 group-hover:text-zinc-500" />
        </div>
        <button onClick={onNewChat} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors">
          <SquarePen className="w-6 h-6" />
        </button>
      </div>    

      {/* Notes / Recommended Users */}
      <div className="px-5 mb-6">
<<<<<<< HEAD

=======
>>>>>>> 296d2ea4eee6019da83f41667417a55e8c6dce02
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex flex-col items-center gap-1 min-w-[72px] cursor-pointer group">
            <div className="relative">
              <div className="w-[72px] h-[72px] rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200 overflow-hidden">
                <img
                  src={profile?.image ? `${urlImage}/${profile.image}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  className="w-full h-full object-cover opacity-50 grayscale group-hover:opacity-100 transition-opacity"
                  alt=""
                />
              </div>
              <div className="absolute -top-3 -left-1 bg-white border border-zinc-200 px-3 py-1.5 rounded-2xl text-[11px] shadow-sm max-w-[90px] text-zinc-500 leading-tight">
                Ваша заметка
              </div>
              <div className="absolute bottom-0 right-0 bg-[#0095F6] rounded-full border-2 border-white w-6 h-6 flex items-center justify-center">
                <span className="text-white text-xs font-bold">+</span>
              </div>
            </div>
            <span className="text-[11px] text-zinc-500 mt-1">Заметка</span>
          </div>

          {/* Recommended Users List */}
          {recommendedUsers.slice(0, 8).map((user, i) => (
            <div key={user.id || i} className="flex flex-col items-center gap-1 min-w-[72px] cursor-pointer group">
              <div className="relative">
                <div className="w-[72px] h-[72px] rounded-full p-[2px] bg-gray-200 group-hover:bg-gradient-to-tr from-[#FFD600] via-[#FF7A00] to-[#FF0069]">
                  <div className="w-full h-full rounded-full bg-white p-[2px]">
                    <div className="w-full h-full rounded-full bg-zinc-200 overflow-hidden">
                      <img
                        src={user.image ? `${urlImage}/${user.image}` : (user.userImage ? `${urlImage}/${user.userImage}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png")}
                        className="w-full h-full object-cover"
                        alt={user.userName}
                      />
                    </div>
                  </div>
                </div>

              </div>
              <span className="text-[11px] truncate w-16 text-center text-zinc-500 mt-1">{user.userName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 py-2 flex items-center justify-between">
          <span className="font-bold text-base">Сообщения</span>
          <span className="text-zinc-500 text-sm font-semibold cursor-pointer hover:text-zinc-400">Запросы</span>
        </div>

        <div className="mt-1">
          {isChatsLoading || isProfileLoading ? (
            <div className="p-10 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0095F6] text-[#0095F6]"></div>
            </div>
          ) : chats.length > 0 ? (
            chats.map((chat) => (
              <ChatItem 
                key={chat.chatId} 
                chat={chat} 
                isSelected={selectedChatId === chat.chatId} 
                onSelect={onSelectChat}
                currentUserId={profile?.id}
                currentUserName={profile?.userName}
              />
            ))
          ) : (
            <div className="p-10 text-center text-zinc-500">
              Нет активных чатов
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
