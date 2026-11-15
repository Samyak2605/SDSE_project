package com.sdse.platform.service.notification;

import com.sdse.platform.model.Booking;
import com.sdse.platform.model.Notification;
import com.sdse.platform.model.User;
import org.springframework.stereotype.Component;

/**
 * Factory Pattern (Creational Pattern):
 * Encapsulates the instantiation logic of distinct notification events across the booking lifecycle.
 * Ensures consistent title, categorization, and message templating adhering to Open/Closed & Single Responsibility.
 */
@Component
public class NotificationFactory {

    public Notification createBookingRequestedNotification(User provider, Booking booking) {
        return new Notification(
                provider,
                "New Booking Request #" + booking.getId(),
                "Client " + booking.getCustomer().getFullName() + " has requested " +
                        booking.getCategory().getName() + " on " + booking.getServiceDate() + " (" + booking.getTimeSlot() + ").",
                "BOOKING_REQUESTED"
        );
    }

    public Notification createStatusChangedNotification(User recipient, Booking booking, String newStatus, String note) {
        String msg = "Your booking #" + booking.getId() + " is now " + newStatus + ".";
        if (note != null && !note.isBlank()) {
            msg += " Note: " + note;
        }
        return new Notification(
                recipient,
                "Booking Status: " + newStatus,
                msg,
                "STATUS_UPDATED"
        );
    }

    public Notification createReviewReceivedNotification(User provider, String customerName, int rating) {
        return new Notification(
                provider,
                "New Review Received ★ " + rating,
                customerName + " gave you a " + rating + "-star review for your recent service.",
                "REVIEW_RECEIVED"
        );
    }
}
