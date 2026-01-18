import React from 'react'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { Edit3, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl';
import { useCustomTheme } from '@/hooks/useCustomTheme';
import { useThreadStore } from '@/store/dataStore';
import { useAuthStore } from '@/store/authStore';
import { deleteThread as deleteThreadApi } from '@/lib/api/thread';

interface SidebarListItemMenuButtonProps {
  threadId: string;
  fileName: string;
  setShowMenuButton: (show: boolean) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  editValue: string;
  setEditValue: (value: string) => void;
}

const SidebarListItemMenuButton = ({ threadId, fileName, setShowMenuButton, setIsEditing, setEditValue }: SidebarListItemMenuButtonProps) => {
  const { threads, removeThread, setActiveThread } = useThreadStore();
  const user = useAuthStore((state) => state.user);
  
  const handleMenuAction = async (action: string) => {
    switch(action) {
      case "edit":
        setIsEditing(true);
        setShowMenuButton(false);
        setEditValue(fileName);
        break;
      case "delete":
        // 로그인 상태일 때 서버에서도 삭제
        if (user) {
          try {
            await deleteThreadApi(user.id, threadId);
          } catch (error) {
            console.error('Failed to delete thread on server:', error);
            return;
          }
        }
        
        // 삭제 전에 다른 스레드가 있으면 해당 스레드를 활성화
        const currentIndex = threads.findIndex(t => t.id === threadId);
        const remainingThreads = threads.filter(t => t.id !== threadId);
        
        if (remainingThreads.length > 0) {
          // 이전 스레드가 있으면 이전 스레드, 없으면 다음 스레드 활성화
          const nextActiveIndex = currentIndex > 0 ? currentIndex - 1 : 0;
          const nextActiveThread = remainingThreads[nextActiveIndex];
          if (nextActiveThread) {
            setActiveThread(nextActiveThread.id);
          }
        }
        
        removeThread(threadId);
        break;
    }
  }

  const locale = useTranslations("SidebarListItemMenuButton");
  const customTheme = useCustomTheme();
  
  return (
    <Popover className="relative">
      {() => (
        <>
          <PopoverButton
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className={`p-1 rounded cursor-pointer transition-colors focus:outline-none`}
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 16 16" 
              fill="none" 
              className={`${customTheme.sideBarListItemMenuButton.menuIcon}`}
            >
              <circle cx="8" cy="2" r="1.5" fill="currentColor"/>
              <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
              <circle cx="8" cy="14" r="1.5" fill="currentColor"/>
            </svg>
          </PopoverButton>

          <PopoverPanel className={`absolute right-0 top-8 z-10 w-48 rounded-md ring-1 focus:outline-none shadow-xl ${customTheme.sideBarListItemMenuButton.popOverPanel}`}>
            <div className="py-1">
              <button
                onClick={() => handleMenuAction('edit')}
                className={`cursor-pointer w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${customTheme.sideBarListItemMenuButton.menuItem}`}
              >
                <Edit3 size={14} />
                {locale("edit")}
              </button>
              <button
                onClick={() => handleMenuAction('delete')}
                className={`cursor-pointer w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${customTheme.sideBarListItemMenuButton.menuDeleteItem}`}
              >
                <Trash2 size={14} />
                {locale("delete")}
              </button>
            </div>
          </PopoverPanel>
        </>
      )}
    </Popover>
  )
}

export default SidebarListItemMenuButton