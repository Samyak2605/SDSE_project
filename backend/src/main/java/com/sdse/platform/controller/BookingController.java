package com.sdse.platform.controller;

import com.sdse.platform.dto.ApiResponse;
import com.sdse.platform.dto.BookingRequest;
import com.sdse.platform.dto.ReviewRequest;
import com.sdse.platform.dto.StatusUpdateRequest;
import com.sdse.platform.model.Booking;
import com.sdse.platform.model.Review;
import com.sdse.platform.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<Booking>> createBooking(
            @PathVariable Long customerId,
            @Valid @RequestBody BookingRequest request) {
        Booking booking = bookingService.createBooking(customerId, request);
        return ResponseEntity.ok(ApiResponse.success("Booking created successfully", booking));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<Booking>>> getCustomerBookings(@PathVariable Long customerId) {
        return ResponseEntity.ok(ApiResponse.success("Bookings retrieved", bookingService.getCustomerBookings(customerId)));
    }

    @GetMapping("/customer/{customerId}/paged")
    public ResponseEntity<ApiResponse<Page<Booking>>> getCustomerBookingsPaged(
            @PathVariable Long customerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success("Paged bookings retrieved",
                bookingService.getCustomerBookingsPaged(customerId, page, size)));
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<ApiResponse<List<Booking>>> getProviderBookings(@PathVariable Long providerId) {
        return ResponseEntity.ok(ApiResponse.success("Provider requests retrieved",
                bookingService.getProviderBookings(providerId)));
    }

    @GetMapping("/provider/{providerId}/paged")
    public ResponseEntity<ApiResponse<Page<Booking>>> getProviderBookingsPaged(
            @PathVariable Long providerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success("Paged provider requests retrieved",
                bookingService.getProviderBookingsPaged(providerId, page, size)));
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<ApiResponse<Booking>> getBookingById(@PathVariable Long bookingId) {
        return ResponseEntity.ok(ApiResponse.success("Booking retrieved", bookingService.getBookingById(bookingId)));
    }

    @PatchMapping("/{bookingId}/status")
    public ResponseEntity<ApiResponse<Booking>> updateStatus(
            @PathVariable Long bookingId,
            @RequestParam(required = false) Long userId,
            @RequestBody StatusUpdateRequest request) {
        Booking updated = bookingService.updateStatus(bookingId, userId, request);
        return ResponseEntity.ok(ApiResponse.success("Status updated", updated));
    }

    @PostMapping("/{bookingId}/cancel")
    public ResponseEntity<ApiResponse<Booking>> cancelBooking(
            @PathVariable Long bookingId,
            @RequestParam Long customerId,
            @RequestParam(required = false, defaultValue = "Cancelled by customer") String reason) {
        Booking cancelled = bookingService.cancelBooking(bookingId, customerId, reason);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled", cancelled));
    }

    @PostMapping("/reviews")
    public ResponseEntity<ApiResponse<Review>> addReview(
            @RequestParam Long customerId,
            @RequestBody ReviewRequest request) {
        Review review = bookingService.addReview(customerId, request);
        return ResponseEntity.ok(ApiResponse.success("Review submitted successfully", review));
    }
}
