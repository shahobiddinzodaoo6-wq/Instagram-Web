"use client";

import { useMutation } from "@tanstack/react-query";
import { axiosRequest } from "../../login/token";
import React from "react";

export const ForgotPassword = () => {
    const { mutate, isPending } = useMutation({
        mutationFn: async (payload: any) => {
            const { data } = await axiosRequest.put(`/Accounts/ChangePassword`, payload);
            return data.data;
        },
        onSuccess: () => {
            alert("Password successfully updated");
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || "Failed to update password");
        },
        mutationKey: ["change-password"],
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const target = event.target as any;
        const oldPassword = target["inpOldPassword"].value;
        const newPassword = target["inpNewPassword"].value;
        const confirmPassword = target["inpConfirmPassword"].value;
        
        if (newPassword !== confirmPassword) {
            alert("New passwords do not match");
            return;
        }

        mutate({ oldPassword, newPassword, confirmPassword });
    };

    



    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Change Password</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input 
                        type="password" 
                        name="inpOldPassword" 
                        placeholder="Old Password" 
                        className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input 
                        type="password" 
                        name="inpNewPassword" 
                        placeholder="New Password" 
                        className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input 
                        type="password" 
                        name="inpConfirmPassword" 
                        placeholder="Confirm New Password" 
                        className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <button 
                        type="submit" 
                        disabled={isPending}
                        className="bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                    >
                        {isPending ? "Updating..." : "Save"}
                    </button>
                </form>
            </div>
        </div>
    );
};


export default ForgotPassword;







