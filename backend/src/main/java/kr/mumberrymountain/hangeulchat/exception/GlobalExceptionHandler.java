package kr.mumberrymountain.hangeulchat.exception;

import org.springframework.ai.retry.NonTransientAiException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final int INVALID_API_KEY_STATUS = 510;

    @ExceptionHandler(InvalidApiKeyException.class)
    public ResponseEntity<ErrorResponse> handleInvalidApiKeyException(InvalidApiKeyException e) {
        return ResponseEntity
                .status(INVALID_API_KEY_STATUS)
                .body(new ErrorResponse(INVALID_API_KEY_STATUS, e.getMessage()));
    }

    @ExceptionHandler(WebClientResponseException.Unauthorized.class)
    public ResponseEntity<ErrorResponse> handleUnauthorizedException(WebClientResponseException.Unauthorized e) {
        return ResponseEntity
                .status(INVALID_API_KEY_STATUS)
                .body(new ErrorResponse(INVALID_API_KEY_STATUS, "유효하지 않은 API Key입니다."));
    }

    @ExceptionHandler(NonTransientAiException.class)
    public ResponseEntity<ErrorResponse> handleNonTransientAiException(NonTransientAiException e) {
        if (e.getMessage() != null && (e.getMessage().contains("invalid_api_key") || e.getMessage().contains("401"))) {
            return ResponseEntity
                    .status(INVALID_API_KEY_STATUS)
                    .body(new ErrorResponse(INVALID_API_KEY_STATUS, "유효하지 않은 API Key입니다."));
        }

        // 기타 AI 관련 에러
        return ResponseEntity
                .status(500)
                .body(new ErrorResponse(500, "AI 서비스 오류가 발생했습니다."));
    }

    public record ErrorResponse(int status, String message) {}
}

