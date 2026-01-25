package kr.mumberrymountain.hangeulchat.service;

import kr.mumberrymountain.hangeulchat.component.*;
import kr.mumberrymountain.hangeulchat.dto.ChatRequest;
import kr.mumberrymountain.hangeulchat.component.factory.ChatClientFactory;
import kr.mumberrymountain.hangeulchat.util.PromptConfig;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.io.FilenameUtils;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Flux;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final FileStore fileStore;
    private final DuplicatedChunkFilter duplicatedChunkFilter;
    private final DocumentStore documentStore;
    private final ChatClientFactory chatClientFactory;
    private final SummarizeFileCache summarizeFileCache;


    @SneakyThrows
    @Override
    public Flux<String> summarizeStream(MultipartFile multipartFile, String threadId, String apiKey) {
        File file = null;

        try {
            // 파일을 먼저 저장 (해시 계산 전에 저장해야 InputStream이 소비되지 않음)
            file = fileStore.storeFile(multipartFile);

            // 저장된 파일로부터 해시 계산 (Apache Commons Codec 사용)
            String fileHash;
            try (java.io.FileInputStream fis = new java.io.FileInputStream(file)) {
                fileHash = DigestUtils.sha256Hex(fis);
            }

            // 캐시에서 조회
            String text = summarizeFileCache.get(fileHash);

            if (text == null) {
                text = extractTextFromFile(file, threadId, apiKey);
                summarizeFileCache.put(fileHash, text);
            }

            // 문서 내용을 threadId로 저장
            documentStore.store(threadId, text);

            final File finalFile = file; // 람다에서 사용하기 위해 final 변수로
            return chatClientFactory.create(apiKey)
                    .prompt()
                    .system(PromptConfig.DOCUMENT_SUMMARY_SYSTEM_PROMPT)
                    .user(PromptConfig.DOCUMENT_SUMMARY_USER_PROMPT_PREFIX + text)
                    .stream()
                    .content()
                    .doFinally(signal -> {
                        if (finalFile != null && finalFile.exists()) finalFile.delete();
                    });
        } catch (Exception e) {
            // 예외 발생 시 파일 정리
            if (file != null && file.exists()) file.delete();
            // 예외를 Flux 에러로 변환
            return Flux.error(e);
        }
    }

    @SneakyThrows
    private String extractTextFromFile(File file, String threadId, String apiKey) {
        String extension = FilenameUtils.getExtension(file.getName());
        HangeulTextExtractor hangeulTextExtractor = switch (extension) {
            case "hwpx" -> new HwpxTextExtractor();
            case "hwp" -> new HwpTextExtractor();
            default -> throw new IllegalArgumentException(extension + " is not supported");
        };

        String text = hangeulTextExtractor.extract(file);
        if (text.length() > 10000) text = duplicatedChunkFilter.filter(text, file.getName(), apiKey);
        return text;
    }

    @Override
    public Flux<String> chatStream(String threadId, String message, List<ChatRequest.ChatMessageDto> chatHistory, String apiKey) {
        return chatClientFactory.create(apiKey)
                                .prompt()
                                .system(PromptConfig.chatSystemPrompt(documentStore.get(threadId)))
                                .messages(chatUserPrompt(chatHistory, message))
                                .stream()
                                .content();
    }

    public List<Message> chatUserPrompt(List<ChatRequest.ChatMessageDto> chatHistory, String message) {
        List<Message> messages = new ArrayList<>();

        // 이전 대화 기록 추가
        if (chatHistory != null && !chatHistory.isEmpty()) {
            for (ChatRequest.ChatMessageDto chat : chatHistory) {
                switch (chat.getRole()) {
                    case "user" -> messages.add(new UserMessage(chat.getMessage()));
                    case "assistant" -> messages.add(new AssistantMessage(chat.getMessage()));
                }
            }
        }

        // 현재 메시지 추가
        messages.add(new UserMessage(message));

        return messages;
    }
}
