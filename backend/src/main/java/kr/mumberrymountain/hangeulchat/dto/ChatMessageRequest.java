package kr.mumberrymountain.hangeulchat.dto;

import kr.mumberrymountain.hangeulchat.entity.ChatMessage;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChatMessageRequest {
    private ChatMessage.MessageRole role;
    private String message;
    private LocalDateTime timestamp;
}

