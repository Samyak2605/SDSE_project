package com.sdse.platform.service;

import com.sdse.platform.dto.BookingRequest;
import com.sdse.platform.dto.ReviewRequest;
import com.sdse.platform.dto.StatusUpdateRequest;
import com.sdse.platform.exception.BadRequestException;
import com.sdse.platform.exception.BookingConflictException;
import com.sdse.platform.exception.ResourceNotFoundException;
import com.sdse.platform.model.*;
import com.sdse.platform.repository.*;
import com.sdse.platform.service.notification.NotificationFactory;
import com.sdse.platform.service.notification.NotificationService;
import com.sdse.platform.service.pricing.PricingContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ServiceProviderRepository providerRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private NotificationFactory notificationFactory;

    @Autowired
    private PricingContext pricingContext;

    /**
     * Creates a booking with transaction isolation & concurrency double-booking prevention.
     */
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public Booking createBooking(Long customerId, BookingRequest request) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));

        ServiceProvider provider = providerRepository.findById(request.getProviderId())
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with ID: " + request.getProviderId()));

        if (!Boolean.TRUE.equals(provider.getAvailable())) {
            throw new BadRequestException("Service provider is currently marked as unavailable.");
        }

        // Concurrency Check: Prevent double-booking for the same date & timeSlot
        boolean hasConflict = bookingRepository.existsByProviderIdAndServiceDateAndTimeSlotAndStatusIn(
                provider.getId(),
                request.getServiceDate(),
                request.getTimeSlot(),
                List.of(BookingStatus.ACCEPTED, BookingStatus.IN_PROGRESS)
        );

        if (hasConflict) {
            throw new BookingConflictException("Provider already has an active booking on " +
                    request.getServiceDate() + " during slot " + request.getTimeSlot());
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElse(provider.getCategory());

        // Strategy Pattern for pricing calculation
        Double calculatedTotal = pricingContext.getStrategy("STANDARD")
                .calculatePrice(category, provider, request.getEstimatedHours() != null ? request.getEstimatedHours() : 2);

        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setProvider(provider);
        booking.setCategory(category);
        booking.setServiceAddress(request.getServiceAddress());
        booking.setServiceDate(request.getServiceDate());
        booking.setTimeSlot(request.getTimeSlot());
        booking.setIssueDescription(request.getIssueDescription());
        booking.setEstimatedHours(request.getEstimatedHours() != null ? request.getEstimatedHours() : 2);
        booking.setTotalAmount(calculatedTotal);
        booking.setStatus(BookingStatus.PENDING);

        Booking saved = bookingRepository.save(booking);

        // Factory Pattern + DIP dispatch for notification
        Notification n = notificationFactory.createBookingRequestedNotification(provider, saved);
        notificationService.sendNotification(n);

        return saved;
    }

    public List<Booking> getCustomerBookings(Long customerId) {
        return bookingRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    public Page<Booking> getCustomerBookingsPaged(Long customerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return bookingRepository.findByCustomerIdOrderByCreatedAtDesc(customerId, pageable);
    }

    public List<Booking> getProviderBookings(Long providerId) {
        return bookingRepository.findByProviderIdOrderByCreatedAtDesc(providerId);
    }

    public Page<Booking> getProviderBookingsPaged(Long providerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return bookingRepository.findByProviderIdOrderByCreatedAtDesc(providerId, pageable);
    }

    public Booking getBookingById(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));
    }

    @Transactional
    public Booking updateStatus(Long bookingId, Long userId, StatusUpdateRequest request) {
        Booking booking = getBookingById(bookingId);
        BookingStatus newStatus;
        try {
            newStatus = BookingStatus.valueOf(request.getStatus().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid booking status: " + request.getStatus());
        }

        booking.setStatus(newStatus);
        if (request.getReason() != null) {
            booking.setRejectionReason(request.getReason());
        }
        Booking updated = bookingRepository.save(booking);

        // Notify customer on status update using Factory
        Notification custNotification = notificationFactory.createStatusChangedNotification(
                booking.getCustomer(), booking, newStatus.name(), request.getReason());
        notificationService.sendNotification(custNotification);

        // If cancelled, also notify provider
        if (newStatus == BookingStatus.CANCELLED) {
            Notification provNotification = notificationFactory.createStatusChangedNotification(
                    booking.getProvider(), booking, "CANCELLED_BY_CUSTOMER", request.getReason());
            notificationService.sendNotification(provNotification);
        }

        return updated;
    }

    @Transactional
    public Booking cancelBooking(Long bookingId, Long customerId, String reason) {
        Booking booking = getBookingById(bookingId);
        if (!booking.getCustomer().getId().equals(customerId)) {
            throw new BadRequestException("Unauthorized: You do not own this booking.");
        }
        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel a completed booking.");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setRejectionReason(reason);
        Booking saved = bookingRepository.save(booking);

        Notification provNotification = notificationFactory.createStatusChangedNotification(
                booking.getProvider(), booking, "CANCELLED", reason);
        notificationService.sendNotification(provNotification);

        return saved;
    }

    @Transactional
    public Review addReview(Long customerId, ReviewRequest req) {
        Booking booking = getBookingById(req.getBookingId());

        if (!booking.getCustomer().getId().equals(customerId)) {
            throw new BadRequestException("Only the booking customer can leave a review.");
        }
        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new BadRequestException("Reviews can only be submitted for COMPLETED bookings.");
        }
        if (reviewRepository.existsByBookingId(booking.getId())) {
            throw new BadRequestException("A review has already been submitted for this booking.");
        }

        Review review = new Review(
                booking,
                booking.getCustomer(),
                booking.getProvider(),
                req.getRating(),
                req.getComment()
        );
        Review saved = reviewRepository.save(review);

        // Recalculate provider average rating
        ServiceProvider provider = booking.getProvider();
        List<Review> allReviews = reviewRepository.findByProviderIdOrderByCreatedAtDesc(provider.getId());
        double avg = allReviews.stream().mapToInt(Review::getRating).average().orElse(5.0);
        provider.setRating(Math.round(avg * 10.0) / 10.0);
        provider.setTotalReviews(allReviews.size());
        providerRepository.save(provider);

        Notification revNotification = notificationFactory.createReviewReceivedNotification(
                provider, booking.getCustomer().getFullName(), req.getRating());
        notificationService.sendNotification(revNotification);

        return saved;
    }

    public List<Review> getProviderReviews(Long providerId) {
        return reviewRepository.findByProviderIdOrderByCreatedAtDesc(providerId);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
}
