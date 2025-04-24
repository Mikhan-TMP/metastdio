'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    const username = localStorage.getItem('userName');
    if (!token && !email && !username) {
      router.push('/Auth');
    }
  }, [router]);

  return <>{children}</>;
};

export default AuthGuard;