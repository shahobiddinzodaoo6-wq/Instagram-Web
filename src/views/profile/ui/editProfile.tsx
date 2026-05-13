"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronDown, Camera } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosRequest } from "@/src/app/(auth)/accounts/login/token";

const BASE_IMAGE_URL = "https://instagram-api.softclub.tj/images/";

export const EditProfile = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
 
    

    const [formData, setFormData] = useState({
        userName: '',
        firstName: '',
        lastName: '',
        bio: '',
        gender: ''
    });



    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);



    const { data: userData, isLoading } = useQuery({
        queryFn: async () => {
            const { data } = await axiosRequest.get(`/UserProfile/get-my-profile`);
            return data.data;
        },
        queryKey: ['user-profile'],
    });





    useEffect(() => {
        if (userData) {
            setFormData({
                userName: userData.userName || '',
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                bio: userData.bio || '',
                gender: userData.gender || ''
            });
        }
    }, [userData]);



    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };



    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };



    const updateProfileMutation = useMutation({
        mutationFn: async (updatedData: any) => {
            const profilePayload = {
                UserName: updatedData.userName,
                FullName: `${updatedData.firstName} ${updatedData.lastName}`.trim(),
                FirstName: updatedData.firstName,
                LastName: updatedData.lastName,
                About: updatedData.bio,
                Gender: updatedData.gender === 'Male' ? 0 : updatedData.gender === 'Female' ? 1 : 0,
                Email: userData?.email || '',
                PhoneNumber: userData?.phoneNumber || ''
            };


            


            await axiosRequest.put(`/UserProfile/update-user-profile`, profilePayload);
            
            if (selectedFile) {
                const imageFormData = new FormData();
                imageFormData.append('imageFile', selectedFile);
                await axiosRequest.put(`/UserProfile/update-user-image-profile`, imageFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
            router.push('/profile');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfileMutation.mutate(formData);
    };

    if (isLoading) return <div className="flex justify-center pt-20">Loading...</div>;

    const currentImage = previewUrl || (userData?.image ? `${BASE_IMAGE_URL}${userData.image}` : "https://i.pinimg.com/736x/9e/83/75/9e837528f01cf3f42119c5aeeed1b336.jpg");

    return (
        <div className="max-w-[600px] mx-auto pt-8 px-4 pb-20">
            <div className="flex items-center space-x-2 mb-8 text-sm md:text-base">
                <button 
                    onClick={() => router.push('/profile')}
                    className="text-blue-600 font-bold hover:underline"
                >
                    Profile
                </button>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="font-bold text-gray-900">Edit profile</span>
            </div>

            <div className="bg-gray-50/50 rounded-2xl p-4 mb-8 flex items-center justify-between border border-gray-100">
                <div className="flex items-center space-x-4">
                    <div className="relative group">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm">
                            <img 
                                src={currentImage} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                        >
                            <Camera className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 leading-tight">{userData?.userName}</h3>
                        <p className="text-gray-500 text-sm">{userData?.firstName} {userData?.lastName}</p>
                    </div>
                </div>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*"
                />
                <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white text-blue-600 px-4 py-2 rounded-xl font-bold text-sm shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                    Change photo
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* First Name */}
                <div className="relative">
                    <div className="border border-gray-200 rounded-xl p-3 focus-within:border-blue-500 transition-colors bg-white">
                        <label className="block text-xs text-gray-400 mb-1">First Name</label>
                        <input 
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full text-gray-900 font-medium focus:outline-none bg-transparent"
                            placeholder="First Name"
                        />
                    </div>
                </div>

                {/* Last Name */}
                <div className="relative">
                    <div className="border border-gray-200 rounded-xl p-3 focus-within:border-blue-500 transition-colors bg-white">
                        <label className="block text-xs text-gray-400 mb-1">Last Name</label>
                        <input 
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full text-gray-900 font-medium focus:outline-none bg-transparent"
                            placeholder="Last Name"
                        />
                    </div>
                </div>

                {/* User Name */}
                <div className="relative">
                    <div className="border border-gray-200 rounded-xl p-3 focus-within:border-blue-500 transition-colors bg-white">
                        <label className="block text-xs text-gray-400 mb-1">User name</label>
                        <input 
                            type="text"
                            name="userName"
                            value={formData.userName}
                            onChange={handleInputChange}
                            className="w-full text-gray-900 font-medium focus:outline-none bg-transparent"
                            placeholder="username"
                        />
                    </div>
                </div>

                {/* Bio */}
                <div className="relative">
                    <div className="border border-gray-200 rounded-xl p-3 focus-within:border-blue-500 transition-colors bg-white">
                        <label className="block text-xs text-gray-400 mb-1">Bio</label>
                        <textarea 
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full text-gray-900 font-medium focus:outline-none bg-transparent resize-none"
                            placeholder="Add a bio"
                        />
                    </div>
                </div>

                {/* Gender */}
                <div className="relative">
                    <div className="border border-gray-200 rounded-xl p-3 focus-within:border-blue-500 transition-colors bg-white relative">
                        <label className="block text-xs text-gray-400 mb-1">Gender</label>
                        <select 
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="w-full text-gray-900 font-medium focus:outline-none bg-transparent appearance-none cursor-pointer"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                        <ChevronDown className="absolute right-4 bottom-4 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <p className="text-gray-500 text-xs mt-4 font-medium">
                    This won't be part of your public profile.
                </p>

                <button 
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="w-full bg-[#E8EDF2] hover:bg-[#DDE4ED] text-[#4A5568] font-bold py-4 rounded-2xl transition-all active:scale-[0.98] mt-8 disabled:opacity-50 shadow-sm"
                >
                    {updateProfileMutation.isPending ? 'Saving...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};
