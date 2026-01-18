import React, { useRef } from 'react'
import Input from './Input'
import Message from './Message';
import { useThreadStore } from '@/store/dataStore';
import { useCustomTheme } from '@/hooks/useCustomTheme';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';

const ChatDisplayArea = () => {
  const { getActiveThread, isLoading } = useThreadStore();
  const chatHistory = getActiveThread()?.chatHistory || [];
  const customTheme = useCustomTheme();
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  return (
    <div className="h-full flex flex-col relative">
      <div className={`flex-1 min-h-0 mt-3 pb-4 ${customTheme.chatDisplayArea.text}`}>
        <Virtuoso
          ref={virtuosoRef}
          style={{ height: '100%' }}
          data={chatHistory}
          initialTopMostItemIndex={chatHistory.length - 1}
          followOutput="smooth"
          itemContent={(index, chat) => (
            <Message 
              key={chat.id || index} 
              message={chat.message} 
              role={chat.role}
              isStreaming={isLoading && index === chatHistory.length - 1 && chat.role === 'assistant'}
            />
          )}
        />
      </div>
      <div className="flex-shrink-0">
        <Input/>
      </div>
    </div>
  )
}

export default ChatDisplayArea;