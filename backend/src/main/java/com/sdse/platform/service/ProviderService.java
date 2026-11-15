package com.sdse.platform.service;

import com.sdse.platform.dto.CategoryRequest;
import com.sdse.platform.dto.AvailabilityRequest;
import com.sdse.platform.model.Category;
import com.sdse.platform.model.ServiceProvider;
import com.sdse.platform.repository.CategoryRepository;
import com.sdse.platform.repository.ServiceProviderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProviderService {

    @Autowired
    private ServiceProviderRepository providerRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<ServiceProvider> getAllProviders(Long categoryId, Boolean availableOnly) {
        if (categoryId != null) {
            if (Boolean.TRUE.equals(availableOnly)) {
                return providerRepository.findByCategoryIdAndAvailableTrue(categoryId);
            }
            return providerRepository.findByCategoryId(categoryId);
        }
        if (Boolean.TRUE.equals(availableOnly)) {
            return providerRepository.findByAvailableTrue();
        }
        return providerRepository.findAll();
    }

    public ServiceProvider getProviderById(Long id) {
        return providerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Provider not found with ID: " + id));
    }

    @Transactional
    public ServiceProvider updateAvailability(Long providerId, AvailabilityRequest request) {
        ServiceProvider provider = getProviderById(providerId);
        provider.setAvailable(request.getAvailable());
        return providerRepository.save(provider);
    }

    @Transactional
    public ServiceProvider updateProfile(Long providerId, ServiceProvider updatedData) {
        ServiceProvider provider = getProviderById(providerId);
        if (updatedData.getFullName() != null) provider.setFullName(updatedData.getFullName());
        if (updatedData.getPhone() != null) provider.setPhone(updatedData.getPhone());
        if (updatedData.getHourlyRate() != null) provider.setHourlyRate(updatedData.getHourlyRate());
        if (updatedData.getExperience() != null) provider.setExperience(updatedData.getExperience());
        if (updatedData.getCity() != null) provider.setCity(updatedData.getCity());
        if (updatedData.getBio() != null) provider.setBio(updatedData.getBio());
        if (updatedData.getCategory() != null && updatedData.getCategory().getId() != null) {
            Category category = categoryRepository.findById(updatedData.getCategory().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Category not found"));
            provider.setCategory(category);
        }
        return providerRepository.save(provider);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Transactional
    public Category createCategory(CategoryRequest req) {
        if (categoryRepository.existsByName(req.getName())) {
            throw new IllegalArgumentException("Category already exists: " + req.getName());
        }
        Category cat = new Category(req.getName(), req.getDescription(), req.getIcon(), req.getBasePrice());
        return categoryRepository.save(cat);
    }

    @Transactional
    public Category updateCategory(Long id, CategoryRequest req) {
        Category cat = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        cat.setName(req.getName());
        cat.setDescription(req.getDescription());
        cat.setIcon(req.getIcon());
        cat.setBasePrice(req.getBasePrice());
        return categoryRepository.save(cat);
    }

    @Transactional
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}
