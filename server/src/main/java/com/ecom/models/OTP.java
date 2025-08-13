package com.ecom.models;

import java.time.LocalDateTime;

public class OTP {
    private String otp;
    private LocalDateTime expiryTime;

    public OTP(String otp, LocalDateTime expiryTime) {
        this.otp = otp;
        this.expiryTime = expiryTime;
    }

    public String getOtp() {
        return otp;
    }

    public LocalDateTime getExpiryTime() {
        return expiryTime;
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiryTime);
    }
}