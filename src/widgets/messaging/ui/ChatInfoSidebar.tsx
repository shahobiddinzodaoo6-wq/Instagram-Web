"use client";

import React from "react";
import { X, BellOff, ChevronRight, UserMinus, ShieldAlert, Trash2 } from "lucide-react";
import { Chat } from "@/src/entities/chat/model/types";
import { urlImage } from "@/src/app/(auth)/accounts/login/token";
import { useDeleteChat } from "@/src/entities/chat/api/chat.queries";

interface ChatInfoSidebarProps {
  chat: Chat;
  onClose: () => void;
  onChatDeleted: () => void;
}

export const ChatInfoSidebar: React.FC<ChatInfoSidebarProps> = ({ chat, onClose, onChatDeleted }) => {
  const deleteChatMutation = useDeleteChat();
  const [muteNotifications, setMuteNotifications] = React.useState(false);

  const handleDeleteChat = () => {
    if (window.confirm("Вы уверены, что хотите удалить этот чат?")) {
      deleteChatMutation.mutate(chat.chatId, {
        onSuccess: () => {
          onChatDeleted();
          onClose();
        }
      });
    }
  };

  return (
    <div className="w-[280px] h-full bg-white border-l border-zinc-200 flex flex-col shrink-0 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="h-[60px] flex items-center px-4 border-b border-zinc-200 shrink-0">
        <h2 className="font-bold text-base">Информация</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Mute Toggle */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BellOff className="w-6 h-6 stroke-[1.5px]" />
            <span className="text-sm">Выключить уведомления о сообщениях</span>
          </div>
          <button 
            onClick={() => setMuteNotifications(!muteNotifications)}
            className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${muteNotifications ? 'bg-zinc-800' : 'bg-zinc-200'}`}
          >
            <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${muteNotifications ? 'translate-x-5' : ''}`} />
          </button>
        </div>

        <div className="h-[1px] bg-zinc-100 mx-4 my-2" />

        {/* Participants */}
        <div className="p-4 pt-2">
          <h3 className="font-bold text-sm mb-4">Участники</h3>
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-zinc-200 shrink-0 border border-zinc-100">
              <img 
                src={chat.receiveUserImage ? `${urlImage}/${chat.receiveUserImage}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                className="w-full h-full object-cover" 
                alt="" 
              />
            </div>
            <div className="flex flex-col overflow-hidden">
              <p className="font-bold text-sm leading-tight truncate">{chat.receiveUserName}</p>
              <p className="text-sm text-zinc-500 leading-tight truncate">habibullonzoda</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-200">
          <button className="w-full p-3 px-4 text-left text-sm hover:bg-zinc-50 transition-colors font-medium">
            Никнеймы
          </button>
          <button className="w-full p-3 px-4 text-left text-sm hover:bg-zinc-50 transition-colors font-medium">
            Заблокировать
          </button>
          <button className="w-full p-3 px-4 text-left text-sm text-[#ED4956] hover:bg-zinc-50 transition-colors font-medium">
            Пожаловаться
          </button>
          <button 
            onClick={handleDeleteChat}
            disabled={deleteChatMutation.isPending}
            className="w-full p-3 px-4 text-left text-sm text-[#ED4956] hover:bg-zinc-50 transition-colors font-medium"
          >
            {deleteChatMutation.isPending ? "Удаление..." : "Удалить чат"}
          </button>
        </div>
      </div>
    </div>
  );
};
