"use client"
import { useAuthStore } from '@/store/authStore';
import LoginButton from './LoginButton';
import UserProfile from './UserProfile';

export default function AuthButton() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (isAuthenticated) {
        return <UserProfile />;
    }

    return <LoginButton />;
}

