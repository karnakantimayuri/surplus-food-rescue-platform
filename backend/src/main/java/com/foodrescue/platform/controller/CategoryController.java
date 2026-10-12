package com.foodrescue.platform.controller;

import com.foodrescue.platform.dto.request.CategoryRequest;
import com.foodrescue.platform.dto.response.ApiResponse;
import com.foodrescue.platform.dto.response.FoodCategoryResponse;
import com.foodrescue.platform.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllCategories() {
        List<FoodCategoryResponse> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.ok("Categories retrieved", categories));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse> getActiveCategories() {
        List<FoodCategoryResponse> categories = categoryService.getActiveCategories();
        return ResponseEntity.ok(ApiResponse.ok("Active categories retrieved", categories));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getCategoryById(@PathVariable Long id) {
        FoodCategoryResponse category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(ApiResponse.ok("Category retrieved", category));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> createCategory(@Valid @RequestBody CategoryRequest request) {
        FoodCategoryResponse category = categoryService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Category created successfully", category));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryRequest request) {
        FoodCategoryResponse category = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Category updated successfully", category));
    }
}
