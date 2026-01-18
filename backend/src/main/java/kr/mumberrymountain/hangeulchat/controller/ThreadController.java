package kr.mumberrymountain.hangeulchat.controller;

import kr.mumberrymountain.hangeulchat.dto.ChatMessageRequest;
import kr.mumberrymountain.hangeulchat.dto.ChatMessageResponse;
import kr.mumberrymountain.hangeulchat.dto.ThreadRequest;
import kr.mumberrymountain.hangeulchat.dto.ThreadResponse;
import kr.mumberrymountain.hangeulchat.service.ThreadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/threads")
@RequiredArgsConstructor
public class ThreadController {

    private final ThreadService threadService;

    @PostMapping
    public ThreadResponse createThread(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam("threadId") String threadId,
            @RequestBody ThreadRequest request) {
        return threadService.createThread(userId, threadId, request);
    }

    @GetMapping
    public List<ThreadResponse> getUserThreads(@RequestHeader("X-User-Id") Long userId) {
        return threadService.getUserThreads(userId);
    }

    @GetMapping("/{threadId}")
    public ThreadResponse getThread(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable String threadId) {
        return threadService.getThread(userId, threadId);
    }

    @PostMapping("/{threadId}/update")
    public ThreadResponse updateThread(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable String threadId,
            @RequestParam("fileName") String fileName) {
        return threadService.updateThread(userId, threadId, fileName);
    }

    @DeleteMapping("/{threadId}")
    public void deleteThread(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable String threadId) {
        threadService.deleteThread(userId, threadId);
    }

    @PostMapping("/{threadId}/messages")
    public ChatMessageResponse addMessage(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable String threadId,
            @RequestBody ChatMessageRequest request) {
        return threadService.addMessage(userId, threadId, request);
    }
}

