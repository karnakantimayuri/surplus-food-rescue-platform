package com.foodrescue.platform.config;

import com.foodrescue.platform.entity.FoodCategory;
import com.foodrescue.platform.entity.User;
import com.foodrescue.platform.enums.Role;
import com.foodrescue.platform.repository.FoodCategoryRepository;
import com.foodrescue.platform.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final FoodCategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email:admin@foodrescue.org}")
    private String adminEmail;

    @Value("${app.admin.password:Admin@123456}")
    private String adminPassword;

    @Value("${app.admin.name:System Administrator}")
    private String adminName;

    @Value("${app.admin.phone:+1-800-555-FOOD}")
    private String adminPhone;

    public DataInitializer(UserRepository userRepository,
                           FoodCategoryRepository categoryRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        seedAdminUser();
        seedCategories();
    }

    private void seedAdminUser() {
        if (!userRepository.existsByEmail(adminEmail.toLowerCase().trim())) {
            User admin = new User(
                    adminName,
                    adminEmail.toLowerCase().trim(),
                    passwordEncoder.encode(adminPassword),
                    Role.ADMIN,
                    adminPhone
            );
            admin.setEnabled(true);
            userRepository.save(admin);
            logger.info("Default administrator account initialized: {}", adminEmail);
        } else {
            logger.info("Administrator account already exists: {}", adminEmail);
        }
    }

    private void seedCategories() {
        if (categoryRepository.count() == 0) {
            List<FoodCategory> categories = Arrays.asList(
                    new FoodCategory("Cooked Meals & Catering", "Hot or chilled prepared meals, buffets, cooked rice, curries, and casseroles.", true),
                    new FoodCategory("Bakery & Breads", "Fresh loaves, rolls, pastries, buns, and baked goods.", true),
                    new FoodCategory("Fresh Fruits & Vegetables", "Seasonal raw fresh fruits and vegetables.", true),
                    new FoodCategory("Dairy & Eggs", "Pasteurized milk, yogurt, paneer, cheese, and farm eggs.", true),
                    new FoodCategory("Packaged & Dry Groceries", "Sealed dry rations, cereals, grains, pulses, and canned items.", true),
                    new FoodCategory("Beverages & Juices", "Packaged juices, sealed water bottles, and healthy beverages.", true)
            );
            categoryRepository.saveAll(categories);
            logger.info("Seeded {} food categories", categories.size());
        }
    }
}
