package kr.mumberrymountain.hangeulchat.repository;

import kr.mumberrymountain.hangeulchat.entity.ChatMessage;
import kr.mumberrymountain.hangeulchat.entity.Thread;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, String> {
    List<ChatMessage> findByThreadOrderByTimestampAsc(Thread thread);
}

