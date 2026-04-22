"use client";
import React, { useState, useRef, useEffect } from 'react';
import { axiosRequest } from "@/src/app/(auth)/accounts/login/token";
import { useQuery } from "@tanstack/react-query";
import { 
  Settings, 
  Grid, 
  Bookmark, 
  Tag, 
  Menu,
  Plus,
  QrCode,
  Bell,
  LogOut,
  Play,
  Heart,
  MessageCircle,
  X,
  Send,
  MoreVertical,
  Music,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const BASE_IMAGE_URL = "https://instagram-api.softclub.tj/images/";

const Profile = () => {
    const [activeTab, setActiveTab] = useState('posts');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedReel, setSelectedReel] = useState<any>(null);
    const [isMuted, setIsMuted] = useState(false);
    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement>(null);

    // 1. Fetch User Profile
    const { data: userData, isLoading: isProfileLoading } = useQuery({
        queryFn: async () => {
            const { data } = await axiosRequest.get(`/UserProfile/get-my-profile`);
            return data.data;
        },
        queryKey: ['user-profile'],
    });

    // 2. Fetch User Posts
    const { data: posts, isLoading: isPostsLoading } = useQuery({
        queryFn: async () => {
            const res = await axiosRequest.get(`/Post/get-posts`);
            return res.data.data || res.data;
        },
        queryKey: ['user-posts'],
        enabled: activeTab === 'posts'
    });

    // 3. Fetch User Reels
    const { data: reels, isLoading: isReelsLoading } = useQuery({
        queryFn: async () => {
            const res = await axiosRequest.get(`/Post/get-reels`);
            return res.data.data || res.data;
        },
        queryKey: ['user-reels'],
        enabled: activeTab === 'reels'
    });

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/accounts/login");
    };

    // Ensure video plays with sound when selected
    useEffect(() => {
        const playVideo = async () => {
            if (selectedReel && videoRef.current) {
                const video = videoRef.current;
                video.muted = isMuted;
                video.volume = 1;
                
                try {
                    await video.play();
                } catch (err) {
                    console.log("Autoplay with sound might be blocked, trying muted...", err);
                    video.muted = true;
                    await video.play();
                }
            }
        };
        playVideo();
    }, [selectedReel, isMuted]);

    if (isProfileLoading) return <div className="flex justify-center pt-20">Loading profile...</div>;

    return (
        <div className="max-w-[935px] mx-auto pt-8 px-4 relative">
            {/* Profile Header */}
            <header className="flex flex-col md:flex-row mb-12 md:mb-16">
                <div className="flex-shrink-0 flex justify-center md:justify-start md:mr-24 mb-6 md:mb-0">
                    <div className="relative w-20 h-20 md:w-[150px] md:h-[150px] rounded-full overflow-hidden border border-gray-200">
                        <img 
                            src={userData?.image ? `${BASE_IMAGE_URL}${userData.image}` : "https://i.pinimg.com/736x/9e/83/75/9e837528f01cf3f42119c5aeeed1b336.jpg"} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <section className="flex-grow text-gray-800">
                    <div className="flex flex-wrap items-center mb-5 relative">
                        <h2 className="text-xl font-semibold mr-4">{userData?.userName}</h2>
                        <div className="flex space-x-2 mt-2 sm:mt-0">
                            <button onClick={() => router.push('/editProfile')} className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 font-semibold rounded-lg text-sm transition-colors">
                                Edit profile
                            </button>
                            <button className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 font-semibold rounded-lg text-sm transition-colors">
                                View archive
                            </button>
                        </div>
                        <div className="relative">
                            <button 
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="ml-2 p-2 hover:bg-gray-50 rounded-full transition-colors"
                            >
                                <Menu className="w-6 h-6" />
                            </button>

                            {isMenuOpen && (
                                <div className="absolute right-0 mt-2 w-[250px] bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.1)] py-2 z-50">
                                    <button className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 text-left transition-colors">
                                        <QrCode className="w-5 h-5" />
                                        <span>QR code</span>
                                    </button>
                                    <button className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 text-left transition-colors">
                                        <Bell className="w-5 h-5" />
                                        <span>Notification</span>
                                    </button>
                                    <button className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 text-left transition-colors">
                                        <Settings className="w-5 h-5" />
                                        <span>Settings and privacy</span>
                                    </button>
                                    <div className="h-[1px] bg-gray-100 my-1"></div>
                                    <button onClick={handleLogout} className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 text-left text-red-500 font-medium">
                                        <LogOut className="w-5 h-5" />
                                        <span>Log out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex space-x-10 mb-5">
                        <div><span className="font-semibold">{userData?.postCount || 0}</span> posts</div>
                        <div><span className="font-semibold">{userData?.subscribersCount || 0}</span> followers</div>
                        <div><span className="font-semibold">{userData?.subscriptionsCount || 0}</span> following</div>
                    </div>

                    <div>
                        <h1 className="font-semibold text-base">{userData?.firstName} {userData?.lastName}</h1>
                    </div>
                </section>
            </header>

            {/* Highlights */}
            <div className="flex space-x-6 mb-12 overflow-x-auto pb-4 scrollbar-hide">
                <div className="flex flex-col items-center flex-shrink-0 space-y-2">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                        <Plus className="w-8 h-8 text-gray-400 stroke-1" />
                    </div>
                    <span className="text-xs text-gray-700 font-semibold">New</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-gray-200">
                <div className="flex justify-center space-x-12">
                    <button 
                        onClick={() => setActiveTab('posts')}
                        className={`flex items-center space-x-1.5 py-4 uppercase tracking-widest text-xs font-semibold border-t ${activeTab === 'posts' ? 'border-black text-black' : 'border-transparent text-gray-500'}`}
                    >
                        <Grid className="w-3 h-3" />
                        <span>Posts</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('reels')}
                        className={`flex items-center space-x-1.5 py-4 uppercase tracking-widest text-xs font-semibold border-t ${activeTab === 'reels' ? 'border-black text-black' : 'border-transparent text-gray-500'}`}
                    >
                        <Play className="w-3 h-3" />
                        <span>Reels</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('saved')}
                        className={`flex items-center space-x-1.5 py-4 uppercase tracking-widest text-xs font-semibold border-t ${activeTab === 'saved' ? 'border-black text-black' : 'border-transparent text-gray-500'}`}
                    >
                        <Bookmark className="w-3 h-3" />
                        <span>Saved</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="py-4">
                {activeTab === 'posts' && (
                    <div className="grid grid-cols-3 gap-1 md:gap-8">
                        {isPostsLoading ? (
                            <div className="col-span-3 text-center py-10">Loading posts...</div>
                        ) : posts?.length > 0 ? (
                            posts.map((post: any) => (
                                <div key={post.postId || post.id} className="aspect-square relative group cursor-pointer overflow-hidden bg-gray-100">
                                    <img 
                                        src={post.images ? `${BASE_IMAGE_URL}${post.images}` : "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=500&h=500&fit=crop"} 
                                        alt="" 
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold space-x-4">
                                        <span className="flex items-center"><Heart className="w-5 h-5 mr-2 fill-white" /> {post.postLikeCount || 0}</span>
                                        <span className="flex items-center"><MessageCircle className="w-5 h-5 mr-2 fill-white" /> {post.commentCount || 0}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-20 text-gray-500">No posts yet</div>
                        )}
                    </div>
                )}

                {activeTab === 'reels' && (
                    <div className="grid grid-cols-3 gap-1 md:gap-8">
                        {isReelsLoading ? (
                            <div className="col-span-3 text-center py-10">Loading reels...</div>
                        ) : reels?.length > 0 ? (
                            reels.map((reel: any) => (
                                <div 
                                    key={reel.postId || reel.id} 
                                    onClick={() => setSelectedReel(reel)}
                                    className="aspect-[9/16] relative group cursor-pointer overflow-hidden bg-gray-100"
                                >
                                    <video 
                                        src={`${BASE_IMAGE_URL}${reel.images}`} 
                                        className="w-full h-full object-cover"
                                        muted
                                        loop
                                    />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold">
                                        <span className="flex items-center"><Play className="w-6 h-6 mr-1" /> {reel.postLikeCount || 0}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-20 text-gray-500">No reels yet</div>
                        )}
                    </div>
                )}
            </div>

            {/* Reels Modal */}
            {selectedReel && (
                <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center animate-in fade-in duration-300">
                    <button 
                        onClick={() => setSelectedReel(null)}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 z-[110]"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div className="relative h-[95vh] aspect-[9/16] bg-black rounded-lg overflow-hidden flex shadow-2xl">
                        {/* Video Content */}
                        <div className="flex-1 relative bg-zinc-900 flex items-center justify-center">
                            <video 
                                ref={videoRef}
                                src={`${BASE_IMAGE_URL}${selectedReel.images}`} 
                                className="h-full w-full object-contain cursor-pointer"
                                loop
                                playsInline
                                controls
                                onClick={(e) => {
                                    if (e.currentTarget.paused) {
                                        e.currentTarget.play();
                                    } else {
                                        e.currentTarget.pause();
                                    }
                                }}
                            />

                            {/* Mute/Unmute Toggle */}
                            <button 
                                onClick={() => setIsMuted(!isMuted)}
                                className="absolute bottom-24 right-4 bg-black/40 p-2 rounded-full text-white hover:bg-black/60 transition-colors z-20"
                            >
                                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                            </button>

                            {/* Overlay Info */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                                        <img src={selectedReel.userImage ? `${BASE_IMAGE_URL}${selectedReel.userImage}` : "https://i.pinimg.com/736x/9e/83/75/9e837528f01cf3f42119c5aeeed1b336.jpg"} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="font-bold text-white text-base">{selectedReel.userName}</span>
                                    <button className="text-white border border-white/40 px-3 py-1 rounded-lg text-xs font-bold hover:bg-white/10 transition-colors">Follow</button>
                                </div>
                                <p className="text-white text-sm mb-4 line-clamp-2 leading-relaxed">{selectedReel.content || selectedReel.title}</p>
                                <div className="flex items-center space-x-2 text-white/80 text-xs">
                                    <Music className="w-3 h-3 animate-pulse" />
                                    <span>Original Audio • {selectedReel.userName}</span>
                                </div>
                            </div>

                            {/* Side Actions */}
                            <div className="absolute right-4 bottom-32 flex flex-col items-center space-y-6 text-white z-10">
                                <div className="flex flex-col items-center space-y-1">
                                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-90"><Heart className="w-8 h-8" /></button>
                                    <span className="text-xs font-bold">{selectedReel.postLikeCount || 0}</span>
                                </div>
                                <div className="flex flex-col items-center space-y-1">
                                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-90"><MessageCircle className="w-8 h-8" /></button>
                                    <span className="text-xs font-bold">{selectedReel.commentCount || 0}</span>
                                </div>
                                <button className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-90"><Send className="w-7 h-7" /></button>
                                <button className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-90"><MoreVertical className="w-6 h-6" /></button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
