"use client";
import React, { useState } from 'react';
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
  LogOut
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('posts');
    const [ isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();

    const { data, isLoading, isError } = useQuery({
        queryFn: async () => {
            const { data } = await axiosRequest.get(`/UserProfile/get-my-profile`);
            return data.data;
        },
        queryKey: ['user-profile'],
    });

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/accounts/login");
    };  

    if (isLoading) return <div className="flex justify-center pt-20">Loading...</div>;
    if (isError) return <div className="flex justify-center pt-20 text-red-500">Error loading profile</div>;

    return (
        <div className="max-w-[935px] mx-auto pt-8 px-4 relative">
            <header className="flex flex-col md:flex-row mb-12 md:mb-16">
                <div className="flex-shrink-0 flex justify-center md:justify-start md:mr-24 mb-6 md:mb-0">
                    <div className="relative w-20 h-20 md:w-[150px] md:h-[150px] rounded-full overflow-hidden border border-gray-200">
                        <img 
                            src={data?.image || "https://i.pinimg.com/736x/9e/83/75/9e837528f01cf3f42119c5aeeed1b336.jpg"} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <section className="flex-grow text-gray-800">
                    <div className="flex flex-wrap items-center mb-5 relative">
                        <h2 className="text-xl font-semibold mr-4">{data?.userName}</h2>
                        <div className="flex space-x-2 mt-2 sm:mt-0">
                            <Link href={"/editProfile"}>
                            <button className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 font-semibold rounded-lg text-sm transition-colors">
                                Edit profile
                            </button>
                            </Link>
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
                                <div className="absolute right-0 mt-2 w-[250px] bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.1)] py-2 z-50 animate-in fade-in zoom-in duration-200">
                                    <button className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 text-left transition-colors">
                                        <QrCode className="w-5 h-5" />
                                        <span className="text-[16px]">QR code</span>
                                    </button>
                                    <button className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 text-left transition-colors">
                                        <Bell className="w-5 h-5" />
                                        <span className="text-[16px]">Notification</span>
                                    </button>
                                    <button className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 text-left transition-colors">
                                        <Settings className="w-5 h-5" />
                                        <span className="text-[16px]">Settings and privacy</span>
                                    </button>
                                    <div className="h-[1px] bg-gray-100 my-1"></div>
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 text-left transition-colors text-red-500 font-medium"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span className="text-[16px]">Log out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex space-x-10 mb-5">
                        <div><span className="font-semibold">{data?.postCount || 0}</span> posts</div>
                        <div><span className="font-semibold">{data?.subscribersCount || 0}</span> followers</div>
                        <div><span className="font-semibold">{data?.subscriptionsCount || 0}</span> following</div>
                    </div>

                    <div>
                        <h1 className="font-semibold text-base">{data?.firstName} {data?.lastName}</h1>
                    </div>
                </section>
            </header>

            <div className="flex space-x-6 mb-12 overflow-x-auto pb-4 scrollbar-hide">
                <div className="flex flex-col items-center flex-shrink-0 space-y-2">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                        <Plus className="w-8 h-8 text-gray-400 stroke-1" />
                    </div>
                    <span className="text-xs text-gray-700 font-semibold">New</span>
                </div>
            </div>

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
                        onClick={() => setActiveTab('saved')}
                        className={`flex items-center space-x-1.5 py-4 uppercase tracking-widest text-xs font-semibold border-t ${activeTab === 'saved' ? 'border-black text-black' : 'border-transparent text-gray-500'}`}
                    >
                        <Bookmark className="w-3 h-3" />
                        <span>Saved</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('tagged')}
                        className={`flex items-center space-x-1.5 py-4 uppercase tracking-widest text-xs font-semibold border-t ${activeTab === 'tagged' ? 'border-black text-black' : 'border-transparent text-gray-500'}`}
                    >
                        <Tag className="w-3 h-3" />
                        <span>Tagged</span>
                    </button>
                </div>
            </div>

            <div className="py-12 flex flex-col items-center text-center">
                {activeTab === 'tagged' && (
                    <div className="max-w-sm flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full border-2 border-black flex items-center justify-center mb-4">
                            <Tag className="w-8 h-8" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-3xl font-bold mb-2">You have not tagged</h3>
                        <p className="text-sm text-gray-500">Here show the photos and videos in which you have been tagged</p>
                    </div>
                )}
                {activeTab === 'posts' && (
                    <div className="text-gray-500 italic">No posts yet</div>
                )}
                {activeTab === 'saved' && (
                    <div className="text-gray-500 italic">No saved items</div>
                )}
            </div>
        </div>
    );
};

export default Profile;
