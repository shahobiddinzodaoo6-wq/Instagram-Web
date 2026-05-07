"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    Heart,
    MessageCircle,
    Send,
    Bookmark,
    MoreHorizontal,
    Play,
    X,
    Music2,
    Trash2
} from "lucide-react";
import { useReelsQuery } from "@/src/views/reels/api/reels.todo";
import { axiosRequest } from "@/src/app/(auth)/accounts/login/token";

const BASE_IMAGE_URL = "https://instagram-api.softclub.tj/images/";

const ReelItem = ({ reel, muted }: any) => {
    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [showComments, setShowComments] = useState(false);
    const [isLiked, setIsLiked] = useState(reel.postLike);
    const [isFollowing, setIsFollowing] = useState(reel.isSubscriber || false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [likeCount, setLikeCount] = useState(reel.postLikeCount || 0);
    const [commentCount, setCommentCount] = useState(reel.commentCount || 0);
    const [comments, setComments] = useState<any[]>(reel.comments || []);
    const [commentText, setCommentText] = useState("");

    const togglePlay = () => {
        if (videoRef.current) {
            isPlaying ? videoRef.current.pause() : videoRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const handleLike = async () => {
        const prevLiked = isLiked;
        const prevCount = likeCount;
        
        setIsLiked(!isLiked);
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

        try {
            await axiosRequest.post(`https://instagram-api.softclub.tj/Post/like-post?postId=${reel.postId}`);
        } catch (error) {
            setIsLiked(prevLiked);
            setLikeCount(prevCount);
        }
    };

    const handleFollow = async () => {
        const prev = isFollowing;
        setIsFollowing(!isFollowing);
        try {
            if (prev) {
                await axiosRequest.delete(`https://instagram-api.softclub.tj/FollowingRelationShip/delete-following-relation-ship?followingUserId=${reel.userId}`);
            } else {
                await axiosRequest.post(`https://instagram-api.softclub.tj/FollowingRelationShip/add-following-relation-ship?followingUserId=${reel.userId}`);
            }
        } catch (error) {
            setIsFollowing(prev);
        }
    };

    const handleBookmark = async () => {
        const prev = isBookmarked;
        setIsBookmarked(!isBookmarked);
        try {
            await axiosRequest.post("https://instagram-api.softclub.tj/Post/add-post-favorite", {
                postId: reel.postId
            });
        } catch (error) {
            setIsBookmarked(prev);
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        try {
            await axiosRequest.post("https://instagram-api.softclub.tj/Post/add-comment", {
                comment: commentText,
                postId: reel.postId
            });
            const newC = {
                postCommentId: Date.now(),
                userName: "You",
                comment: commentText,
                dateCommented: new Date().toISOString()
            };
            setComments([newC, ...comments]);
            setCommentCount(commentCount + 1);
            setCommentText("");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex h-screen w-full snap-start items-center justify-center overflow-hidden relative bg-white">
            <div className="absolute inset-0 z-0">
                <img 
                    src={`${BASE_IMAGE_URL}${reel.images}`} 
                    className="h-full w-full object-cover blur-[120px] opacity-[0.08] scale-150" 
                    alt="bg"
                />
            </div>

            <div className={`relative z-10 flex h-full items-end justify-center transition-all duration-500 ${showComments ? "lg:gap-8" : "gap-4"}`}>
                
                <div className="relative h-full aspect-[9/16] max-w-[450px] overflow-hidden rounded-lg lg:rounded-xl shadow-2xl  bg-zinc-900">
                    <video
                        ref={videoRef}
                        onClick={togglePlay}
                        src={`${BASE_IMAGE_URL}${reel.images}`}
                        className="h-full w-full cursor-pointer object-cover"
                        autoPlay loop muted={muted} playsInline
                    />

                    {!isPlaying && (
                        <div onClick={togglePlay} className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer ">
                            <Play className="h-14 w-14 text-white/90 fill-current" />
                        </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 z-10 p-5 bg-gradient-to-t from-black/80 to-transparent text-white">
                        <div className="flex items-center gap-3 mb-3">
                            <img 
                                src={reel.userImage ? `${BASE_IMAGE_URL}${reel.userImage}` : "https://i.pravatar.cc/150"} 
                                className="h-9 w-9 rounded-full border border-zinc-400 object-cover cursor-pointer" 
                                alt="user"
                                onClick={() => router.push(`/${reel.userName}`)}
                            />
                            <span className="text-sm font-semibold hover:underline cursor-pointer" onClick={() => router.push(`/${reel.userName}`)}>{reel.userName || "user"}</span>
                            <button 
                                onClick={handleFollow}
                                className={`text-[12px] font-bold border px-4 py-1 rounded-md transition-all ${isFollowing ? "bg-white text-black border-white" : "border-white/70 hover:bg-white/10"}`}
                            >
                                {isFollowing ? "Following" : "Follow"}
                            </button>
                        </div>
                        <p className="text-sm line-clamp-1 opacity-90 mb-2">{reel.description || "Beautiful moment ✨"}</p>
                        <div className="flex items-center gap-2 opacity-80">
                            <Music2 size={12} className="animate-spin-slow" />
                            <span className="text-[11px] tracking-wide italic">Original Audio • {reel.userName}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-5 self-end pb-8">
                    <ActionButton 
                        icon={<Heart className={isLiked ? "fill-red-500 text-red-500" : ""} />} 
                        label={likeCount} 
                        onClick={handleLike} 
                    />
                    <ActionButton 
                        icon={<MessageCircle />} 
                        label={commentCount} 
                        onClick={() => setShowComments(!showComments)} 
                    />
                    <ActionButton icon={<Send />} />
                    <ActionButton 
                        icon={<Bookmark className={isBookmarked ? "fill-black text-black" : ""} />} 
                        onClick={handleBookmark} 
                    />
                    <MoreHorizontal className="text-zinc-400 cursor-pointer hover:text-black transition-colors" />
                </div>

                {showComments && (
                    <div className="absolute inset-0 z-[100] lg:relative lg:flex h-full lg:h-[95%] w-full lg:w-[350px] flex-col bg-white lg:rounded-xl animate-in slide-in-from-right duration-300 overflow-hidden shadow-2xl">
                        <div className="flex items-center justify-between p-4 border-b">
                            <span className="font-bold text-gray-800">Comments</span>
                            <X className="cursor-pointer text-gray-500 hover:text-black" onClick={() => setShowComments(false)} />
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                            {comments.map((c: any) => (
                                <div key={c.postCommentId} className="flex gap-3 items-start group/item">
                                    <div className="h-7 w-7 rounded-full bg-zinc-200 flex-shrink-0" />
                                    <div className="flex flex-col flex-1">
                                        <span className="text-[12px] font-bold text-gray-900">{c.userName}</span>
                                        <p className="text-sm text-gray-700 leading-tight">{c.comment}</p>
                                    </div>
                                    <button 
                                        className="opacity-0 group-hover/item:opacity-100 p-1.5 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-600 transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t bg-gray-50">
                            <form onSubmit={handleAddComment} className="flex gap-2">
                                <input 
                                    className="flex-1 text-sm bg-transparent outline-none text-black" 
                                    placeholder="Add a comment..." 
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                />
                                <button type="submit" disabled={!commentText.trim()} className="text-blue-500 font-bold text-sm disabled:opacity-50">Post</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const ActionButton = ({ icon, label, onClick }: any) => (
    <div className="flex flex-col items-center gap-1 group">
        <button 
            onClick={onClick}
            className="text-zinc-800 transition-transform active:scale-90 group-hover:scale-110"
        >
            {React.cloneElement(icon, { size: 28, strokeWidth: 1.5 })}
        </button>
        {label !== undefined && <span className="text-[12px] font-semibold text-zinc-600">{label}</span>}
    </div>
);

export default function ReelsPage() {
    const { data, isLoading } = useReelsQuery(1, 10);

    if (isLoading) return (
        <div className="h-screen w-full flex items-center justify-center bg-zinc-950">
            <div className="w-10 h-10 border-[3px] border-zinc-800 border-t-white rounded-full animate-spin"></div>
        </div>
    );

    return (
        <main className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-white no-scrollbar">
            {data?.data?.map((reel: any) => (
                <ReelItem key={reel.postId} reel={reel} muted={false} />
            ))}
        </main>
    );
}





