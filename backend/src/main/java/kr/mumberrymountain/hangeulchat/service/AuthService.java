package kr.mumberrymountain.hangeulchat.service;

import kr.mumberrymountain.hangeulchat.dto.AuthResponse;
import kr.mumberrymountain.hangeulchat.dto.LoginRequest;
import kr.mumberrymountain.hangeulchat.dto.SignUpRequest;

public interface AuthService {
    AuthResponse signUp(SignUpRequest request);
    AuthResponse login(LoginRequest request);
}

