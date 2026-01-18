interface ChatMessageProps {
  message: string;
  role: 'user' | 'assistant';
  isLoading?: boolean;
  isStreaming?: boolean;
}

export default ChatMessageProps;