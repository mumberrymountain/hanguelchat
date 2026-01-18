import React from 'react'
import { useTranslations } from 'next-intl';
import { useThreadStore } from '@/store/dataStore';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import { useCustomTheme } from '@/hooks/useCustomTheme';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useApiKeyStore } from '@/store/apiKeyStore';
import { useAuthStore } from '@/store/authStore';
import { doFileProcess } from '@/lib/util/common';

interface ChatAreaDropButtonProps {
  setIsLoading: (loading: boolean) => void;
}


const ChatAreaDropButton = ({ setIsLoading }: ChatAreaDropButtonProps) => {
    const locale = useTranslations('ChatAreaDropButton');
    const { addThread, addStreamingMessage, updateStreamingMessage, getStreamingMessage } = useThreadStore();
    const customTheme = useCustomTheme();
    const { apiKey } = useApiKeyStore();
    const user = useAuthStore((state) => state.user);

    const { getRootProps, getInputProps } = useFileUpload({
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
        <div className='p-2.5'>
            <section className={`flex flex-col font-sans p-5 shadow-2xl rounded-3xl backdrop-blur-sm border ${customTheme.chatAreaDropButton.fileDropZoneSection}`}>
                <div className={`flex-1 flex flex-col items-center p-5 rounded-xl outline-none ease-in-out w-[500px] border-2 border-dashed ${customTheme.chatAreaDropButton.fileDropZoneSectionInnerDiv}`} {...getRootProps()}>
                    <input {...getInputProps()} />
                    <div className='flex flex-col justify-center items-center gap-4'>
                        <Upload size={64} className={`${customTheme.chatAreaDropButton.fileDropZoneUploadIcon}`}/>
                        <p className={`${customTheme.chatAreaDropButton.fileDropZoneUploadText}`}>{locale("fileDropOrClick")}</p>
                        <div className={`inline-flex items-center px-6 py-3 bg-gradient-to-br from-blue-500 to-purple-600 text-white 
                                        rounded-lg font-medium transition-all duration-300 ease-in-out 
                                        border-none cursor-pointer hover:shadow-lg hover:scale-105`}>
                        {locale("fileSelect")}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ChatAreaDropButton