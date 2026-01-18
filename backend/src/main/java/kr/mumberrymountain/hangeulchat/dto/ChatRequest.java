package kr.mumberrymountain.hangeulchat.dto;

import lombok.Data;
import java.util.List;

@Data
public class ChatRequest {
    private String threadId;
    private String message;
    private List<ChatMessageDto> chatHistory;
    private String apiKey;

    @Data
    public static class ChatMessageDto {
        private String role;
        private String message;
    }
}

