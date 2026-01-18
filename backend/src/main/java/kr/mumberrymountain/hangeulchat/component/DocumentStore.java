package kr.mumberrymountain.hangeulchat.component;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 스레드별 문서 내용을 메모리에 저장하는 컴포넌트
 */
@Component
public class DocumentStore {

    private final Map<String, String> documentMap = new ConcurrentHashMap<>();

    /**
     * 문서 내용 저장
     * @param threadId 스레드 ID
     * @param content 문서 내용
     */
    public void store(String threadId, String content) {
        documentMap.put(threadId, content);
    }

    /**
     * 문서 내용 조회
     * @param threadId 스레드 ID
     * @return 문서 내용 (없으면 null)
     */
    public String get(String threadId) {
        return documentMap.get(threadId);
    }

    /**
     * 문서 내용 삭제
     * @param threadId 스레드 ID
     */
    public void remove(String threadId) {
        documentMap.remove(threadId);
    }
}

