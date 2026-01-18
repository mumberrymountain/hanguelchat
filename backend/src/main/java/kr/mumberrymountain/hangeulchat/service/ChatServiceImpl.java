package kr.mumberrymountain.hangeulchat.service;

import kr.mumberrymountain.hangeulchat.component.*;
import kr.mumberrymountain.hangeulchat.dto.ChatRequest;
import kr.mumberrymountain.hangeulchat.component.factory.ChatClientFactory;
import kr.mumberrymountain.hangeulchat.util.PromptConfig;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
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
//    private final DuplicatedChunkFilter duplicatedChunkFilter;
    private final DocumentStore documentStore;
    private final ChatClientFactory chatClientFactory;
    private HangeulTextExtractor hangeulTextExtractor;

    @SneakyThrows
    @Override
    public String summarize(MultipartFile multipartFile, String threadId, String apiKey) {
        File file = null;

        try {
            file = fileStore.storeFile(multipartFile);

            switch (FilenameUtils.getExtension(file.getName())) {
                case "hwpx" -> hangeulTextExtractor = new HwpxTextExtractor();
                case "hwp" -> hangeulTextExtractor = new HwpTextExtractor();
            }

            String text = hangeulTextExtractor.extract(file);

            // 문서 내용을 threadId로 저장
            documentStore.store(threadId, text);

            return chatClientFactory.create(apiKey)
                    .prompt()
                    .system(PromptConfig.DOCUMENT_SUMMARY_SYSTEM_PROMPT)
                    .user(PromptConfig.DOCUMENT_SUMMARY_USER_PROMPT_PREFIX + text)
                    .call()
                    .content();
        } finally {
            if (file != null && file.exists()) file.delete();
        }
    }

    @SneakyThrows
    @Override
    public Flux<String> summarizeStream(MultipartFile multipartFile, String threadId, String apiKey) {
        File file = fileStore.storeFile(multipartFile);

        switch (FilenameUtils.getExtension(file.getName())) {
            case "hwpx" -> hangeulTextExtractor = new HwpxTextExtractor();
            case "hwp" -> hangeulTextExtractor = new HwpTextExtractor();
        }

        String text = hangeulTextExtractor.extract(file);

        // 문서 내용을 threadId로 저장
        documentStore.store(threadId, text);

        return chatClientFactory.create(apiKey)
                .prompt()
                .system(PromptConfig.DOCUMENT_SUMMARY_SYSTEM_PROMPT)
                .user(PromptConfig.DOCUMENT_SUMMARY_USER_PROMPT_PREFIX + text)
                .stream()
                .content()
                .doFinally(signal -> {
                    if (file.exists()) file.delete();
                });
    }

    @Override
    public String chat(String threadId, String message, List<ChatRequest.ChatMessageDto> chatHistory, String apiKey) {        // 저장된 문서 내용 조회
        return chatClientFactory.create(apiKey)
                                .prompt()
                                .system(PromptConfig.chatSystemPrompt(documentStore.get(threadId)))
                                .messages(chatUserPrompt(chatHistory, message))
                                .call()
                                .content();
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
