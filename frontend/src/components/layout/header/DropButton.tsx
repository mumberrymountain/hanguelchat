import React from 'react'
import { useThreadStore } from '@/store/dataStore';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { useCustomTheme } from '@/hooks/useCustomTheme';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useApiKeyStore } from '@/store/apiKeyStore';
import { useAuthStore } from '@/store/authStore';
import { doFileProcess } from '@/lib/util/common';


interface DropButtonProps {
    setIsLoading: (loading: boolean) => void;
}

const DropButton = ({ setIsLoading }: DropButtonProps) => {
    const locale = useTranslations('DropButton');
    const { addThread, addStreamingMessage, updateStreamingMessage, getStreamingMessage } = useThreadStore();
    const customTheme = useCustomTheme();
    const { apiKey } = useApiKeyStore();
    const user = useAuthStore((state) => state.user);
    const { getRootProps, getInputProps, isDragActive } = useFileUpload({
        onFileProcess: (file: File) => doFileProcess({
            file,
            apiKey,
            user,
            addThread,
            addStreamingMessage,
            updateStreamingMessage,
            getStreamingMessage,
            setIsLoading,
            onError: (key) => toast.error(locale(key)),
        })
    });

    return (
        <button                  
            {...getRootProps()}                  
            className={`ml-4 inline-flex items-center justify-center px-2 py-1 border rounded-md text-sm font-medium cursor-pointer shadow-sm gap-1.5 font-sans hover:shadow-md ${                 
                isDragActive                      
                    ? `bg-blue-900/30 border-blue-400 text-blue-300`                 
                    : `${customTheme.dropButton.base}`  
            }`}                 
            type="button"             
            >                 
            <input {...getInputProps()} />                 
            <span className={`text-base font-bold text-gray-400`}>+</span>                 
            {locale('fileDrop')}       
        </button>
    )
}

export default DropButton