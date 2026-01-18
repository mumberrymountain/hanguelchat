import React, { useRef, useEffect } from 'react'
import { useThreadStore } from '@/store/dataStore';
import { useCustomTheme } from '@/hooks/useCustomTheme';
import { useAuthStore } from '@/store/authStore';
import { updateThread as updateThreadApi } from '@/lib/api/thread';

interface SidebarListItemTextProps {
  threadId: string;
  fileName: string;
  setShowMenuButton: (show: boolean) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  editValue: string;
  setEditValue: (value: string) => void;
}

const SidebarListItemText = ({ threadId, fileName, setShowMenuButton, isEditing, setIsEditing, editValue, setEditValue }: SidebarListItemTextProps) => {

    const { setActiveThread, updateThread } = useThreadStore();
    const user = useAuthStore((state) => state.user);

    const threadItemClick = (e: React.MouseEvent<HTMLSpanElement>) => {
        if (e.currentTarget.dataset.threadId) {
            setActiveThread(e.currentTarget.dataset.threadId);
        }
    }

    const toggleEditThreadItem = (isEditing: boolean) => {
        setIsEditing(isEditing);
        setShowMenuButton(!isEditing);
        setEditValue(fileName);
    }

    const editInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        switch(e.key) {
            case "Enter":
                finishEditThreadItem();
                break;
            case "Escape":
                toggleEditThreadItem(false);
                break;
        }
    }

    const finishEditThreadItem = async () => {
        if (editValue.trim() !== '' && editValue !== fileName) {
            updateThread(threadId, { fileName: editValue.trim() });
            
            // 로그인 상태일 때 서버에도 업데이트
            if (user) {
                try {
                    await updateThreadApi(user.id, threadId, editValue.trim());
                } catch (error) {
                    console.error('Failed to update thread on server:', error);
                }
            }
        }
        setIsEditing(false);
        setShowMenuButton(true);
    }

    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const customTheme = useCustomTheme();

    return (
        <>
            {isEditing ? (
                <div className={`flex-1 rounded-lg px-3 transition-all duration-200 shadow-sm border ${customTheme.sideBarListItemText.itemInputOuter}`}>
                    <input
                        ref={inputRef}
                        type="text"
                        value={editValue}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditValue(e.target.value)}
                        onKeyDown={editInputKeyDown}
                        onBlur={() => finishEditThreadItem()}
                        className={`text-sm font-medium bg-transparent border-none outline-none w-full ${customTheme.sideBarListItemText.itemInput}`}
                    />
                </div>
            )  : (
                <span
                    data-thread-id={threadId}
                    onClick={threadItemClick}
                    onDoubleClick={() => toggleEditThreadItem(true)}
                    className={`text-sm font-medium cursor-pointer duration-200 flex-1 transition-colors ${customTheme.sideBarListItemText.itemText}`}
                >
                    {fileName}
                </span>
            )}
        </>
    )
}

export default SidebarListItemText