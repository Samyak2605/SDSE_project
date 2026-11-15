package com.sdse.platform.repository;

import com.sdse.platform.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProviderIdOrderByCreatedAtDesc(Long providerId);
    Optional<Review> findByBookingId(Long bookingId);
    boolean existsByBookingId(Long bookingId);
}
