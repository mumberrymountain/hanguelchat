"use client"
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { X, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useCustomTheme } from '@/hooks/useCustomTheme';
import { signUp, login } from '@/lib/api/auth';
import { toast } from 'sonner';
import Logo from '@/components/ui/Icon/Logo';
import { useAuthStore } from '@/store/authStore';
import { useThreadStore } from '@/store/dataStore';
import { getUserThreads } from '@/lib/api/thread';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
    const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const t = useTranslations('AuthModal');
    const customTheme = useCustomTheme();
    const setUser = useAuthStore((state) => state.setUser);
    const loadThreads = useThreadStore((state) => state.loadThreads);

    if (!isOpen) return null;

    // 이메일 형식 검사
    const validateEmail = (email: string): boolean => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    // 비밀번호 검사: 최소 8자, 영문자 + 숫자 필수
    const validatePassword = (password: string): boolean => {
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
        return passwordPattern.test(password);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // 필수 입력 검사
        if (!formData.email.trim()) {
            toast.error(t('emailRequired'));
            return;
        }
        if (!formData.password.trim()) {
            toast.error(t('passwordRequired'));
            return;
        }
        if (mode === 'signup' && !formData.username.trim()) {
            toast.error(t('usernameRequired'));
            return;
        }
        
        // 회원가입 시 형식 검사
        if (mode === 'signup') {
            if (!validateEmail(formData.email)) {
                toast.error(t('invalidEmail'));
                return;
            }
            if (!validatePassword(formData.password)) {
                toast.error(t('passwordRequirements'));
                return;
            }
        }
        setIsLoading(true);

        try {
            let response;
            if (mode === 'signup') {
                response = await signUp({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                });
                toast.success(t('signupSuccess'));
            } else {
                response = await login({
                    email: formData.email,
                    password: formData.password,
                });
                toast.success(t('loginSuccess'));
            }
            // Store에 사용자 정보 저장
            setUser({
                id: response.id,
                username: response.username,
                email: response.email,
            });
            
            // 로그인 시 사용자의 Thread 목록 로드
            if (mode === 'login') {
                try {
                    const threads = await getUserThreads(response.id);
                    loadThreads(threads.map(thread => ({
                        id: thread.id,
                        fileName: thread.fileName,
                        uploadDate: thread.uploadDate,
                        fileSize: thread.fileSize,
                        chatHistory: thread.chatMessages.map(msg => ({
                            id: msg.id,
                            role: msg.role,
                            message: msg.message,
                            timestamp: msg.timestamp
                        }))
                    })));
                } catch (error) {
                    console.error('Failed to load threads:', error);
                }
            }
            
            onClose();
            // Reset form
            setFormData({ username: '', email: '', password: '' });
        } catch (error) {
            const httpError = error as Error & { status?: number };
            if (httpError.status === 400 || httpError.status === 401) {
                toast.error(mode === 'signup' ? t('signupError') : t('loginError'));
            } else {
                toast.error(t('serverError'));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className={`relative w-full max-w-md rounded-lg shadow-xl ${customTheme.authModal?.container || 'bg-white dark:bg-gray-800'}`}>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className={`absolute right-4 top-4 ${customTheme.authModal?.closeButton || 'text-gray-500 hover:text-gray-700'}`}
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Logo */}
                <div className="flex justify-center pt-8 pb-4">
                    <Logo />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-8 pb-8">
                    {/* Email Input */}
                    <div className="mb-4">
                        <label className={`block text-sm font-medium mb-2 ${customTheme.authModal?.label || 'text-gray-700 dark:text-gray-300'}`}>
                            {t('email')}
                        </label>
                        <div className="relative">
                            <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${customTheme.authModal?.inputIcon || 'text-gray-400'}`} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder={t('emailPlaceholder')}
                                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${customTheme.authModal?.input || 'border-gray-300 focus:ring-purple-500'}`}
                            />
                        </div>
                    </div>

                    {/* Username Input (Signup only) */}
                    {mode === 'signup' && (
                        <div className="mb-4">
                            <label className={`block text-sm font-medium mb-2 ${customTheme.authModal?.label || 'text-gray-700 dark:text-gray-300'}`}>
                                {t('username')}
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                placeholder={t('usernamePlaceholder')}
                                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${customTheme.authModal?.input || 'border-gray-300 focus:ring-purple-500'}`}
                            />
                        </div>
                    )}

                    {/* Password Input */}
                    <div className="mb-4">
                        <label className={`block text-sm font-medium mb-2 ${customTheme.authModal?.label || 'text-gray-700 dark:text-gray-300'}`}>
                            {t('password')}
                        </label>
                        <div className="relative">
                            <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${customTheme.authModal?.inputIcon || 'text-gray-400'}`} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder={t('passwordPlaceholder')}
                                className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 ${customTheme.authModal?.input || 'border-gray-300 focus:ring-purple-500'}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${customTheme.authModal?.passwordToggle || 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Forgot Password Link (Login only) */}
                    {mode === 'login' && (
                        <div className="mb-6 text-right hidden">
                            <button
                                type="button"
                                className={`text-sm ${customTheme.authModal?.forgotPassword || 'text-purple-600 hover:text-purple-700'}`}
                            >
                                {t('forgotPassword')}
                            </button>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 rounded-md font-medium transition-colors ${customTheme.authModal?.submitButton || 'bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-400'}`}
                    >
                        {isLoading ? t('loading') : mode === 'signup' ? t('signup') : t('login')}
                    </button>

                    {/* Toggle Mode */}
                    <div className="mt-6 text-center">
                        <span className={`text-sm ${customTheme.authModal?.toggleText || 'text-gray-600 dark:text-gray-400'}`}>
                            {mode === 'login' ? t('noAccount') : t('hasAccount')}
                        </span>
                        <button
                            type="button"
                            onClick={() => {
                                setMode(mode === 'login' ? 'signup' : 'login');
                                setFormData({ username: '', email: '', password: '' });
                            }}
                            className={`ml-2 text-sm font-medium ${customTheme.authModal?.toggleLink || 'text-purple-600 hover:text-purple-700'}`}
                        >
                            {mode === 'login' ? t('signup') : t('login')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

