package kr.mumberrymountain.hangeulchat.controller;

import kr.mumberrymountain.hangeulchat.dto.AuthResponse;
import kr.mumberrymountain.hangeulchat.dto.LoginRequest;
import kr.mumberrymountain.hangeulchat.dto.SignUpRequest;
import kr.mumberrymountain.hangeulchat.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public AuthResponse signUp(@RequestBody SignUpRequest request) {
        return authService.signUp(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}

