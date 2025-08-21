package com.ecom.controllers;

import com.ecom.models.Product;
import com.ecom.models.User;
import com.ecom.models.Wishlist;
import com.ecom.services.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    private ResponseEntity<Map<String, Object>> createResponse(String message, Object data, HttpStatus status) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", message);
        if (data != null) {
            response.put("data", data);
        }
        return new ResponseEntity<>(response, status);
    }

    private ResponseEntity<Map<String, Object>> createErrorResponse(String message, String error, HttpStatus status) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", message);
        response.put("error", error);
        return new ResponseEntity<>(response, status);
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Object>> ToggleWishlist(@RequestBody Map<String, Long>request, @AuthenticationPrincipal User user) {
        if(user == null){
            return createErrorResponse("User is null", "User is not defined", HttpStatus.UNAUTHORIZED);
        }

        long productId = request.get("productId");
        String result = wishlistService.toggleWishlist(user, productId);

        return createResponse(result, "Success", HttpStatus.OK);
    }

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Object>> getWishlist(@AuthenticationPrincipal User user) {
        if(user == null){
            return createErrorResponse("User is null", "User is not defined", HttpStatus.UNAUTHORIZED);
        }
        return createResponse("Success", wishlistService.getUserWishlist(user) , HttpStatus.OK);
    }
}
