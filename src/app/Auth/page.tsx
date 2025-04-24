'use client';

import Login from '../components/Auth/Auth';
import AuthGuard from '../components/Auth/AuthGuard';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Authentication() {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('userEmail');
        const username = localStorage.getItem('userName');

        if (token && email && username) {
            router.push('/Dashboard');
        } else {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return <Login />;
}

