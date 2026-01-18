package kr.mumberrymountain.hangeulchat.exception;

public class InvalidApiKeyException extends RuntimeException {

    public InvalidApiKeyException() {
        super("유효하지 않은 API Key입니다.");
    }

    public InvalidApiKeyException(String message) {
        super(message);
    }

    public InvalidApiKeyException(String message, Throwable cause) {
        super(message, cause);
    }
}

