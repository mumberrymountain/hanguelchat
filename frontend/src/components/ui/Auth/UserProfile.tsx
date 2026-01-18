"use client"
import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCustomTheme } from '@/hooks/useCustomTheme';
import UserProfileMenu from './UserProfileMenu';

export default function UserProfile() {
    const user = useAuthStore((state) => state.user);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const customTheme = useCustomTheme();

    // 사용자 이니셜 생성 (username의 첫 글자들)
    const getInitials = (username: string) => {
        const words = username.split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
        return username.substring(0, 2).toUpperCase();
    };

    // 외부 클릭 시 메뉴 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    if (!user) return null;

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none inline-flex items-center justify-center px-2 py-1 border rounded-md text-sm font-medium cursor-pointer transition-all duration-200 shadow-sm gap-1.5 font-sans hover:shadow-md ${customTheme.userProfile?.button || customTheme.localeListBox?.listboxButton || 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600 hover:border-gray-500'}`}
            >
                {/* 아바타 */}
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold ${customTheme.userProfile?.avatar || 'bg-purple-600 text-white'}`}>
                    {getInitials(user.username)}
                </div>
                {/* 사용자 이름만 표시 */}
                <span className={`text-sm ${customTheme.userProfile?.name || 'text-white'}`}>
                    {user.username}
                </span>
            </button>

            {/* 메뉴 팝업 */}
            {isMenuOpen && <UserProfileMenu onClose={() => setIsMenuOpen(false)} />}
        </div>
    );
}

