package kr.mumberrymountain.hangeulchat.component.factory;

import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.openai.OpenAiEmbeddingModel;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class OpenAiEmbeddingModelFactory implements EmbeddingModelFactory {

    private final Map<String, EmbeddingModel> embeddingModelCache = new ConcurrentHashMap<>();

    @Override
    public EmbeddingModel create(String apiKey) {
        return embeddingModelCache.computeIfAbsent(apiKey, key -> {
            OpenAiApi openAiApi = OpenAiApi.builder()
                    .apiKey(key)
                    .build();
            
            return new OpenAiEmbeddingModel(openAiApi);
        });
    }

    public void evict(String apiKey) {
        embeddingModelCache.remove(apiKey);
    }

    public void clear() {
        embeddingModelCache.clear();
    }
}

