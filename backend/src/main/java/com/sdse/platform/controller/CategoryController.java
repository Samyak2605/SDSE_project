package com.sdse.platform.controller;

import com.sdse.platform.dto.ApiResponse;
import com.sdse.platform.dto.CategoryRequest;
import com.sdse.platform.model.Category;
import com.sdse.platform.service.ProviderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private ProviderService providerService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Category>>> getAllCategories() {
        return ResponseEntity.ok(ApiResponse.success("Categories retrieved", providerService.getAllCategories()));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Category>> createCategory(@RequestBody CategoryRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Category created", providerService.createCategory(req)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Category>> updateCategory(@PathVariable Long id, @RequestBody CategoryRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Category updated", providerService.updateCategory(id, req)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteCategory(@PathVariable Long id) {
        providerService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted", "OK"));
    }
}
