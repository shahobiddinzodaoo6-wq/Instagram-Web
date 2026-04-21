"use client";

import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Toaster } from 'sileo';

const Layout = ({ children }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            redirect("/accounts/login");
        }
        setLoading(false);
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
                  <Toaster position="top-right" />
            {children}
        </div>
    );
}

export default Layout