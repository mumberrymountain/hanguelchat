package kr.mumberrymountain.hangeulchat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ThreadResponse {
    private String id;
    private String fileName;
    private Long fileSize;
    private LocalDateTime uploadDate;
    private LocalDateTime createdAt;
    private List<ChatMessageResponse> chatMessages;
}

