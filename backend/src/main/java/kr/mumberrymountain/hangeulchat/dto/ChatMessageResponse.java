package kr.mumberrymountain.hangeulchat.dto;

import kr.mumberrymountain.hangeulchat.entity.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponse {
    private String id;
    private ChatMessage.MessageRole role;
    private String message;
    private LocalDateTime timestamp;
}

