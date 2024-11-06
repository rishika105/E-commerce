package com.ecom.controllers;

import com.ecom.models.OTP;
import com.ecom.models.Role;
import com.ecom.models.User;
import com.ecom.services.UserService;
import com.ecom.utils.EmailSender;
import com.ecom.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;
import org.mindrot.jbcrypt.BCrypt;

import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private EmailSender emailSender;

    @Autowired
    private JwtUtil jwtUtil;

    // Map to store OTPs with email as key
    private Map<String, OTP> otpStorage = new HashMap<>();

    // Step 1: Send OTP to the user's email
    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, Object>> sendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        // Validate email pattern
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        Pattern pattern = Pattern.compile(emailRegex);
        Matcher matcher = pattern.matcher(email);
        Map<String, Object> response = new HashMap<>();

        if (!matcher.matches()) {
            response.put("status", "error");
            response.put("message", "Invalid email format");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        // Check if user already exists
        if (userService.userExists(email)) {
            // Instead of returning a bad request, we send a 200 status with a different message
            response.put("status", "exists");
            response.put("message", "User already exists with this email. OTP will not be sent.");
            return ResponseEntity.badRequest().body(response);
        }

        // Generate a new OTP
        String otp = generateOtp();

        // Store OTP with expiry time (2hrs)
        otpStorage.put(email, new OTP(otp, LocalDateTime.now().plusMinutes(120)));

        // Send OTP to the email
        emailSender.sendEmail(email, "Your OTP Code", "Your OTP code is: " + otp);

        // Successful OTP sending response
        response.put("status", "success");
        response.put("message", "OTP sent to email: " + email);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    // Step 2: Register the user after verifying OTP
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerUser(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String email = request.get("email");
        String password = request.get("password");
        String confirmPassword = request.get("confirmPassword");
        String role = request.get("role");
        String otp = request.get("otp");

        Map<String, Object> response = new HashMap<>();

        // Validate passwords
        if (!password.equals(confirmPassword)) {
            response.put("status", "error");
            response.put("message", "Passwords do not match.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        // Fetch the OTP entry for the given email
        OTP otpEntry = otpStorage.get(email);

        // Check if OTP is expired or not found
        if (otpEntry == null || otpEntry.isExpired()) {
            otpStorage.remove(email); // Optionally clear expired OTP
            response.put("status", "error");
            response.put("message", "OTP has expired or is invalid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        // Validate the OTP
        if (!otpEntry.getOtp().equals(otp)) {
            response.put("status", "error");
            response.put("message", "Invalid OTP.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        // OTP is valid and not expired, proceed with user registration
        User user = new User();
        user.setEmail(email);

        // Set the plain password before hashing
        String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt());
        user.setPassword(hashedPassword);
        user.setName(name);

        // Set the role to ADMIN if specified, otherwise to USER or SELLER
        if(role != null && role.equalsIgnoreCase("ADMIN")){
            user.setRole(Role.ADMIN);
        } else if (role != null && role.equalsIgnoreCase("SELLER") ) {
            user.setRole(Role.SELLER);
        } else {
            user.setRole(Role.USER);
        }

        // Save the user
        userService.registerUser(user);

        // Clear OTP after successful registration
        otpStorage.remove(email);

        response.put("status", "success");
        response.put("message", "User registered successfully.");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    //login user
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        Optional<User> userOptional = userService.findByEmail(email);
        Map<String, Object> response = new HashMap<>();

        if (userOptional.isEmpty()) {
            response.put("status", "error");
            response.put("message", "User not registered.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        User user = userOptional.get();
        if (BCrypt.checkpw(password, user.getPassword())) {
            List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
            String token = jwtUtil.generateToken(user.getEmail(), authorities, user.getUserId());
            response.put("status", "success");
            response.put("token", token);
            response.put("role", user.getRole().toString());
            response.put("message", "Login successful.");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            response.put("status", "error");
            response.put("message", "Invalid password.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }


    // Generate a random 6-digit OTP
    private String generateOtp() {
        Random random = new Random();
        return String.valueOf(100000 + random.nextInt(900000));
    }
}
