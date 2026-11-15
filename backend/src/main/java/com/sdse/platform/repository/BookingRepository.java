package com.sdse.platform.repository;

import com.sdse.platform.model.Booking;
import com.sdse.platform.model.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    Page<Booking> findByCustomerIdOrderByCreatedAtDesc(Long customerId, Pageable pageable);

    List<Booking> findByProviderIdOrderByCreatedAtDesc(Long providerId);
    Page<Booking> findByProviderIdOrderByCreatedAtDesc(Long providerId, Pageable pageable);

    List<Booking> findByProviderIdAndStatus(Long providerId, BookingStatus status);

    boolean existsByProviderIdAndServiceDateAndTimeSlotAndStatusIn(
            Long providerId, String serviceDate, String timeSlot, List<BookingStatus> statuses);
}
