package kr.mumberrymountain.hangeulchat.controller;

import kr.mumberrymountain.hangeulchat.dto.ChatRequest;
import kr.mumberrymountain.hangeulchat.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Flux;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/summarize")
    @ResponseBody
    public String summarize(
            @RequestParam("file") MultipartFile multipartFile,
            @RequestParam("threadId") String threadId,
            @RequestParam("apiKey") String apiKey) {
        return chatService.summarize(multipartFile, threadId, apiKey);
    }

    @PostMapping(value = "/summarize/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> summarizeStream(
            @RequestParam("file") MultipartFile multipartFile,
            @RequestParam("threadId") String threadId,
            @RequestParam("apiKey") String apiKey) {
        return chatService.summarizeStream(multipartFile, threadId, apiKey);
    }

    @PostMapping("/chat")
    @ResponseBody
    public String chat(@RequestBody ChatRequest request) {
        return chatService.chat(request.getThreadId(), request.getMessage(), request.getChatHistory(), request.getApiKey());
    }

    @PostMapping(value = "/chat/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> chatStream(@RequestBody ChatRequest request) {
        return chatService.chatStream(request.getThreadId(), request.getMessage(), request.getChatHistory(), request.getApiKey());
    }
}
