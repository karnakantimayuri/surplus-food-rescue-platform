package com.foodrescue.platform.service;

import com.foodrescue.platform.dto.request.CategoryRequest;
import com.foodrescue.platform.dto.response.FoodCategoryResponse;
import com.foodrescue.platform.entity.FoodCategory;
import com.foodrescue.platform.exception.BadRequestException;
import com.foodrescue.platform.exception.ResourceNotFoundException;
import com.foodrescue.platform.mapper.EntityMapper;
import com.foodrescue.platform.repository.FoodCategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final FoodCategoryRepository categoryRepository;
    private final EntityMapper entityMapper;

    public CategoryService(FoodCategoryRepository categoryRepository, EntityMapper entityMapper) {
        this.categoryRepository = categoryRepository;
        this.entityMapper = entityMapper;
    }

    @Transactional(readOnly = true)
    public List<FoodCategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(entityMapper::toFoodCategoryResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FoodCategoryResponse> getActiveCategories() {
        return categoryRepository.findByActiveTrue().stream()
                .map(entityMapper::toFoodCategoryResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FoodCategoryResponse getCategoryById(Long id) {
        FoodCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food category not found with id: " + id));
        return entityMapper.toFoodCategoryResponse(category);
    }

    @Transactional
    public FoodCategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsByNameIgnoreCase(request.getName().trim())) {
            throw new BadRequestException("Category with this name already exists");
        }
        FoodCategory category = new FoodCategory(request.getName().trim(), request.getDescription(), request.isActive());
        category = categoryRepository.save(category);
        return entityMapper.toFoodCategoryResponse(category);
    }

    @Transactional
    public FoodCategoryResponse updateCategory(Long id, CategoryRequest request) {
        FoodCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food category not found with id: " + id));

        if (!category.getName().equalsIgnoreCase(request.getName().trim()) &&
                categoryRepository.existsByNameIgnoreCase(request.getName().trim())) {
            throw new BadRequestException("Category with this name already exists");
        }

        category.setName(request.getName().trim());
        category.setDescription(request.getDescription());
        category.setActive(request.isActive());
        category = categoryRepository.save(category);
        return entityMapper.toFoodCategoryResponse(category);
    }
}
