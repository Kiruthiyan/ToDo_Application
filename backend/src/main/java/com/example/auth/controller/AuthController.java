package com.example.auth.controller;

import com.example.auth.model.User;
import com.example.auth.model.AuthResponse;
import com.example.auth.service.UserService;
import com.example.auth.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    // ---------------- Registration ----------------
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userService.isUsernameTaken(user.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists!");
        }
        if (userService.isEmailTaken(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists!");
        }
        User savedUser = userService.registerUser(user);
        return ResponseEntity.ok(savedUser);
    }

    // ---------------- Login ----------------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        User existingUser = userService.getUserByUsername(user.getUsername());
        if (existingUser == null) {
            return ResponseEntity.status(401).body("Invalid username");
        }

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        if (!encoder.matches(user.getPassword(), existingUser.getPassword())) {
            return ResponseEntity.status(401).body("Invalid password");
        }

        // Generate JWT
        String token = jwtService.generateToken(existingUser.getUsername());
        return ResponseEntity.ok(new AuthResponse(token));
    }
}
