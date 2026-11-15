package com.sdse.platform.dto;

public class AuthResponse {
    private String token;
    private Long id;
    private String email;
    private String fullName;
    private String role;
    private String city;

    public AuthResponse() {}

    public AuthResponse(String token, Long id, String email, String fullName, String role, String city) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.city = city;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
}
