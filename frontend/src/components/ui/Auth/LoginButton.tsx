"use client"
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { LogIn } from 'lucide-react';
import { useCustomTheme } from '@/hooks/useCustomTheme';
import AuthModal from './AuthModal';

export default function LoginButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const t = useTranslations('AuthModal');
    const customTheme = useCustomTheme();

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${customTheme.loginButton?.button || 'bg-purple-600 hover:bg-purple-700 text-white'}`}
            >
                <LogIn className="w-4 h-4" />
                {t('login')}
            </button>
            <AuthModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialMode="login"
            />
        </>
    );
}

