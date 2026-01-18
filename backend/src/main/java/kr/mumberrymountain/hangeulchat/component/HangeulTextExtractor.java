package kr.mumberrymountain.hangeulchat.component;

import org.springframework.stereotype.Component;

import java.io.File;

@Component
public interface HangeulTextExtractor {
    public String extract(File file) throws Exception;
}
