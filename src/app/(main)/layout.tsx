"use client";

import { Sidebar } from '../../widgets/sidebar';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Toaster } from 'sileo';

const Layout = ({ children } : any) => {
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

    const pathname = usePathname();
    const isDirectPage = pathname?.startsWith('/direct');

    if (loading) return <div className="flex items-center justify-center h-screen font-sans">Loading...</div>;

    return (
        <div className="flex h-screen bg-white overflow-hidden">
            <Sidebar />
            <div className={`flex-1 ml-[72px] xl:ml-[244px] transition-all duration-300 h-screen flex flex-col ${isDirectPage ? 'overflow-hidden' : 'overflow-y-auto'}`}>
                <Toaster position="top-right" />
                <main className={`flex-1 flex flex-col ${isDirectPage ? 'overflow-hidden' : 'max-w-[935px] mx-auto py-8 px-4 w-full'}`}>
                    {children}
                </main>
            </div>
        </div>
    );
}


export default Layout;








