package com.smarthire.pro.dto.response;

import lombok.Builder;
import lombok.Data;

/**
 * Response DTO returned after successful login containing the JWT token and user info.
 */
@Data
@Builder
public class AuthResponse {

    private String token;
    private String tokenType;
    private String email;
    private String name;
    private String role;
}
