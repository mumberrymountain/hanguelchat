package kr.mumberrymountain.hangeulchat.service;

import kr.mumberrymountain.hangeulchat.dto.ChatRequest;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Flux;

import java.util.List;

public interface ChatService {
    Flux<String> summarizeStream(MultipartFile multipartFile, String threadId, String apiKey);
    Flux<String> chatStream(String threadId, String message, List<ChatRequest.ChatMessageDto> chatHistory, String apiKey);
}
