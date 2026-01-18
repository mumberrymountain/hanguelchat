package kr.mumberrymountain.hangeulchat.component.factory;

import org.springframework.ai.chat.client.ChatClient;

public interface ChatClientFactory {
    ChatClient create(String apiKey);
}

