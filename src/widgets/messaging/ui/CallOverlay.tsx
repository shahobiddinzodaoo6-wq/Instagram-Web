"use client";

import React, { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Settings, Maximize2, Share2 } from "lucide-react";
import { urlImage } from "@/src/app/(auth)/accounts/login/token";
import { Chat } from "@/src/entities/chat/model/types";
import { UserProfile } from "@/src/entities/user/api/user.service";

interface CallOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  type: "voice" | "video";
  receiverChat: Chat;
  currentUser: UserProfile | undefined;
}

export const CallOverlay: React.FC<CallOverlayProps> = ({ isOpen, onClose, type, receiverChat, currentUser }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(type === "video");
  const [callDuration, setCallDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    const startCamera = async () => {
      if (isOpen && isVideoOn) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
        }
      } else {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, isVideoOn]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-[#121212] flex flex-col text-white animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-800">
             <img 
               src={currentUser?.image ? `${urlImage}/${currentUser.image}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
               className="w-full h-full object-cover" 
               alt="" 
             />
           </div>
           <span className="text-sm font-semibold">{currentUser?.userName || "..."}</span>
        </div>
        <div className="flex items-center gap-4 text-zinc-400">
          <Settings className="w-6 h-6 cursor-pointer hover:text-white transition-colors" />
          <Maximize2 className="w-6 h-6 cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative flex items-center justify-center">
        {/* Remote User Info (Center) */}
        <div className="flex flex-col items-center z-10">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-white/10 shadow-2xl">
             <img 
               src={receiverChat.receiveUserImage ? `${urlImage}/${receiverChat.receiveUserImage}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
               className="w-full h-full object-cover" 
               alt="" 
             />
          </div>
          <h2 className="text-xl font-bold mb-1">{receiverChat.receiveUserName}</h2>
          <p className="text-zinc-400 text-sm">
            {callDuration === 0 ? "Звонок..." : formatTime(callDuration)}
          </p>
        </div>

        {/* Local Video Background */}
        {isVideoOn && (
          <div className="absolute inset-0 overflow-hidden">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover opacity-60 scale-x-[-1]"
            />
            {/* Gradient Overlay for better UI visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="p-10 flex justify-center items-center gap-6 animate-in slide-in-from-bottom-10 duration-500">
        <button 
          className="w-12 h-12 rounded-full bg-zinc-800/80 flex items-center justify-center hover:bg-zinc-700 transition-colors"
          title="Share Screen"
        >
          <Share2 className="w-6 h-6" />
        </button>
        
        <button 
          onClick={() => setIsVideoOn(!isVideoOn)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            isVideoOn ? 'bg-zinc-800/80 hover:bg-zinc-700' : 'bg-white text-black'
          }`}
        >
          {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
        </button>

        <button 
          onClick={() => setIsMuted(!isMuted)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            isMuted ? 'bg-white text-black' : 'bg-zinc-800/80 hover:bg-zinc-700'
          }`}
        >
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        <button 
          onClick={onClose}
          className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-all transform hover:scale-110"
        >
          <PhoneOff className="w-7 h-7 text-white fill-white" />
        </button>
      </div>
    </div>
  );
};
