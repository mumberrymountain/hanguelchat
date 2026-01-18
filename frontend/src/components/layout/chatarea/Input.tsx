import React from 'react'
import { useState } from 'react';
import { Send } from 'lucide-react';
import { useThreadStore } from '@/store/dataStore';
import { useApiKeyStore } from '@/store/apiKeyStore';
import { useCustomTheme } from '@/hooks/useCustomTheme';
import { processStream } from '@/lib/util/common';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/store/authStore';
import { addChatMessage } from '@/lib/api/thread';

const Input = () => {
  const [message, setMessage] = useState('');
  const { getActiveThread, addChatMessage: addChatMessageToStore, addStreamingMessage, updateStreamingMessage, getStreamingMessage, isLoading, setIsLoading } = useThreadStore();
  const { apiKey } = useApiKeyStore();
  const user = useAuthStore((state) => state.user);
  const locale = useTranslations('ChatInput');

  const handleSubmit = async () => {
    if (!message.trim() || isLoading) return;

    const activeThread = getActiveThread();
    if (!activeThread) return;

    const currentMessage = message;
    setMessage(''); // 먼저 입력창 비우기

    // 사용자 메시지 먼저 화면에 추가
    addChatMessageToStore(activeThread.id, {
      role: 'user',
      message: currentMessage,
      timestamp: new Date().toISOString()
    });

    // 로그인 상태일 때 서버에 메시지 저장
    if (user) {
      try {
        await addChatMessage(user.id, activeThread.id, {
          role: 'user',
          message: currentMessage,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Failed to save message to server:', error);
        toast.error(locale('unknownServerException'));
        return;
      }
    }

    // 로딩 시작
    setIsLoading(true);

    // 스트리밍 메시지 추가 (빈 메시지로 시작)
    const streamingMessageId = addStreamingMessage(activeThread.id);

    // 이전 대화 기록과 함께 요청 데이터 구성
    const data = {
      threadId: activeThread.id,
      message: currentMessage,
      chatHistory: activeThread.chatHistory.filter(item => item.id !== streamingMessageId).map(item => ({
        role: item.role,
        message: item.message
      })),
      apiKey: apiKey
    };

    // 스트리밍 API 호출
    await processStream(
      `${process.env.NEXT_PUBLIC_CHAT_API_URL}/chat/stream`,
      JSON.stringify(data),
      {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      // onChunk: 청크가 들어올 때마다 메시지 업데이트
      (chunk) => {
        updateStreamingMessage(activeThread.id, streamingMessageId, chunk);
      },
      // onComplete: 스트리밍 완료
      async () => {
        setIsLoading(false);
        
        // 로그인 상태일 때 서버에 AI 응답 저장
        if (user) {
          try {
            const finalMessage = getStreamingMessage(activeThread.id, streamingMessageId);
            await addChatMessage(user.id, activeThread.id, {
              role: 'assistant',
              message: finalMessage,
              timestamp: new Date().toISOString()
            });
          } catch (error) {
            console.error('Failed to save message to server:', error);
            toast.error(locale('unknownServerException'));
          }
        }
      },
      // onError: 에러 발생
      (error) => {
        console.error('Streaming error:', error);
        toast.error(locale('unknownServerException'));
        setIsLoading(false);
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const customTheme = useCustomTheme();

  return (
    <div className={`flex justify-center w-full px-4 pb-3`}>
        <div className={`flex items-end gap-3 p-3 rounded-2xl transition-all duration-200 w-[50%]
                         ${customTheme.chatInput.container}`}>
            
            <div className="flex-1">
              <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  className={`w-full min-h-[20px] max-h-48 px-0 py-1 bg-transparent
                              border-none outline-none resize-none scrollbar-thin scrollbar-track-transparent
                              disabled:opacity-50 disabled:cursor-not-allowed
                              ${customTheme.chatInput.textarea}`}
                  rows={1}
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: `${customTheme.chatInput.textareaScrollbar}`
                  }}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!message.trim() || isLoading}
              className={`flex items-center justify-center w-10 h-10 rounded-xl cursor-pointer transition-colors duration-200 flex-shrink-0 ${customTheme.chatInput.sendButton}`}
            >
              <Send className={`w-5 h-5 text-white`}/>
            </button>
        </div>
    </div>
  );
}

export default Input