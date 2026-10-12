package com.foodrescue.platform.repository;

import com.foodrescue.platform.entity.FoodCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FoodCategoryRepository extends JpaRepository<FoodCategory, Long> {
    Optional<FoodCategory> findByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCase(String name);
    List<FoodCategory> findByActiveTrue();
}
