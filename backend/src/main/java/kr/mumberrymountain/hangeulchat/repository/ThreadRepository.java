package kr.mumberrymountain.hangeulchat.repository;

import kr.mumberrymountain.hangeulchat.entity.Thread;
import kr.mumberrymountain.hangeulchat.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ThreadRepository extends JpaRepository<Thread, String> {
    List<Thread> findByUserOrderByCreatedAtDesc(User user);
    Optional<Thread> findByIdAndUser(String id, User user);
}

