"use client";
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { axiosRequest } from '@/src/app/(auth)/accounts/login/token';
import { Heart, UserPlus, MessageCircle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';


const NotificationsPage = () => {
    const router = useRouter();
    


    // Fetching subscribers as a proxy for "follow" notifications
    const { data: subscribers, isLoading } = useQuery({
        queryFn: async () => {
             const { data: profile } = await axiosRequest.get('/UserProfile/get-my-profile');
             const userId = profile.data.id;
             const { data } = await axiosRequest.get(`/FollowingRelationShip/get-subscribers`, {
                 params: { UserId: userId, PageNumber: 1, PageSize: 50 }
             });
             return data.data || data;
        },
        queryKey: ['notifications-list'],
    });



    return (
        <div className="max-w-[600px] mx-auto bg-white min-h-screen">
            {/* Header */}
            <div className="px-4 py-6 border-b border-gray-100 sticky top-0 bg-white z-10 flex items-center space-x-4">
                <button onClick={() => router.back()} className="p-1 hover:bg-gray-100 rounded-full transition-colors md:hidden">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
            </div>

            {/* Notifications List */}
            <div className="py-2">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
                    </div>
                ) : subscribers && subscribers.length > 0 ? (
                    <div className="flex flex-col">
                        <h3 className="px-4 py-4 font-bold text-sm text-gray-900">This Month</h3>
                        {subscribers.map((user: any) => (
                            <div 
                                key={user.id || user.userId} 
                                onClick={() => router.push(`/${user.userName}`)}
                                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer group"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-11 h-11 rounded-full overflow-hidden border border-gray-100 flex-shrink-0">
                                        <img 
                                            src={user.image ? `https://instagram-api.softclub.tj/images/${user.image}` : "https://i.pinimg.com/736x/9e/83/75/9e837528f01cf3f42119c5aeeed1b336.jpg"} 
                                            alt="" 
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                                        />
                                    </div>
                                    <div className="text-sm leading-tight">
                                        <span className="font-bold hover:underline">{user.userName}</span>
                                        <span className="text-gray-800 ml-1">started following you.</span>
                                        <span className="text-gray-400 ml-2 text-xs">2d</span>
                                    </div>
                                </div>
                                <button 
                                    className={`px-5 py-1.5 rounded-lg text-sm font-bold transition-all ${user.isFollowing 
                                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-900' 
                                        : 'bg-[#0095F6] hover:bg-[#1877F2] text-white shadow-sm'
                                    }`}
                                >
                                    {user.isFollowing ? 'Following' : 'Follow'}
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center px-10">
                        <div className="w-20 h-20 rounded-full border-2 border-gray-900 flex items-center justify-center mb-6">
                            <Heart className="w-10 h-10 stroke-[1.5px]" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Activity On Your Posts</h2>
                        <p className="text-gray-500 mt-3 max-w-[280px] leading-relaxed">
                            When someone likes or comments on one of your posts, you'll see it here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};


export default NotificationsPage;







