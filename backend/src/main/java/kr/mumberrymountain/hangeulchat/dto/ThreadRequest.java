package kr.mumberrymountain.hangeulchat.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ThreadRequest {
    private String fileName;
    private Long fileSize;
    private LocalDateTime uploadDate;
    private String documentContent;
}

