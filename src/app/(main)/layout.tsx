"use client";

import { Sidebar } from '../../widgets/sidebar';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Toaster } from 'sileo';

const Layout = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/accounts/login");
        } else {
            setLoading(false);
        }
    }, [router]);

    if (loading) return <div className="flex items-center justify-center h-screen font-sans">Loading...</div>;

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 overflow-y-auto bg-white">
                <Toaster position="top-right" />
                <main className="min-h-full">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default Layout;