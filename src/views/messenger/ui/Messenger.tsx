"use client";

import React, { useState } from "react";
import { ChatList } from "@/src/widgets/messaging/ui/ChatList";
import { ChatWindow } from "@/src/widgets/messaging/ui/ChatWindow";
import { NewChatModal } from "@/src/widgets/messaging/ui/NewChatModal";
import { ChatInfoSidebar } from "@/src/widgets/messaging/ui/ChatInfoSidebar";
import { Chat } from "@/src/entities/chat/model/types";
import { useChats } from "@/src/entities/chat/api/chat.queries";
import { useEffect } from "react";

export const Messenger = () => {
  const { data: chatsResponse } = useChats();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [newChatId, setNewChatId] = useState<number | null>(null);

  useEffect(() => {
    if (newChatId && chatsResponse?.data) {
      const newChat = chatsResponse.data.find(c => c.chatId === newChatId);
      if (newChat) {
        setSelectedChat(newChat);
        setNewChatId(null);
      }
    }
  }, [newChatId, chatsResponse]);

  return (
    <div className="flex h-[calc(100vh-0px)] w-full max-h-[750px] overflow-hidden border-l border-zinc-200 dark:border-zinc-800">
      <ChatList 
        onSelectChat={(chat) => {
          setSelectedChat(chat);
          setShowInfo(false);
        }} 
        onNewChat={() => setIsModalOpen(true)}
        selectedChatId={selectedChat?.chatId}
      />
      <ChatWindow 
        chat={selectedChat} 
        onToggleInfo={() => setShowInfo(!showInfo)} 
        isInfoOpen={showInfo}
        onOpenNewChat={() => setIsModalOpen(true)}
      />
      
      {showInfo && selectedChat && (
        <ChatInfoSidebar 
          chat={selectedChat} 
          onClose={() => setShowInfo(false)} 
          onChatDeleted={() => {
            setSelectedChat(null);
            setShowInfo(false);
          }}
        />
      )}
      
      <NewChatModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onChatCreated={(chatId) => {
          setIsModalOpen(false);
          setNewChatId(chatId);
        }}
      />
    </div>
  );
};
