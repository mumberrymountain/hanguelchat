package kr.mumberrymountain.hangeulchat.component.factory;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.stereotype.Component;

@Component
public class OpenAiChatClientFactory implements ChatClientFactory {

    private static final String DEFAULT_MODEL = "gpt-3.5-turbo";
    private static final double DEFAULT_TEMPERATURE = 0.7;

    @Override
    public ChatClient create(String apiKey) {
        OpenAiApi openAiApi = OpenAiApi.builder()
                .apiKey(apiKey)
                .build();

        OpenAiChatOptions options = OpenAiChatOptions.builder()
                .model(DEFAULT_MODEL)
                .temperature(DEFAULT_TEMPERATURE)
                .build();

        OpenAiChatModel chatModel = OpenAiChatModel.builder()
                .openAiApi(openAiApi)
                .defaultOptions(options)
                .build();

        return ChatClient.create(chatModel);
    }
}

