import React from 'react'
import ChatIcon from '../../ui/Icon/ChatIcon'
import { useTranslations } from 'next-intl';
import { useCustomTheme } from '@/hooks/useCustomTheme';

const SidebarHeader = () => {
    const locale = useTranslations('SidebarHeader');
    const customTheme = useCustomTheme();

    return (
        <div className="flex items-center gap-[5px]">
            <ChatIcon iconThemeColor={customTheme.sideBarHeader.sideBarChatIcon}/>
            <span className={`text-sm font-medium color-[#e5e7eb] ${customTheme.sideBarHeader.sideBarChatIconText}`}>{locale('chat')}</span>
        </div>
    )
}

export default SidebarHeader