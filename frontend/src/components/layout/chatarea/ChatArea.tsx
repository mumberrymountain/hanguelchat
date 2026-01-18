import React from 'react'
import { useThreadStore } from '@/store/dataStore';
import ChatDisplayArea from './ChatDisplayArea';
import FileDropzone from './FileDropZone';
import { useCustomTheme } from '@/hooks/useCustomTheme';

interface ChatAreaProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const ChatArea = ({ isLoading, setIsLoading }: ChatAreaProps) => {
  const { threads } = useThreadStore();
  const customTheme = useCustomTheme();

  // 첫 스레드가 생성되고 아직 스트리밍 시작 전인 경우 (빈 메시지일 때만)
  const firstMessage = threads[0]?.chatHistory[0];
  const isWaitingForFirstStream = isLoading && 
    threads.length === 1 && 
    threads[0].chatHistory.length === 1 && 
    firstMessage?.message === '';
  const showFileDropzone = threads.length === 0 || isWaitingForFirstStream;

  return (
    <>
      <div className={`flex-1 h-full overflow-hidden ${customTheme.chatArea.container}`}>
        {showFileDropzone ? <FileDropzone isLoading={isLoading} setIsLoading={setIsLoading}/> : <ChatDisplayArea/>}
      </div>
    </>
  )
}

export default ChatArea