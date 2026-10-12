package com.foodrescue.platform;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootTest
class SurplusFoodRescueApplicationTests {

    @Test
    void contextLoads() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println("BCRYPT_PASSWORD_123: " + encoder.encode("Password@123"));
        System.out.println("BCRYPT_ADMIN_123: " + encoder.encode("Admin@123456"));
    }
}
