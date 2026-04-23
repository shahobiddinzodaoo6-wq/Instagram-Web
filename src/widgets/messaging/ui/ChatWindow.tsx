"use client";

import React, { useState, useEffect, useRef } from "react";
import { Phone, Video, Info, Smile, Mic, Image as ImageIcon, Heart, X, MoreVertical, Reply, Play, Pause, Trash2, Pin, Send } from "lucide-react";
import { useChatMessages, useSendMessage, useDeleteMessage } from "@/src/entities/chat/api/chat.queries";
import { useMyProfile } from "@/src/entities/user/api/user.queries";
import { Chat, Message } from "@/src/entities/chat/model/types";
import { urlImage } from "@/src/app/(auth)/accounts/login/token";
import { useRouter } from "next/navigation";
import { CallOverlay } from "./CallOverlay";

interface MessageItemProps {
  msg: Message;
  isMe: boolean;
  isSameUser: boolean;
  onDelete: () => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ msg, isMe, isSameUser, onDelete }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isVoice = msg.file?.endsWith('.webm') || msg.file?.endsWith('.mp3');
  const isImage = msg.file && (msg.file.endsWith('.jpg') || msg.file.endsWith('.png') || msg.file.endsWith('.jpeg'));

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} mb-1 group`}>
      {!isMe && !isSameUser && (
        <span className="text-[10px] text-zinc-500 ml-9 mb-1">{msg.userName}</span>
      )}
      <div className={`flex items-end gap-2 max-w-[85%] ${isMe ? 'flex-row-reverse' : ''}`}>
        {!isMe && (
          <div className={`w-7 h-7 rounded-full overflow-hidden bg-zinc-200 shrink-0 ${isSameUser ? 'opacity-0' : ''}`}>
            <img src={msg.userImage ? `${urlImage}/${msg.userImage}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="w-full h-full object-cover" alt="" />
          </div>
        )}
        
        <div className="relative flex items-center gap-2">
          {/* Hover Actions */}
          <div className={`flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${isMe ? 'flex-row-reverse' : ''}`}>
            <div className="relative">
              <MoreVertical className="w-4 h-4 text-zinc-400 cursor-pointer hover:text-zinc-600" onClick={() => setShowOptions(!showOptions)} />
              {showOptions && (
                <div className={`absolute bottom-full ${isMe ? 'right-0' : 'left-0'} mb-2 bg-white shadow-xl rounded-xl py-1.5 z-[100] border border-zinc-200 w-36 animate-in fade-in zoom-in-95`}>
                   <div className="px-3 py-2 hover:bg-zinc-50 cursor-pointer flex items-center justify-between text-xs font-medium">
                     Переслать <Send className="w-3.5 h-3.5" />
                   </div>
                   <div className="px-3 py-2 hover:bg-zinc-50 cursor-pointer flex items-center justify-between text-xs font-medium border-t border-zinc-100">
                     Закрепить <Pin className="w-3.5 h-3.5" />
                   </div>
                   <div className="px-3 py-2 hover:bg-zinc-50 cursor-pointer flex items-center justify-between text-xs font-medium text-red-500 border-t border-zinc-100" onClick={onDelete}>
                     Удалить <Trash2 className="w-3.5 h-3.5" />
                   </div>
                </div>
              )}
            </div>
            <Reply className="w-4 h-4 text-zinc-400 cursor-pointer hover:text-zinc-600" />
            <Smile className="w-4 h-4 text-zinc-400 cursor-pointer hover:text-zinc-600" />
          </div>

          <div className={`overflow-hidden rounded-2xl text-sm ${
            isMe 
              ? 'bg-[#3797F0] text-white' 
              : 'bg-zinc-100 text-black border border-zinc-200'
          }`}>
            {isVoice ? (
              <div className="px-4 py-3 min-w-[220px] flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <button onClick={togglePlay} className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>
                  <div className="flex-1 flex items-center gap-[2px]">
                    {[...Array(20)].map((_, i) => (
                      <div key={i} className="flex-1 bg-white/40 rounded-full" style={{ height: `${Math.random() * 16 + 4}px` }} />
                    ))}
                  </div>
                  <div className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">0:26</div>
                </div>
                <audio ref={audioRef} src={`${urlImage}/${msg.file}`} onEnded={() => setIsPlaying(false)} className="hidden" />
                <button className="text-[10px] opacity-80 hover:opacity-100 text-left">Смотреть текстовую версию</button>
              </div>
            ) : isImage ? (
              <div className="max-w-[300px]">
                <img src={`${urlImage}/${msg.file}`} alt="Sent image" className="w-full h-auto object-cover" />
              </div>
            ) : (
              <div className="px-4 py-2 break-words">
                {msg.messageText}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ChatWindowProps {
  chat: Chat | null;
  onToggleInfo?: () => void;
  isInfoOpen?: boolean;
  onOpenNewChat?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ chat, onToggleInfo, isInfoOpen, onOpenNewChat }) => {
  const router = useRouter();
  const [messageText, setMessageText] = useState("");
  const { data: messagesResponse, isLoading } = useChatMessages(chat?.chatId || null);
  const { data: profileResponse } = useMyProfile();
  const sendMessageMutation = useSendMessage();
  const deleteMessageMutation = useDeleteMessage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Call States
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [callType, setCallType] = useState<"voice" | "video">("voice");
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messages = [...(messagesResponse?.data || [])].reverse();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!chat || (!messageText.trim())) return;
    sendMessageMutation.mutate({
      ChatId: chat.chatId,
      MessageText: messageText,
    }, {
      onSuccess: () => {
        setMessageText("");
        setShowEmojiPicker(false);
      }
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && chat) {
      sendMessageMutation.mutate({ ChatId: chat.chatId, File: file });
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => { if (event.data.size > 0) audioChunksRef.current.push(event.data); };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], "voice_message.webm", { type: 'audio/webm' });
        if (chat) sendMessageMutation.mutate({ ChatId: chat.chatId, File: audioFile });
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } catch (err) { console.error(err); }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      audioChunksRef.current = [];
    }
  };

  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  const addEmoji = (emoji: string) => setMessageText(prev => prev + emoji);
  const sendHeart = () => { if (chat) sendMessageMutation.mutate({ ChatId: chat.chatId, MessageText: "❤️" }); };

  const emojis = ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👹", "👺", "🤡", "💩", "👻", "💀", "☠️", "👽", "👾", "🤖", "🎃", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾"];

  if (!chat) {
    return (
      <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-white p-4 text-center">
        <div className="w-24 h-24 rounded-full border-2 border-black flex items-center justify-center mb-4"><SendIcon className="w-12 h-12" /></div>
        <h2 className="text-xl font-medium mb-1">Ваши сообщения</h2>
        <p className="text-zinc-500 text-sm mb-6">Отправляйте личные фото и сообщения другу или группе.</p>
        <button onClick={onOpenNewChat} className="bg-[#0095F6] hover:bg-[#1877F2] text-white font-semibold py-1.5 px-4 rounded-lg text-sm">Отправить сообщение</button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
      <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full overflow-hidden bg-zinc-200 border border-zinc-100">
            <img src={chat.receiveUserImage ? `${urlImage}/${chat.receiveUserImage}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="w-full h-full object-cover" alt="" />
          </div>
          <div className="flex flex-col">
            <p className="font-bold text-base leading-tight hover:text-zinc-500 cursor-pointer">{chat.receiveUserName}</p>
            <p className="text-xs text-zinc-500">habibullonzoda</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-zinc-700 shrink-0">
          <Phone 
            className="w-6 h-6 cursor-pointer hover:text-zinc-400" 
            onClick={() => { setCallType("voice"); setIsCallOpen(true); }}
          />
          <Video 
            className="w-7 h-7 cursor-pointer hover:text-zinc-400" 
            onClick={() => { setCallType("video"); setIsCallOpen(true); }}
          />
          <Info className={`w-6 h-6 cursor-pointer transition-colors ${isInfoOpen ? 'fill-black text-white' : 'text-zinc-700'}`} onClick={onToggleInfo} />
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-2">
        <div className="flex flex-col items-center mb-8">
           <div className="w-24 h-24 rounded-full overflow-hidden mb-3">
              <img src={chat.receiveUserImage ? `${urlImage}/${chat.receiveUserImage}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="w-full h-full object-cover" alt="" />
           </div>
           <p className="font-bold text-xl">{chat.receiveUserName}</p>
           <p className="text-zinc-500 text-sm">Instagram · {chat.receiveUserName}</p>
           <button 
             onClick={() => router.push(`/${chat.receiveUserName}`)}
             className="mt-4 bg-zinc-100 hover:bg-zinc-200 font-semibold px-4 py-1.5 rounded-lg text-sm transition-colors"
           >
             Смотреть профиль
           </button>
        </div>

        {messages.map((msg, idx) => {
          const isMe = msg.userName === "firuz";
          const prevMsg = messages[idx - 1];
          const isSameUser = prevMsg && prevMsg.userName === msg.userName;
          
          return (
            <MessageItem 
              key={msg.messageId || idx} 
              msg={msg} 
              isMe={isMe} 
              isSameUser={isSameUser}
              onDelete={() => deleteMessageMutation.mutate(msg.messageId)}
            />
          );
        })}
        {isLoading && <div className="text-center text-zinc-500 text-xs py-4">Загрузка...</div>}
      </div>

      {/* Input area */}
      <div className="p-4 pt-2 relative">
        {showEmojiPicker && (
          <div className="absolute bottom-full left-4 mb-2 p-2 bg-white border border-zinc-200 rounded-2xl shadow-xl z-50 w-[300px] max-h-[300px] overflow-y-auto animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-8 gap-1">
              {emojis.map((emoji, i) => (
                <button 
                  key={i} 
                  onClick={() => addEmoji(emoji)}
                  className="p-1 hover:bg-zinc-100 rounded text-xl transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 border border-zinc-200 rounded-full px-4 py-2 bg-white min-h-[44px]">
          {isRecording ? (
            <div className="flex-1 flex items-center gap-3 animate-in fade-in duration-300">
               <button onClick={cancelRecording} className="text-[#0095F6] hover:text-red-500">
                 <X className="w-6 h-6" />
               </button>
               <div className="flex-1 h-8 bg-[#3797F0] rounded-full flex items-center justify-between px-4 text-white overflow-hidden relative">
                  <div className="flex items-center gap-2 z-10">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-sm font-medium">{formatTime(recordingTime)}</span>
                  </div>
                  <button onClick={stopRecording} className="z-10 bg-white text-[#3797F0] rounded-full p-0.5">
                    <div className="w-3 h-3 bg-current rounded-sm" />
                  </button>
                  <div className="absolute inset-0 bg-white/20 animate-pulse" style={{ width: `${Math.min(recordingTime * 5, 100)}%` }} />
               </div>
               <button 
                 onClick={stopRecording}
                 className="text-[#0095F6] font-bold text-sm"
               >
                 Отправить
               </button>
            </div>
          ) : (
            <>
              <Smile 
                className={`w-6 h-6 shrink-0 cursor-pointer transition-colors ${showEmojiPicker ? 'text-[#0095F6]' : 'text-zinc-600 hover:text-zinc-400'}`} 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              />
              <input 
                type="text" 
                placeholder="Напишите сообщение..." 
                className="flex-1 bg-transparent outline-none text-[15px]"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onFocus={() => setShowEmojiPicker(false)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              {messageText.trim() ? (
                <button 
                  onClick={handleSendMessage}
                  className="text-[#0095F6] font-bold text-sm hover:text-blue-700"
                >
                  Отправить
                </button>
              ) : (
                <div className="flex items-center gap-4 text-zinc-600">
                  <Mic 
                    className="w-6 h-6 cursor-pointer hover:text-zinc-300 transition-colors" 
                    onClick={startRecording}
                  />
                  <label className="cursor-pointer hover:text-zinc-300 transition-colors">
                    <ImageIcon className="w-6 h-6" />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                    />
                  </label>
                  <Heart 
                    className="w-6 h-6 cursor-pointer hover:text-red-500 transition-colors" 
                    onClick={sendHeart}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <CallOverlay 
        isOpen={isCallOpen}
        onClose={() => setIsCallOpen(false)}
        type={callType}
        receiverChat={chat}
        currentUser={profileResponse?.data}
      />
    </div>
  );
};

const SendIcon = ({ className }: { className?: string }) => (
  <svg aria-label="Direct" color="currentColor" fill="currentColor" height="48" role="img" viewBox="0 0 96 96" width="48" className={className}><path d="M48 0C21.5 0 0 21.5 0 48s21.5 48 48 48 48-21.5 48-48S74.5 0 48 0zm0 88C25.9 88 8 70.1 8 48S25.9 8 48 8s40 17.9 40 40-17.9 40-40 40zm21-44.9c-.8-1.1-2-1.7-3.3-1.7H41.4l1.3-1.4c.9-.9.9-2.5 0-3.4-.9-.9-2.5-.9-3.4 0l-5.4 5.4c-.9.9-.9 2.5 0 3.4l5.4 5.4c.5.5 1.1.7 1.7.7s1.2-.2 1.7-.7c.9-.9.9-2.5 0-3.4l-1.3-1.4h20.3c.3 0 .5.1.7.4.2.3.2.6.1.9l-2.4 11c-.3 1.3.5 2.6 1.8 2.9.1 0 .2.1.4.1 1.2 0 2.2-.9 2.4-2.1l2.4-11c.3-1.4 0-2.8-.8-3.9z"></path></svg>
);
