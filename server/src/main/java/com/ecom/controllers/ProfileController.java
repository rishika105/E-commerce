package com.ecom.controllers;

import com.ecom.models.User;
import com.ecom.services.UserService;
import com.ecom.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // Get user profile details
    @GetMapping("/getUserDetails")
    public ResponseEntity<Map<String, Object>> getProfile(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        String email = jwtUtil.extractEmail(token);

        Optional<User> userOptional = userService.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            Map<String, Object> profileData = new HashMap<>();
            profileData.put("name", user.getName());
            profileData.put("email", user.getEmail());
            profileData.put("phone", user.getPhone());
            profileData.put("gender", user.getGender());
            profileData.put("user_id", user.getId());

            return ResponseEntity.ok(profileData);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @PutMapping("/updateUserDetails")
    public ResponseEntity<Map<String, String>> updateProfile(@RequestBody Map<String, String> profileData, HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        String email = jwtUtil.extractEmail(token);

        Optional<User> userOptional = userService.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            user.setName(profileData.get("name"));
            user.setPhone(profileData.get("phone"));
            user.setGender(profileData.get("gender"));

            if (profileData.get("email") != null && !user.getEmail().equals(profileData.get("email"))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Email change requires verification."));
            }

            if (profileData.containsKey("currentPassword") && profileData.containsKey("newPassword")) {
                if (BCrypt.checkpw(profileData.get("currentPassword"), user.getPassword())) {
                    user.setPassword(BCrypt.hashpw(profileData.get("newPassword"), BCrypt.gensalt()));
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(Map.of("message", "Invalid current password."));
                }
            }

            userService.updateUser(user);
            return ResponseEntity.ok(Map.of("message", "Profile updated successfully."));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "User not found."));
    }


    // Delete user profile
    @DeleteMapping("/deleteUser")
    public ResponseEntity<Map<String, String>> deleteUser(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        String email = jwtUtil.extractEmail(token);

        Optional<User> userOptional = userService.findByEmail(email);
        if (userOptional.isPresent()) {
            userService.deleteUser(userOptional.get());
            return ResponseEntity.ok(Map.of("message", "Profile deleted successfully."));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Could not delete profile."));
    }

}