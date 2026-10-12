package com.foodrescue.platform.controller;

import com.foodrescue.platform.dto.request.LoginRequest;
import com.foodrescue.platform.dto.request.RegisterRequest;
import com.foodrescue.platform.dto.response.ApiResponse;
import com.foodrescue.platform.dto.response.AuthResponse;
import com.foodrescue.platform.dto.response.UserResponse;
import com.foodrescue.platform.security.UserPrincipal;
import com.foodrescue.platform.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse authResponse = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Registration successful", authResponse));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse authResponse = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", authResponse));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse> getCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Not authenticated"));
        }
        UserResponse userResponse = authService.getCurrentUser(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok("User retrieved", userResponse));
    }
}
