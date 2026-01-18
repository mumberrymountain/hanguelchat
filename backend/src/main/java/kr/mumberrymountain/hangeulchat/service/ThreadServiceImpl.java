package kr.mumberrymountain.hangeulchat.service;

import kr.mumberrymountain.hangeulchat.dto.ChatMessageRequest;
import kr.mumberrymountain.hangeulchat.dto.ChatMessageResponse;
import kr.mumberrymountain.hangeulchat.dto.ThreadRequest;
import kr.mumberrymountain.hangeulchat.dto.ThreadResponse;
import kr.mumberrymountain.hangeulchat.entity.ChatMessage;
import kr.mumberrymountain.hangeulchat.entity.Thread;
import kr.mumberrymountain.hangeulchat.entity.User;
import kr.mumberrymountain.hangeulchat.repository.ChatMessageRepository;
import kr.mumberrymountain.hangeulchat.repository.ThreadRepository;
import kr.mumberrymountain.hangeulchat.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ThreadServiceImpl implements ThreadService {

    private final ThreadRepository threadRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    @Override
    @CacheEvict(value = "userThreads", key = "#userId")
    public ThreadResponse createThread(Long userId, String threadId, ThreadRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Thread thread = Thread.builder()
                .id(threadId)
                .user(user)
                .fileName(request.getFileName())
                .fileSize(request.getFileSize())
                .uploadDate(request.getUploadDate())
                .documentContent(request.getDocumentContent())
                .build();

        Thread savedThread = threadRepository.save(thread);

        return ThreadResponse.builder()
                .id(savedThread.getId())
                .fileName(savedThread.getFileName())
                .fileSize(savedThread.getFileSize())
                .uploadDate(savedThread.getUploadDate())
                .createdAt(savedThread.getCreatedAt())
                .chatMessages(List.of())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "userThreads", key = "#userId")
    public List<ThreadResponse> getUserThreads(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        List<Thread> threads = threadRepository.findByUserOrderByCreatedAtDesc(user);
        
        // chatMessages를 명시적으로 로드하기 위해 각 thread의 chatMessages 접근
        threads.forEach(thread -> thread.getChatMessages().size());

        return threads.stream()
                .map(thread -> ThreadResponse.builder()
                        .id(thread.getId())
                        .fileName(thread.getFileName())
                        .fileSize(thread.getFileSize())
                        .uploadDate(thread.getUploadDate())
                        .createdAt(thread.getCreatedAt())
                        .chatMessages(thread.getChatMessages().stream()
                                .map(msg -> ChatMessageResponse.builder()
                                        .id(msg.getId())
                                        .role(msg.getRole())
                                        .message(msg.getMessage())
                                        .timestamp(msg.getTimestamp())
                                        .build())
                                .collect(Collectors.toList()))
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "thread", key = "#threadId")
    public ThreadResponse getThread(Long userId, String threadId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Thread thread = threadRepository.findByIdAndUser(threadId, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Thread not found"));

        return ThreadResponse.builder()
                .id(thread.getId())
                .fileName(thread.getFileName())
                .fileSize(thread.getFileSize())
                .uploadDate(thread.getUploadDate())
                .createdAt(thread.getCreatedAt())
                .chatMessages(thread.getChatMessages().stream()
                        .map(msg -> ChatMessageResponse.builder()
                                .id(msg.getId())
                                .role(msg.getRole())
                                .message(msg.getMessage())
                                .timestamp(msg.getTimestamp())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "userThreads", key = "#userId"),
            @CacheEvict(value = "thread", key = "#threadId")
    })
    public ThreadResponse updateThread(Long userId, String threadId, String fileName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Thread thread = threadRepository.findByIdAndUser(threadId, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Thread not found"));

        thread.setFileName(fileName);
        Thread savedThread = threadRepository.save(thread);

        return ThreadResponse.builder()
                .id(savedThread.getId())
                .fileName(savedThread.getFileName())
                .fileSize(savedThread.getFileSize())
                .uploadDate(savedThread.getUploadDate())
                .createdAt(savedThread.getCreatedAt())
                .chatMessages(savedThread.getChatMessages().stream()
                        .map(msg -> ChatMessageResponse.builder()
                                .id(msg.getId())
                                .role(msg.getRole())
                                .message(msg.getMessage())
                                .timestamp(msg.getTimestamp())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "userThreads", key = "#userId"),
            @CacheEvict(value = "thread", key = "#threadId")
    })
    public void deleteThread(Long userId, String threadId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Thread thread = threadRepository.findByIdAndUser(threadId, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Thread not found"));

        threadRepository.delete(thread);
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "userThreads", key = "#userId"),
            @CacheEvict(value = "thread", key = "#threadId")
    })
    public ChatMessageResponse addMessage(Long userId, String threadId, ChatMessageRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Thread thread = threadRepository.findByIdAndUser(threadId, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Thread not found"));

        ChatMessage chatMessage = ChatMessage.builder()
                .id(java.util.UUID.randomUUID().toString())
                .thread(thread)
                .role(request.getRole())
                .message(request.getMessage())
                .timestamp(request.getTimestamp())
                .build();

        ChatMessage savedMessage = chatMessageRepository.save(chatMessage);

        return ChatMessageResponse.builder()
                .id(savedMessage.getId())
                .role(savedMessage.getRole())
                .message(savedMessage.getMessage())
                .timestamp(savedMessage.getTimestamp())
                .build();
    }
}

