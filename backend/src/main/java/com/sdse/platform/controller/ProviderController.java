package com.sdse.platform.controller;

import com.sdse.platform.dto.ApiResponse;
import com.sdse.platform.dto.AvailabilityRequest;
import com.sdse.platform.model.Category;
import com.sdse.platform.model.Review;
import com.sdse.platform.model.ServiceProvider;
import com.sdse.platform.service.BookingService;
import com.sdse.platform.service.ProviderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/providers")
public class ProviderController {

    @Autowired
    private ProviderService providerService;

    @Autowired
    private BookingService bookingService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ServiceProvider>>> getAllProviders(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Boolean availableOnly) {
        List<ServiceProvider> providers = providerService.getAllProviders(categoryId, availableOnly);
        return ResponseEntity.ok(ApiResponse.success("Providers retrieved", providers));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceProvider>> getProviderById(@PathVariable Long id) {
        ServiceProvider provider = providerService.getProviderById(id);
        return ResponseEntity.ok(ApiResponse.success("Provider retrieved", provider));
    }

    @PatchMapping("/{id}/availability")
    public ResponseEntity<ApiResponse<ServiceProvider>> updateAvailability(
            @PathVariable Long id, @RequestBody AvailabilityRequest req) {
        ServiceProvider updated = providerService.updateAvailability(id, req);
        return ResponseEntity.ok(ApiResponse.success("Availability updated", updated));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceProvider>> updateProfile(
            @PathVariable Long id, @RequestBody ServiceProvider req) {
        ServiceProvider updated = providerService.updateProfile(id, req);
        return ResponseEntity.ok(ApiResponse.success("Profile updated", updated));
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<ApiResponse<List<Review>>> getProviderReviews(@PathVariable Long id) {
        List<Review> reviews = bookingService.getProviderReviews(id);
        return ResponseEntity.ok(ApiResponse.success("Reviews retrieved", reviews));
    }
}
