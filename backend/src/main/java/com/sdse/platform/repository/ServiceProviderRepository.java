package com.sdse.platform.repository;

import com.sdse.platform.model.ServiceProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceProviderRepository extends JpaRepository<ServiceProvider, Long> {
    Optional<ServiceProvider> findByEmail(String email);
    List<ServiceProvider> findByCategoryId(Long categoryId);
    List<ServiceProvider> findByCategoryIdAndAvailableTrue(Long categoryId);
    List<ServiceProvider> findByAvailableTrue();
}
