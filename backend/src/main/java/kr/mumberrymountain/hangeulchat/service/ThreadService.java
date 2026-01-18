package kr.mumberrymountain.hangeulchat.service;

import kr.mumberrymountain.hangeulchat.dto.ChatMessageRequest;
import kr.mumberrymountain.hangeulchat.dto.ChatMessageResponse;
import kr.mumberrymountain.hangeulchat.dto.ThreadRequest;
import kr.mumberrymountain.hangeulchat.dto.ThreadResponse;

import java.util.List;

public interface ThreadService {
    ThreadResponse createThread(Long userId, String threadId, ThreadRequest request);
    List<ThreadResponse> getUserThreads(Long userId);
    ThreadResponse getThread(Long userId, String threadId);
    ThreadResponse updateThread(Long userId, String threadId, String fileName);
    void deleteThread(Long userId, String threadId);
    ChatMessageResponse addMessage(Long userId, String threadId, ChatMessageRequest request);
}

