"use client";
import React, { useState, useRef, useEffect } from 'react';
import { axiosRequest } from "@/src/app/(auth)/accounts/login/token";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";



import { Dropdown, MenuProps, Modal, message, QRCode } from 'antd';
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
  VolumeX,
  Trash2
} from 'lucide-react';
import { useRouter } from 'next/navigation';




const BASE_IMAGE_URL = "https://instagram-api.softclub.tj/images/";
const Profile = ({ username }: { username?: string }) => {
    const [activeTab, setActiveTab] = useState('posts');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
    const [selectedReel, setSelectedReel] = useState<any>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [savedPostIds, setSavedPostIds] = useState<Set<number>>(new Set());
    const [isProfilePhotoModalOpen, setIsProfilePhotoModalOpen] = useState(false);
    const [initialPostImage, setInitialPostImage] = useState<string | null>(null);
    const router = useRouter();
    const queryClient = useQueryClient();
    const [commentText, setCommentText] = useState("");
    const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
    const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    // Stores the reliable user ID (GUID string) of the profile being viewed
    const [targetUserId, setTargetUserId] = useState<string | null>(null);
    // Local optimistic follow state — updated instantly on click
    const [isFollowingLocal, setIsFollowingLocal] = useState<boolean | null>(null);
    // Per-user follow state inside the followers/following modal
    const [followedInModal, setFollowedInModal] = useState<Record<string, boolean>>({});
    const videoRef = useRef<HTMLVideoElement>(null);

    // 0. Delete Post Mutation
    const deletePost = useMutation({
        mutationFn: async (id: number) => {
            const { data } = await axiosRequest.delete(`/Post/delete-post?id=${id}`);
            return data;
        },
        onSuccess: () => {
            message.success("Post deleted successfully");
            setSelectedPostId(null);
            queryClient.invalidateQueries({ queryKey: ['user-posts'] });
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        },
        onError: () => {
            message.error("Failed to delete post");
        }
    });



    const handleDeleteClick = () => {
        if (!selectedPostId) return;



        Modal.confirm({
            title: 'Delete post?',
            content: 'Are you sure you want to delete this post? This action cannot be undone.',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                deletePost.mutate(selectedPostId);
            },
        });
    };



    const postMenuItems: MenuProps['items'] = [
        {
            key: 'delete',
            label: (
                <div className="flex items-center gap-2 text-red-500 font-semibold py-1">
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                </div>
            ),
            onClick: handleDeleteClick
        },
        {
            key: 'cancel',
            label: <div className="py-1">Cancel</div>,
        }
    ];



    // 1. Fetch User Profile (Either "my" or "target user")
    const { data: myProfile } = useQuery({
        queryFn: async () => {
            const { data } = await axiosRequest.get(`/UserProfile/get-my-profile`);
            return data.data;
        },
        queryKey: ['my-profile'],
    });



    const { data: userData, isLoading: isProfileLoading } = useQuery({
        queryFn: async () => {
            if (username) {
                // Step 1: Search user by username to get their ID
                const { data: searchRes } = await axiosRequest.get(`/User/get-users`, {
                    params: { UserName: username.trim() }
                });
                const foundUser = searchRes.data?.[0];
                if (!foundUser) throw new Error("User not found");
                
                // The ID must be a string GUID - try every possible field name
                const id = String(foundUser.id || foundUser.userId || foundUser.Id || foundUser.UserId || '');
                if (!id) throw new Error("Could not resolve user ID");
                
                // Store it reliably for follow mutations
                setTargetUserId(id);

                // Step 2: Try to get full profile (has isFollowing, counts etc.)
                try {
                    const { data: profileRes } = await axiosRequest.get(`/UserProfile/get-user-profile-by-id`, {
                        params: { id }
                    });
                    if (profileRes?.data) {
                        const fullProfile = { ...profileRes.data, _resolvedId: id };
                        // Sync local follow state from API
                        setIsFollowingLocal(fullProfile.isFollowing ?? false);
                        return fullProfile;
                    }
                } catch {
                    // Endpoint may not exist – fall back to search result
                }



                const fallback = { ...foundUser, _resolvedId: id };
                setIsFollowingLocal(fallback.isFollowing ?? false);
                return fallback;
            }
            // My own profile
            const { data } = await axiosRequest.get(`/UserProfile/get-my-profile`);
            return data.data;
        },
        queryKey: ['user-profile', username],
        enabled: !username || !!myProfile,
    });



    // Safe helper: returns first truthy value as string, or null
    const getVal = (...args: any[]): string | null => {
        for (const v of args) {
            if (v && v !== 'undefined' && v !== 'null') return String(v);
        }
        return null;
    };



    // If the `username` prop is passed, we are viewing SOMEONE ELSE's profile.
    // If no `username` prop, it's MY profile page (/profile).
    const isMyProfile = !username;

    // Reliable ID for follow/unfollow mutations (only for OTHER users)
    const effectiveUserId: string = getVal(
        targetUserId,
        userData?._resolvedId,
        userData?.id,
        userData?.userId,
        userData?.Id,
        userData?.UserId
    ) ?? '';


    // ID to use for get-subscribers / get-subscriptions
    // Own profile ("/profile"): use myProfile's ID
    // Other profile ("/[username]"): use the resolved target ID
    const resolvedId: string = isMyProfile
        ? (getVal(myProfile?.id, myProfile?.userId) ?? '')
        : (getVal(targetUserId, userData?._resolvedId, userData?.id, userData?.userId) ?? '');

    // The real-time follow state: local state (optimistic) takes priority over API data
    const isCurrentlyFollowing = isFollowingLocal !== null ? isFollowingLocal : (userData?.isFollowing ?? false);

    // 2. Fetch User Posts
    const { data: postsData, isLoading: isPostsLoading } = useQuery({
        queryFn: async () => {
            if (username && !isMyProfile && userData?.id) {
                const res = await axiosRequest.get(`/Post/get-posts`, {
                    params: { UserId: userData.id }
                });
                return res.data.data || res.data;
            }
            const res = await axiosRequest.get(`/Post/get-my-posts`);
            return res.data.data || res.data;
        },
        queryKey: ['user-posts', username, userData?.id, isMyProfile],
        enabled: !isProfileLoading && !!userData?.id
    });

    const posts = Array.isArray(postsData) ? postsData : (postsData?.data || []);

    // 2b. User Reels are derived from posts (filtering for video content)
    const userReels = posts?.filter((p: any) => {
        const mediaFile = Array.isArray(p.images) ? p.images[0] : p.images;
        return typeof mediaFile === 'string' && mediaFile.match(/\.(mp4|mov|avi|webm|mkv)$|video/i);
    }) || [];
    const isReelsLoading = isPostsLoading;

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

    // 6. Like Post Mutation
    const likeMutation = useMutation({
        mutationFn: async (postId: number) => {
            const res = await axiosRequest.post(`/Post/like-post?postId=${postId}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['post-details', selectedPostId] });
            queryClient.invalidateQueries({ queryKey: ['user-posts'] });
        },
        onError: () => {
            message.error("Failed to like post");
        }
    });

    // 7. Add Comment Mutation
    const commentMutation = useMutation({
        mutationFn: async (payload: { postId: number, comment: string }) => {
            const res = await axiosRequest.post(`/Post/add-comment`, payload);
            return res.data;
        },
        onSuccess: () => {
            setCommentText("");
            queryClient.invalidateQueries({ queryKey: ['post-details', selectedPostId] });
        },
        onError: () => {
            message.error("Failed to add comment");
        }
    });

    const handleAddComment = () => {
        if (!commentText.trim() || !selectedPostId) return;
        commentMutation.mutate({ postId: selectedPostId, comment: commentText });
    };

    // 8. Followers Query (get-subscribers = people who follow this user)
    const { data: followers, isLoading: isFollowersLoading } = useQuery({
        queryFn: async () => {
            const res = await axiosRequest.get(`/FollowingRelationShip/get-subscribers`, {
                params: { UserId: resolvedId }
            });
            const rawData = res.data.data || res.data;
            const arr = Array.isArray(rawData) ? rawData : [];
            // Seed per-user follow state from API data
            const seed: Record<string, boolean> = {};
            arr.forEach((u: any) => {
                const uid = String(u.id || u.userId || u.followingUserId || u.subscriberUserId || '');
                if (uid) seed[uid] = u.isFollowing ?? false;
            });
            setFollowedInModal(prev => ({ ...prev, ...seed }));
            return arr;
        },
        queryKey: ['user-followers', resolvedId],
        enabled: !!resolvedId && isFollowersModalOpen,
    });

    // 9. Following Query (get-subscriptions = people this user follows)
    const { data: following, isLoading: isFollowingLoading } = useQuery({
        queryFn: async () => {
            const res = await axiosRequest.get(`/FollowingRelationShip/get-subscriptions`, {
                params: { UserId: resolvedId }
            });
            const rawData = res.data.data || res.data;
            const arr = Array.isArray(rawData) ? rawData : [];
            // All users in "following" list are followed by definition
            const seed: Record<string, boolean> = {};
            arr.forEach((u: any) => {
                const uid = String(u.id || u.userId || u.followingUserId || u.subscriberUserId || '');
                if (uid) seed[uid] = true;
            });
            setFollowedInModal(prev => ({ ...prev, ...seed }));
            return arr;
        },
        queryKey: ['user-following', resolvedId],
        enabled: !!resolvedId && isFollowingModalOpen,
    });

    // 10. Follow/Unfollow Mutations
    const followUserMutation = useMutation({
        mutationFn: async (userId: string) => {
            if (!userId) throw new Error("User ID is missing");
            await axiosRequest.post(`/FollowingRelationShip/add-following-relation-ship?followingUserId=${userId}`);
        },
        onMutate: () => {
            // OPTIMISTIC: instantly show "Following" state
            setIsFollowingLocal(true);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-followers'] });
            queryClient.invalidateQueries({ queryKey: ['user-following'] });
            queryClient.invalidateQueries({ queryKey: ['user-profile', username] });
            queryClient.invalidateQueries({ queryKey: ['my-profile'] });
        },
        onError: (err: any) => {
            const errorMsg = err.response?.data?.errors?.[0] || err.message;
            if (errorMsg?.includes('following with user') || errorMsg?.includes('already')) {
                // Already following — keep "Following" state
                setIsFollowingLocal(true);
            } else {
                // Rollback on real error
                setIsFollowingLocal(false);
                message.error(`Follow failed: ${errorMsg}`);
            }
        }
    });

    const unfollowUserMutation = useMutation({
        mutationFn: async (userId: string) => {
            if (!userId) throw new Error("User ID is missing");
            await axiosRequest.delete(`/FollowingRelationShip/delete-following-relation-ship?followingUserId=${userId}`);
        },
        onMutate: () => {
            // OPTIMISTIC: instantly show "Follow" state
            setIsFollowingLocal(false);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-followers'] });
            queryClient.invalidateQueries({ queryKey: ['user-following'] });
            queryClient.invalidateQueries({ queryKey: ['user-profile', username] });
            queryClient.invalidateQueries({ queryKey: ['my-profile'] });
        },
        onError: (err: any) => {
            // Rollback
            setIsFollowingLocal(true);
            const msg = err.response?.data?.errors?.[0] || 'Unfollow failed';
            message.error(msg);
        }
    });

    // 11. Remove Follower Mutation
    const removeFollowerMutation = useMutation({
        mutationFn: async (userId: string) => {
            // Usually there is a specific endpoint for removing a follower
            // If not available, we might just use the unfollow logic or similar
            // For now, let's assume delete-following-relation-ship handles it if we are the 'following'
            await axiosRequest.delete(`/FollowingRelationShip/delete-following-relation-ship?followingUserId=${userId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-followers'] });
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
            message.success("Follower removed");
        },
        onError: () => message.error("Failed to remove follower")
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
                    <div
                        onClick={() => setIsProfilePhotoModalOpen(true)}
                        className="relative w-20 h-20 md:w-[150px] md:h-[150px] rounded-full overflow-hidden border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                    >
                        <img
                            src={userData?.image ? `${BASE_IMAGE_URL}${userData.image}` : "https://i.pinimg.com/736x/9e/83/75/9e837528f01cf3f42119c5aeeed1b336.jpg"}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <section className="flex-grow text-gray-800">
                    {/* Username row */}
                    <div className="flex items-center mb-5 flex-wrap gap-3">
                        <h2 className="text-xl font-semibold">{userData?.userName}</h2>

                        {isMyProfile ? (
                            // ── MY PROFILE BUTTONS ──
                            <>
                                <button
                                    onClick={() => router.push('/editProfile')}
                                    className="px-4 py-1.5 bg-[#efefef] hover:bg-[#dbdbdb] rounded-lg text-sm font-semibold transition-colors"
                                >
                                    Edit profile
                                </button>
                                <button className="px-4 py-1.5 bg-[#efefef] hover:bg-[#dbdbdb] rounded-lg text-sm font-semibold transition-colors">
                                    View archive
                                </button>
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <Menu className="w-6 h-6" />
                                </button>
                            </>
                        ) : (
                            // ── OTHER USER'S PROFILE BUTTONS ──
                            <>
                                {/* Follow / Following button with instant UI feedback */}
                                <div className="flex items-center gap-2">
                                    {isCurrentlyFollowing ? (
                                        // FOLLOWING STATE
                                        <button
                                            onClick={() => {
                                                if (!effectiveUserId) return;
                                                unfollowUserMutation.mutate(effectiveUserId);
                                            }}
                                            disabled={unfollowUserMutation.isPending || followUserMutation.isPending}
                                            className="group relative px-5 py-[7px] bg-[#efefef] hover:bg-[#dbdbdb] text-gray-900 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-70 flex items-center gap-1.5"
                                        >
                                            <span className="group-hover:hidden">Following ✓</span>
                                            <span className="hidden group-hover:inline text-red-500">Unfollow</span>
                                        </button>
                                    ) : (
                                        // NOT FOLLOWING STATE
                                        <button
                                            onClick={() => {
                                                if (!effectiveUserId) {
                                                    message.error('Could not find user ID, please refresh');
                                                    return;
                                                }
                                                followUserMutation.mutate(effectiveUserId);
                                            }}
                                            disabled={followUserMutation.isPending || unfollowUserMutation.isPending}
                                            className="px-6 py-[7px] bg-[#0095F6] hover:bg-[#1877F2] text-white rounded-lg text-sm font-bold transition-all duration-200 disabled:opacity-70"
                                        >
                                            {followUserMutation.isPending ? (
                                                <span className="flex items-center gap-1.5">
                                                    <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                                    </svg>
                                                    Following...
                                                </span>
                                            ) : 'Follow'}
                                        </button>
                                    )}

                                    <button
                                        onClick={() => router.push('/direct')}
                                        className="px-4 py-[7px] bg-[#efefef] hover:bg-[#dbdbdb] text-gray-900 rounded-lg text-sm font-semibold transition-colors"
                                    >
                                        Message
                                    </button>
                                </div>

                                {/* 3-dot options menu */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <MoreVertical className="w-6 h-6 text-gray-800" />
                                    </button>
                                    {isMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-[200px] bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.15)] py-2 z-50">
                                            <button className="w-full px-4 py-3 text-red-500 font-bold text-sm text-left hover:bg-gray-50 transition-colors">Block</button>
                                            <button className="w-full px-4 py-3 text-red-500 font-bold text-sm text-left hover:bg-gray-50 transition-colors">Report</button>
                                            <div className="h-px bg-gray-100 my-1" />
                                            <button onClick={() => setIsMenuOpen(false)} className="w-full px-4 py-3 text-sm text-left hover:bg-gray-50 transition-colors">Cancel</button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* My-profile dropdown menu */}
                    {isMyProfile && isMenuOpen && (
                        <div className="absolute top-16 right-4 w-[250px] bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.1)] py-2 z-50">
                            <button
                                onClick={() => { setIsQrModalOpen(true); setIsMenuOpen(false); }}
                                className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 text-left transition-colors"
                            >
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
                            <div className="h-[1px] bg-gray-100 my-1" />
                            <button onClick={handleLogout} className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 text-left text-red-500 font-medium">
                                <LogOut className="w-5 h-5" />
                                <span>Log out</span>
                            </button>
                        </div>
                    )}

                    <div className="flex space-x-10 mb-5">
                        <div className="cursor-default text-[16px]"><span className="font-semibold">{userData?.postCount || 0}</span> posts</div>
                        <div
                            onClick={() => setIsFollowersModalOpen(true)}
                            className="cursor-pointer hover:opacity-70 transition-opacity text-[16px]"
                        >
                            <span className="font-semibold">{userData?.subscribersCount || 0}</span> followers
                        </div>
                        <div
                            onClick={() => setIsFollowingModalOpen(true)}
                            className="cursor-pointer hover:opacity-70 transition-opacity text-[16px]"
                        >
                            <span className="font-semibold">{userData?.subscriptionsCount || 0}</span> following
                        </div>
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
                    {isMyProfile && (
                    <button
                        onClick={() => setActiveTab('saved')}
                        className={`flex items-center space-x-2 py-4 border-t transition-colors ${activeTab === 'saved' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
                    >
                        <Bookmark className="w-3 h-3" />
                        <span className="text-xs font-bold tracking-widest uppercase">Saved</span>
                    </button>
                )}
                </div>
            </div>

            {/* Content Area */}
            <div className="py-4">
                {activeTab === 'reels' && (
                    <div className="grid grid-cols-3 gap-1 md:gap-8">
                        {isReelsLoading ? (
                            <div className="col-span-3 text-center py-10">Loading reels...</div>
                        ) : userReels.length > 0 ? (
                            userReels.map((reel: any) => (
                                <div 
                                    key={reel.postId || reel.id || Math.random()} 
                                    onClick={() => setSelectedReel(reel)}
                                    className="aspect-[9/16] relative group cursor-pointer overflow-hidden bg-black flex items-center justify-center rounded-sm"
                                >
                                    <video 
                                        src={`${BASE_IMAGE_URL}${Array.isArray(reel.images) ? reel.images[0] : reel.images}`} 
                                        className="w-full h-full object-cover"
                                        muted
                                        loop
                                        onMouseOver={(e) => e.currentTarget.play()}
                                        onMouseOut={(e) => {
                                            e.currentTarget.pause();
                                            e.currentTarget.currentTime = 0;
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold z-10">
                                        <span className="flex items-center"><Play className="w-6 h-6 mr-1 fill-white" /> {reel.postLikeCount || 0}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-20 text-gray-500 font-medium">No reels yet</div>
                        )}
                    </div>
                )}
                {activeTab === 'posts' && (
                    <div className="grid grid-cols-3 gap-1 md:gap-8">
                        {isPostsLoading ? (
                            <div className="col-span-3 text-center py-10">Loading posts...</div>
                        ) : posts?.length > 0 ? (
                            posts.map((post: any) => (
                                <div 
                                    key={post.postId || post.id} 
                                    onClick={() => {
                                        setSelectedPostId(post.postId || post.id);
                                        const mediaFile = Array.isArray(post.images) ? post.images[0] : post.images;
                                        setInitialPostImage(mediaFile ? `${BASE_IMAGE_URL}${mediaFile}` : null);
                                    }}
                                    className="aspect-square relative group cursor-pointer overflow-hidden bg-black flex items-center justify-center"
                                >
                                    {(() => {
                                        const mediaFile = Array.isArray(post.images) ? post.images[0] : post.images;
                                        const isVideoFile = typeof mediaFile === 'string' && mediaFile.match(/\.(mp4|mov|avi|webm|mkv)$|video/i);
                                        const fullUrl = mediaFile ? `${BASE_IMAGE_URL}${mediaFile}` : "";

                                        return isVideoFile ? (
                                            <video 
                                                src={fullUrl} 
                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                muted
                                            />
                                        ) : (
                                            <img 
                                                src={mediaFile ? fullUrl : "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=500&h=500&fit=crop"} 
                                                alt="" 
                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                            />
                                        );
                                    })()}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold space-x-4 z-10">
                                        <span className="flex items-center"><Heart className="w-5 h-5 mr-2 fill-white" /> {post.postLikeCount || 0}</span>
                                        <span className="flex items-center"><MessageCircle className="w-5 h-5 mr-2 fill-white" /> {post.commentCount || 0}</span>
                                    </div>
                                    {/* Video Icon for Grid */}
                                    {typeof post.images === 'string' && post.images.match(/\.(mp4|mov|avi|webm|mkv)$|video/i) && (
                                        <div className="absolute top-2 right-2 z-20 text-white drop-shadow-md">
                                            <Play className="w-5 h-5 fill-white" />
                                        </div>
                                    )}
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
                                    onClick={() => {
                                        setSelectedPostId(post.postId || post.id);
                                        setInitialPostImage(post.images ? `${BASE_IMAGE_URL}${post.images}` : null);
                                    }}
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
                        <div className="flex-[1.5] bg-black flex items-center justify-center relative group h-1/2 md:h-full overflow-hidden">
                            {(() => {
                                const mediaPath = Array.isArray(postDetails?.images) ? postDetails?.images[0] : postDetails?.images;
                                const isVideo = typeof mediaPath === 'string' && mediaPath.match(/\.(mp4|mov|avi|webm|mkv)$|video/i);
                                const fullUrl = mediaPath ? `${BASE_IMAGE_URL}${mediaPath}` : (initialPostImage || "");

                                return isVideo ? (
                                    <video 
                                        src={fullUrl} 
                                        className="max-h-full max-w-full object-contain" 
                                        controls 
                                        autoPlay 
                                        muted 
                                        loop 
                                    />
                                ) : (
                                    <img 
                                        src={mediaPath ? fullUrl : initialPostImage || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=800&h=800&fit=crop"} 
                                        alt="" 
                                        className="max-h-full max-w-full object-contain" 
                                    />
                                );
                            })()}
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
                                <Dropdown menu={{ items: postMenuItems }} trigger={['click']} placement="bottomRight">
                                    <button className="p-1 hover:bg-gray-50 rounded-full transition-colors">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </Dropdown>
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
                                        <button
                                            onClick={() => selectedPostId && likeMutation.mutate(selectedPostId)}
                                            className={`hover:opacity-50 transition-opacity ${postDetails?.isLiked ? 'text-red-500' : 'text-gray-800'}`}
                                        >
                                            <Heart className={`w-6 h-6 ${postDetails?.isLiked ? 'fill-current' : ''}`} />
                                        </button>
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
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                                />
                                <button
                                    onClick={handleAddComment}
                                    disabled={!commentText.trim() || commentMutation.isPending}
                                    className="text-blue-500 font-bold text-sm hover:text-blue-700 disabled:opacity-50"
                                >
                                    {commentMutation.isPending ? '...' : 'Post'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Photo Preview Modal */}
            {isProfilePhotoModalOpen && (
                <div
                    className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300"
                    onClick={() => setIsProfilePhotoModalOpen(false)}
                >
                    <button
                        onClick={() => setIsProfilePhotoModalOpen(false)}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 z-[210]"
                    >
                        <X className="w-8 h-8" />
                    </button>
                    <div className="flex flex-col items-center relative" onClick={e => e.stopPropagation()}>
                        <div className="w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full overflow-hidden border-4 border-white/20 shadow-2xl mb-4">
                            <img
                                src={userData?.image ? `${BASE_IMAGE_URL}${userData.image}` : "https://i.pinimg.com/736x/9e/83/75/9e837528f01cf3f42119c5aeeed1b336.jpg"}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="text-white text-center font-semibold text-xl tracking-wide bg-black/20 px-6 py-2 rounded-full backdrop-blur-sm">
                            {userData?.userName}
                        </div>
                    </div>
                </div>
            )}
            {/* Followers / Following Modal */}
            {(isFollowersModalOpen || isFollowingModalOpen) && (
                <div
                    className="fixed inset-0 bg-black/60 z-[300] flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={() => { setIsFollowersModalOpen(false); setIsFollowingModalOpen(false); setSearchQuery(''); }}
                >
                    <div
                        className="bg-white w-full max-w-[400px] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
                        style={{ height: '80vh', maxHeight: '600px' }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header with tabs */}
                        <div className="border-b border-gray-200">
                            <div className="flex">
                                <button
                                    onClick={() => { setIsFollowersModalOpen(true); setIsFollowingModalOpen(false); setSearchQuery(''); }}
                                    className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${
                                        isFollowersModalOpen ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    {userData?.subscribersCount ?? 0} followers
                                </button>
                                <button
                                    onClick={() => { setIsFollowingModalOpen(true); setIsFollowersModalOpen(false); setSearchQuery(''); }}
                                    className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${
                                        isFollowingModalOpen ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    {userData?.subscriptionsCount ?? 0} following
                                </button>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="px-4 pt-3 pb-2">
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full bg-gray-100 rounded-lg py-2 pl-9 pr-8 text-sm focus:outline-none placeholder-gray-400"
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto">
                            {(isFollowersModalOpen ? isFollowersLoading : isFollowingLoading) ? (
                                <div className="flex items-center justify-center h-40">
                                    <div className="w-8 h-8 border-2 border-gray-200 border-t-[#0095F6] rounded-full animate-spin" />
                                </div>
                            ) : (() => {
                                const list = (isFollowersModalOpen ? followers : following) ?? [];
                                const filtered = list.filter((u: any) => {
                                    const name = (u.userName || u.username || u.followingUserName || u.subscriberUserName || '').toLowerCase();
                                    const full = (u.firstName || u.fullName || '').toLowerCase();
                                    const q = searchQuery.toLowerCase();
                                    return name.includes(q) || full.includes(q);
                                });

                                if (filtered.length === 0) {
                                    return (
                                        <div className="flex flex-col items-center justify-center h-40 text-center px-6">
                                            <p className="font-semibold text-gray-900 mb-1">{searchQuery ? 'No results' : (isFollowersModalOpen ? 'No followers yet' : 'Not following anyone yet')}</p>
                                            <p className="text-gray-400 text-sm">{searchQuery ? 'Try a different name' : (isFollowersModalOpen ? 'When someone follows you, you\'ll see them here.' : 'Accounts you follow will appear here.')}</p>
                                        </div>
                                    );
                                }

                                return filtered.map((user: any, idx: number) => {
                                    // Normalize field names — the API can return different shapes
                                    const uId   = String(user.id || user.userId || user.followingUserId || user.subscriberUserId || '');
                                    const uName = user.userName || user.username || user.followingUserName || user.subscriberUserName || 'User';
                                    const uFull = user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user.fullName || user.fullname || '');
                                    const uImage = user.image || user.userImage || user.followingUserImage || user.subscriberUserImage;
                                    const isSelf = uId === String(myProfile?.id || myProfile?.userId || '');

                                    // Per-user follow state: local map > API field > (for following tab: always true)
                                    const followed = uId in followedInModal
                                        ? followedInModal[uId]
                                        : (isFollowingModalOpen ? true : (user.isFollowing ?? false));

                                    const handleFollow = () => {
                                        if (!uId) return;
                                        setFollowedInModal(p => ({ ...p, [uId]: true }));
                                        axiosRequest.post(`/FollowingRelationShip/add-following-relation-ship?followingUserId=${uId}`)
                                            .then(() => queryClient.invalidateQueries({ queryKey: ['user-followers', resolvedId] }))
                                            .catch((err: any) => {
                                                const msg = err.response?.data?.errors?.[0] || '';
                                                if (!msg.includes('following with user')) {
                                                    setFollowedInModal(p => ({ ...p, [uId]: false }));
                                                    message.error('Failed to follow');
                                                }
                                            });
                                    };

                                    const handleUnfollow = () => {
                                        if (!uId) return;
                                        setFollowedInModal(p => ({ ...p, [uId]: false }));
                                        axiosRequest.delete(`/FollowingRelationShip/delete-following-relation-ship?followingUserId=${uId}`)
                                            .then(() => {
                                                queryClient.invalidateQueries({ queryKey: ['user-following', resolvedId] });
                                                queryClient.invalidateQueries({ queryKey: ['user-profile', username] });
                                            })
                                            .catch(() => {
                                                setFollowedInModal(p => ({ ...p, [uId]: true }));
                                                message.error('Failed to unfollow');
                                            });
                                    };

                                    const handleRemove = () => {
                                        if (!uId) return;
                                        axiosRequest.delete(`/FollowingRelationShip/delete-following-relation-ship?followingUserId=${uId}`)
                                            .then(() => queryClient.invalidateQueries({ queryKey: ['user-followers', resolvedId] }))
                                            .catch(() => message.error('Failed to remove'));
                                    };

                                    return (
                                        <div key={uId || idx} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
                                            {/* Avatar + name */}
                                            <div
                                                className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                                                onClick={() => {
                                                    router.push(`/${uName}`);
                                                    setIsFollowersModalOpen(false);
                                                    setIsFollowingModalOpen(false);
                                                    setSearchQuery('');
                                                }}
                                            >
                                                <div className="relative flex-shrink-0">
                                                    <div className="w-11 h-11 rounded-full overflow-hidden border border-gray-100">
                                                        <img
                                                            src={uImage ? `${BASE_IMAGE_URL}${uImage}` : 'https://i.pinimg.com/736x/9e/83/75/9e837528f01cf3f42119c5aeeed1b336.jpg'}
                                                            alt={uName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="font-semibold text-[14px] text-gray-900 truncate leading-tight">{uName}</span>
                                                    {uFull && <span className="text-gray-400 text-[13px] truncate leading-tight">{uFull}</span>}
                                                </div>
                                            </div>

                                            {/* Action button */}
                                            {!isSelf && (
                                                <div className="ml-3 flex-shrink-0 flex items-center gap-2">
                                                    {isFollowersModalOpen ? (
                                                        <>
                                                            {/* Follow back button */}
                                                            {followed ? (
                                                                <button
                                                                    onClick={handleUnfollow}
                                                                    className="px-3 py-1.5 text-[13px] font-semibold bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-colors"
                                                                >
                                                                    Following
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={handleFollow}
                                                                    className="px-3 py-1.5 text-[13px] font-semibold bg-[#0095F6] hover:bg-[#1877F2] text-white rounded-lg transition-colors"
                                                                >
                                                                    Follow
                                                                </button>
                                                            )}
                                                            {/* Remove from followers (only on my own profile) */}
                                                            {isMyProfile && (
                                                                <button
                                                                    onClick={handleRemove}
                                                                    className="px-3 py-1.5 text-[13px] font-semibold bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 rounded-lg transition-colors border border-gray-200"
                                                                >
                                                                    Remove
                                                                </button>
                                                            )}
                                                        </>
                                                    ) : (
                                                        /* Following tab: unfollow button */
                                                        followed ? (
                                                            <button
                                                                onClick={handleUnfollow}
                                                                className="px-3 py-1.5 text-[13px] font-semibold bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-colors"
                                                            >
                                                                Following
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={handleFollow}
                                                                className="px-3 py-1.5 text-[13px] font-semibold bg-[#0095F6] hover:bg-[#1877F2] text-white rounded-lg transition-colors"
                                                            >
                                                                Follow
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    </div>
                </div>
            )}
            {/* QR Code Modal */}
            <Modal
                title={null}
                open={isQrModalOpen}
                onCancel={() => setIsQrModalOpen(false)}
                footer={null}
                centered
                width={420}
                className="qr-modal"
                styles={{
                    content: {
                        padding: 0,
                        overflow: 'hidden',
                        borderRadius: '24px',
                    }
                }}
            >
                <div className="flex flex-col items-center">
                    <div className="w-full bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045] pt-12 pb-12 px-8 flex flex-col items-center">
                        <div className="bg-white p-6 rounded-[32px] shadow-2xl relative">
                            <QRCode
                                value={typeof window !== 'undefined' ? `${window.location.origin}/${userData?.userName}` : ''}
                                size={240}
                                bordered={false}
                                errorLevel="H"
                            />
                        </div>
                        <div className="mt-8 text-center text-white">
                            <h2 className="text-2xl font-bold tracking-tight">@{userData?.userName}</h2>
                            <p className="text-white/80 text-sm mt-1 font-medium">Scan to follow me on Instagram</p>
                        </div>
                    </div>
                    <div className="w-full p-4 flex flex-col space-y-2 bg-white">
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/${userData?.userName}`);
                                message.success("Link copied to clipboard!");
                            }}
                            className="w-full py-3 font-bold text-sm text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
                        >
                            Copy Link
                        </button>
                        <button 
                            onClick={() => setIsQrModalOpen(false)}
                            className="w-full py-3 font-bold text-sm text-gray-400 hover:bg-gray-50 rounded-xl transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Profile;
