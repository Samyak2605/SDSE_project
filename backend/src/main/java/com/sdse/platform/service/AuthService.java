package com.sdse.platform.service;

import com.sdse.platform.dto.AuthRequest;
import com.sdse.platform.dto.AuthResponse;
import com.sdse.platform.dto.RegisterRequest;
import com.sdse.platform.model.*;
import com.sdse.platform.repository.CategoryRepository;
import com.sdse.platform.repository.CustomerRepository;
import com.sdse.platform.repository.ServiceProviderRepository;
import com.sdse.platform.repository.UserRepository;
import com.sdse.platform.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ServiceProviderRepository providerRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtils jwtUtils;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered: " + request.getEmail());
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());
        User savedUser;
        String city = request.getCity();

        if ("PROVIDER".equalsIgnoreCase(request.getRole())) {
            Category category = null;
            if (request.getCategoryId() != null) {
                category = categoryRepository.findById(request.getCategoryId())
                        .orElseThrow(() -> new IllegalArgumentException("Category not found with ID: " + request.getCategoryId()));
            }

            ServiceProvider provider = new ServiceProvider(
                    request.getEmail(),
                    encodedPassword,
                    request.getFullName(),
                    request.getPhone(),
                    category,
                    request.getExperience() != null ? request.getExperience() : "1+ years",
                    request.getHourlyRate() != null ? request.getHourlyRate() : 35.0,
                    request.getCity() != null ? request.getCity() : "New York",
                    request.getBio() != null ? request.getBio() : "Experienced service professional."
            );
            savedUser = providerRepository.save(provider);
        } else {
            Customer customer = new Customer(
                    request.getEmail(),
                    encodedPassword,
                    request.getFullName(),
                    request.getPhone(),
                    request.getAddress() != null ? request.getAddress() : "",
                    request.getCity() != null ? request.getCity() : "New York"
            );
            savedUser = customerRepository.save(customer);
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        String token = jwtUtils.generateToken(userDetails, savedUser.getId(), savedUser.getRole().name());

        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFullName(),
                savedUser.getRole().name(),
                city
        );
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + request.getEmail()));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtils.generateToken(userDetails, user.getId(), user.getRole().name());

        String city = "";
        if (user instanceof Customer) {
            city = ((Customer) user).getCity();
        } else if (user instanceof ServiceProvider) {
            city = ((ServiceProvider) user).getCity();
        }

        return new AuthResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().name(),
                city
        );
    }
}
