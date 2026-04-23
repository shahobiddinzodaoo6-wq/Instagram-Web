"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { useRecommendedUsers, useSearchUsers } from "@/src/entities/user/api/user.queries";
import { useCreateChat } from "@/src/entities/chat/api/chat.queries";
import { urlImage } from "@/src/app/(auth)/accounts/login/token";

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChatCreated: (chatId: number) => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({ isOpen, onClose, onChatCreated }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { data: recommendedResponse, isLoading: isLoadingRec } = useRecommendedUsers();
  const { data: searchResponse, isLoading: isLoadingSearch } = useSearchUsers(searchQuery);
  const createChatMutation = useCreateChat();

  if (!isOpen) return null;

  const users = searchQuery ? searchResponse?.data : recommendedResponse?.data;
  const isLoading = searchQuery ? isLoadingSearch : isLoadingRec;

  const handleCreateChat = async () => {
    if (!selectedUserId) return;
    
    createChatMutation.mutate(selectedUserId, {
      onSuccess: () => {
        onClose();
        setSearchQuery("");
        setSelectedUserId(null);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center w-[100%] justify-center bg-black/60 transition-opacity">
      <div className="bg-white w-full max-w-[400px] rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-200 shrink-0">
          <div className="w-8" />
          <h2 className="font-bold text-base">Новое сообщение</h2>
          <button onClick={onClose} className="p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-2.5 flex items-center gap-3 border-b border-zinc-200 shrink-0">
          <span className="font-semibold text-base">Кому:</span>
          <input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-[15px]"
            autoFocus
          />
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto min-h-[300px]">
          <div className="py-2">
            {!searchQuery && (
              <h3 className="px-4 py-2 text-sm font-semibold text-zinc-900">Рекомендуемые</h3>
            )}
            
            <div className="space-y-1">
              {isLoading ? (
                <div className="flex justify-center py-10">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0095F6]"></div>
                </div>
              ) : (
                users?.map((user) => (
                  <div 
                    key={user.id} 
                    className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-zinc-50 transition-colors group"
                    onClick={() => setSelectedUserId(user.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full overflow-hidden bg-zinc-200 shrink-0 border border-zinc-100">
                        <img 
                          src={user.image ? `${urlImage}/${user.image}` : `https://i.pravatar.cc/150?u=${user.userName}`} 
                          alt={user.userName} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <p className="font-semibold text-sm text-zinc-900 truncate">{user.userName}</p>
                        <p className="text-zinc-500 text-sm truncate">{user.fullName || user.userName}</p>
                      </div>
                    </div>
                    
                    {/* Circular selection mark */}
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                      selectedUserId === user.id 
                        ? 'bg-[#0095F6] border-[#0095F6]' 
                        : 'border-zinc-300'
                    }`}>
                      {selectedUserId === user.id && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))
              )}

              {users?.length === 0 && !isLoading && (
                <p className="text-zinc-500 text-sm text-center py-10 px-4">Аккаунты не найдены.</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer with Chat Button */}
        <div className="p-4 shrink-0">
          <button 
            onClick={handleCreateChat}
            disabled={!selectedUserId || createChatMutation.isPending}
            className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors ${
              selectedUserId 
                ? 'bg-[#0095F6] hover:bg-[#1877F2] text-white' 
                : 'bg-[#0095F6]/40 text-white cursor-not-allowed'
            }`}
          >
            {createChatMutation.isPending ? 'Загрузка...' : 'Чат'}
          </button>
        </div>
      </div>
    </div>
  );
};
