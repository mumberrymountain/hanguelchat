package kr.mumberrymountain.hangeulchat.component;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
@RequiredArgsConstructor
public class SummarizeFileCache {

    private final StringRedisTemplate redisTemplate;
    private static final String CACHE_KEY_PREFIX = "file:filtered:text:";
    private static final Duration CACHE_TTL = Duration.ofDays(7);

    public String get(String fileHash) {
        return redisTemplate.opsForValue().get(CACHE_KEY_PREFIX + fileHash);
    }

    public void put(String fileHash, String filteredText) {
        redisTemplate.opsForValue().set(CACHE_KEY_PREFIX + fileHash, filteredText, CACHE_TTL);
    }
}

