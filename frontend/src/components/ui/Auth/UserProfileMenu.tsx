"use client"
import { useTranslations } from 'next-intl';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCustomTheme } from '@/hooks/useCustomTheme';
import { useThreadStore } from '@/store/dataStore';
import { toast } from 'sonner';

interface UserProfileMenuProps {
    onClose: () => void;
}

export default function UserProfileMenu({ onClose }: UserProfileMenuProps) {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const clearThreads = useThreadStore((state) => state.clearThreads);
    const t = useTranslations('UserProfile');
    const customTheme = useCustomTheme();

    const handleLogout = () => {
        logout();
        clearThreads();
        toast.success(t('logoutSuccess'));
        onClose();
    };

    if (!user) return null;

    return (
        <div className={`absolute right-0 top-full mt-2 w-64 rounded-lg shadow-xl z-50 ${customTheme.userProfileMenu?.container || 'bg-gray-800 border border-gray-700'}`}>
            {/* 사용자 정보 섹션 */}
            <div className={`px-4 py-3 border-b ${customTheme.userProfileMenu?.border || 'border-gray-700'}`}>
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${customTheme.userProfile?.avatar || 'bg-purple-600 text-white'}`}>
                        {user.username.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <div className={`text-sm font-medium ${customTheme.userProfileMenu?.name || 'text-white'}`}>
                            {user.username}
                        </div>
                        <div className={`text-xs ${customTheme.userProfileMenu?.handle || 'text-gray-400'}`}>
                            @{user.username.toLowerCase().replace(/\s+/g, '')}
                        </div>
                    </div>
                </div>
            </div>

            {/* 메뉴 항목 */}
            <div className="py-2">
                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${customTheme.userProfileMenu?.logoutButton || 'text-gray-300 hover:bg-gray-700'}`}
                >
                    <LogOut className="w-4 h-4" />
                    <span>{t('logout')}</span>
                </button>
            </div>
        </div>
    );
}

