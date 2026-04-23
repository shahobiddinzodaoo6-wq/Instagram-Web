"use client";
import React, { useState, useRef, useEffect } from 'react';
import { axiosRequest } from "@/src/app/(auth)/accounts/login/token";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
    const [selectedReel, setSelectedReel] = useState<any>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [savedPostIds, setSavedPostIds] = useState<Set<number>>(new Set());
    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement>(null);
    const queryClient = useQueryClient();

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
            const res = await axiosRequest.get(`Post/get-my-posts`);
            return res.data.data || res.data;
        },
        queryKey: ['user-posts'],
        enabled: activeTab === 'posts'
    });

    // 3. Fetch Saved/Favorite Posts
    const { data: savedPosts, isLoading: isSavedLoading } = useQuery({
        queryFn: async () => {
            const res = await axiosRequest.get(`/UserProfile/get-post-favorites?PageNumber=1&PageSize=50`);
            return res.data.data || res.data;
        },
        queryKey: ['saved-posts'],
        enabled: activeTab === 'saved'
    });

    // 4. Fetch Single Post Details
    const { data: postDetails, isLoading: isPostLoading } = useQuery({
        queryFn: async () => {
            const { data } = await axiosRequest.get(`/Post/get-post-by-id?id=${selectedPostId}`);
            return data.data;
        },
        queryKey: ['post-details', selectedPostId],
        enabled: !!selectedPostId
    });

    // 5. Save/Favorite Post Mutation
    const favoriteMutation = useMutation({
        mutationFn: async (postId: number) => {
            const res = await axiosRequest.post(`/Post/add-post-favorite`, { postId });
            return res.data;
        },
        onMutate: (postId: number) => {
            setSavedPostIds(prev => {
                const next = new Set(prev);
                if (next.has(postId)) next.delete(postId);
                else next.add(postId);
                return next;
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['saved-posts'] });
        }
    });


    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/accounts/login");
    };



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
                                <div 
                                    key={post.postId || post.id} 
                                    onClick={() => setSelectedPostId(post.postId || post.id)}
                                    className="aspect-square relative group cursor-pointer overflow-hidden bg-gray-100"
                                >
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

                {activeTab === 'saved' && (
                    <div className="grid grid-cols-3 gap-1 md:gap-8">
                        {isSavedLoading ? (
                            <div className="col-span-3 text-center py-10">Loading saved posts...</div>
                        ) : savedPosts?.length > 0 ? (
                            savedPosts.map((post: any) => (
                                <div
                                    key={post.postId || post.id}
                                    onClick={() => setSelectedPostId(post.postId || post.id)}
                                    className="aspect-square relative group cursor-pointer overflow-hidden bg-gray-100"
                                >
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
                            <div className="col-span-3 flex flex-col items-center justify-center py-20 text-gray-500">
                                <Bookmark className="w-16 h-16 mb-4 stroke-1" />
                                <p className="text-2xl font-bold text-gray-900 mb-2">Save</p>
                                <p className="text-sm">Save photos and videos that you want to see again.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Post Details Modal */}
            {selectedPostId && (
                <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
                    <button 
                        onClick={() => setSelectedPostId(null)}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 z-[110]"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div className="bg-white w-full max-w-[1200px] h-[90vh] flex flex-col md:flex-row rounded-sm overflow-hidden">
                        {/* Post Image Container */}
                        <div className="flex-[1.5] bg-black flex items-center justify-center relative group h-1/2 md:h-full">
                            <img 
                                src={postDetails?.images ? `${BASE_IMAGE_URL}${postDetails.images}` : "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=800&h=800&fit=crop"} 
                                alt="" 
                                className="max-h-full max-w-full object-contain"
                            />
                        </div>

                        {/* Post Info & Comments */}
                        <div className="flex-1 flex flex-col bg-white min-w-[335px]">
                            {/* User Header */}
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-100">
                                        <img src={userData?.image ? `${BASE_IMAGE_URL}${userData.image}` : "https://i.pinimg.com/736x/9e/83/75/9e837528f01cf3f42119c5aeeed1b336.jpg"} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="font-bold text-sm text-gray-900">{userData?.userName}</span>
                                </div>
                                <button className="p-1 hover:bg-gray-50 rounded-full transition-colors"><MoreVertical className="w-5 h-5" /></button>
                            </div>

                            {/* Comments Section */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {isPostLoading ? (
                                    <div className="flex justify-center py-10">Loading details...</div>
                                ) : (
                                    <>
                                        {/* Post Caption */}
                                        <div className="flex space-x-3">
                                            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                                <img src={userData?.image ? `${BASE_IMAGE_URL}${userData.image}` : "https://i.pinimg.com/736x/9e/83/75/9e837528f01cf3f42119c5aeeed1b336.jpg"} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-bold mr-2">{userData?.userName}</span>
                                                <span className="text-gray-800">{postDetails?.title || postDetails?.content || "No caption"}</span>
                                                <div className="text-xs text-gray-500 mt-2">Just now</div>
                                            </div>
                                        </div>

                                        {/* Real Comments from API */}
                                        {postDetails?.comments?.length > 0 ? (
                                            postDetails.comments.map((comment: any) => (
                                                <div key={comment.id} className="flex space-x-3">
                                                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                                        <img src={comment.userImage ? `${BASE_IMAGE_URL}${comment.userImage}` : "https://i.pinimg.com/736x/9e/83/75/9e837528f01cf3f42119c5aeeed1b336.jpg"} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="text-sm">
                                                        <span className="font-bold mr-2">{comment.userName}</span>
                                                        <span className="text-gray-800">{comment.comment}</span>
                                                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                                            <span>12h</span>
                                                            <button className="font-bold">Reply</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center text-center space-y-2 py-10">
                                                <div className="w-16 h-16 rounded-full border-2 border-gray-900 flex items-center justify-center">
                                                    <MessageCircle className="w-8 h-8" />
                                                </div>
                                                <p className="font-bold text-xl">No comments yet.</p>
                                                <p className="text-sm text-gray-500">Start the conversation.</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Actions Area */}
                            <div className="p-4 border-t border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-4">
                                        <button className="hover:text-gray-500 transition-colors"><Heart className="w-6 h-6" /></button>
                                        <button className="hover:text-gray-500 transition-colors"><MessageCircle className="w-6 h-6" /></button>
                                        <button className="hover:text-gray-500 transition-colors"><Send className="w-6 h-6" /></button>
                                    </div>
                                    <button 
                                        onClick={() => selectedPostId && favoriteMutation.mutate(selectedPostId)}
                                        className="hover:text-gray-500 transition-colors"
                                    >
                                        <Bookmark className={`w-6 h-6 transition-colors ${savedPostIds.has(selectedPostId!) ? 'fill-black' : ''}`} />
                                    </button>
                                </div>
                                <div className="font-bold text-sm mb-1">{postDetails?.postLikeCount || 0} likes</div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-wide">April 23</div>
                            </div>

                            {/* Comment Input */}
                            <div className="p-4 border-t border-gray-100 flex items-center space-x-3">
                                <button className="hover:opacity-70">
                                    <svg aria-label="Emoji" color="rgb(38, 38, 38)" fill="rgb(38, 38, 38)" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Emoji</title><path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.17 1.167 1.167 0 0 0-1.167-1.17Zm-7.66 0a1.167 1.167 0 1 0 1.167 1.17 1.167 1.167 0 0 0-1.167-1.17Zm3.83 8.334a4.496 4.496 0 0 1-3.33-1.496 1 1 0 1 1 1.48-1.345 2.494 2.494 0 0 0 3.7 0 1 1 0 1 1 1.48 1.345 4.496 4.496 0 0 1-3.33 1.496ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path></svg>
                                </button>
                                <input 
                                    type="text" 
                                    placeholder="Add a comment..." 
                                    className="flex-1 text-sm focus:outline-none placeholder-gray-500"
                                />
                                <button className="text-blue-500 font-bold text-sm hover:text-blue-700 disabled:opacity-50">Post</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
