package kr.mumberrymountain.hangeulchat.component.factory;

import org.springframework.ai.embedding.EmbeddingModel;

public interface EmbeddingModelFactory {
    EmbeddingModel create(String apiKey);
}

