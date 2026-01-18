import React from 'react'
import AssistantIcon from '../../ui/Icon/AssistantIcon';
import ChatMessageProps from '@/types/ChatMessageProps';
import { useCustomTheme } from '@/hooks/useCustomTheme';
import { BeatLoader } from 'react-spinners';

const ChatMessage: React.FC<ChatMessageProps> = ({ message, role, isLoading = false, isStreaming = false }) => {
  const customTheme = useCustomTheme();

  return (
    <div className={`flex ${role == "user" ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-[80%] px-4 py-3 rounded-lg ${
          role == "user"
            ? `rounded-bl-sm bg-opacity-90 shadow-sm me-5 border ${customTheme.chatMessage.userMessage}`
            : ''
        }`}
      >
        <div className='flex relative items-start'>
          {role == "assistant" && <div className="pe-1.5 w-fit h-fit"><AssistantIcon/></div>}
          {isLoading ? (
            <BeatLoader color="#7d9b76" size={8} />
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {message}
              {isStreaming && <span className="inline-block w-2 h-4 ml-0.5 bg-current animate-pulse" />}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;