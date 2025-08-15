package com.ecom.controllers;

import com.ecom.utils.EmailSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ContactUsController {

    @Autowired
    private EmailSender emailSender;

    @PostMapping("/contact")
    public ResponseEntity<Map<String, Object>> contactUs(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String email = payload.get("email");
        String phone = payload.get("phone");
        String message = payload.get("message");
//        System.out.println(payload);

        Map<String, Object> response = new HashMap<>();

        // HTML body for admin
        String adminHtml = "<h2>New Contact Message</h2>" +
                "<p><b>Name:</b> " + name + "</p>" +
                "<p><b>Email:</b> " + email + "</p>" +
                "<p><b>Phone:</b> " + phone + "</p>" +
                "<p><b>Message:</b> " + message + "</p>";

        emailSender.sendEmailAdmin("New Contact Message", adminHtml);

        // HTML body for user
        String userHtml = "<h2>Thank you for contacting us!</h2>" +
                "<p>Hi " + name + ",</p>" +
                "<p>Your message has been received. Our team will contact you shortly.</p>" +
                "<hr><p><b>Your Message:</b></p><p>" + message + "</p>";

        emailSender.sendEmail(email, "We Received Your Message", userHtml);

        response.put("status", "success");
        response.put("message", "Message sent successfully");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
