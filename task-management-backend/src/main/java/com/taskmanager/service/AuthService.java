package com.taskmanager.service;

import com.taskmanager.dto.AuthResponse;
import com.taskmanager.dto.LoginRequest;
import com.taskmanager.dto.RegisterRequest;
import com.taskmanager.entity.User;
import com.taskmanager.exception.BadRequestException;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Service for user authentication — registration and login.
 * Handles JWT token generation and password encryption.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    /**
     * Register a new user (Manager or Employee).
     */
    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered: " + request.getEmail());
        }

        // Create and save new user with encrypted password
        User user = User.builder()
            .name(request.getName())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(request.getRole())
            .build();

        userRepository.save(user);

        // Generate JWT token
        String token = jwtUtil.generateToken(user);

        return AuthResponse.builder()
            .token(token)
            .email(user.getEmail())
            .name(user.getName())
            .role(user.getRole())
            .userId(user.getId())
            .build();
    }

    /**
     * Authenticate existing user and return JWT token.
     */
    public AuthResponse login(LoginRequest request) {
        // Authenticate with Spring Security (throws exception if invalid)
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new BadRequestException("User not found"));

        String token = jwtUtil.generateToken(user);

        return AuthResponse.builder()
            .token(token)
            .email(user.getEmail())
            .name(user.getName())
            .role(user.getRole())
            .userId(user.getId())
            .build();
    }
}
