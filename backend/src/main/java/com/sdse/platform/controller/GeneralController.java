package com.sdse.platform.controller;

import com.sdse.platform.dto.ApiResponse;
import com.sdse.platform.model.Booking;
import com.sdse.platform.model.Notification;
import com.sdse.platform.model.User;
import com.sdse.platform.repository.UserRepository;
import com.sdse.platform.service.BookingService;
import com.sdse.platform.service.notification.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class GeneralController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/notifications/{userId}")
    public ResponseEntity<ApiResponse<List<Notification>>> getNotifications(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success("Notifications retrieved",
                notificationService.getUserNotifications(userId)));
    }

    @PatchMapping("/notifications/{notificationId}/read")
    public ResponseEntity<ApiResponse<String>> markNotificationRead(@PathVariable Long notificationId) {
        notificationService.markAsRead(notificationId);
        return ResponseEntity.ok(ApiResponse.success("Marked as read", "OK"));
    }

    @PatchMapping("/notifications/read-all/{userId}")
    public ResponseEntity<ApiResponse<String>> markAllNotificationsRead(@PathVariable Long userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", "OK"));
    }

    @GetMapping("/admin/users")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success("Users retrieved", userRepository.findAll()));
    }

    @GetMapping("/admin/bookings")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<Booking>>> getAllBookingsAdmin() {
        return ResponseEntity.ok(ApiResponse.success("All bookings retrieved", bookingService.getAllBookings()));
    }

    @GetMapping("/admin/stats")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();
        List<Booking> bookings = bookingService.getAllBookings();
        stats.put("totalBookings", bookings.size());
        stats.put("totalUsers", userRepository.count());
        long completed = bookings.stream().filter(b -> "COMPLETED".equals(b.getStatus().name())).count();
        stats.put("completedBookings", completed);
        double totalRevenue = bookings.stream()
                .filter(b -> "COMPLETED".equals(b.getStatus().name()))
                .mapToDouble(b -> b.getTotalAmount() != null ? b.getTotalAmount() : 0.0)
                .sum();
        stats.put("totalRevenue", totalRevenue);
        return ResponseEntity.ok(ApiResponse.success("Admin stats", stats));
    }
}
