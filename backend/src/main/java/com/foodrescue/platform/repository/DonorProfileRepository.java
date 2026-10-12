package com.foodrescue.platform.repository;

import com.foodrescue.platform.entity.DonorProfile;
import com.foodrescue.platform.entity.User;
import com.foodrescue.platform.enums.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DonorProfileRepository extends JpaRepository<DonorProfile, Long> {
    Optional<DonorProfile> findByUser(User user);
    Optional<DonorProfile> findByUserId(Long userId);
    List<DonorProfile> findByVerificationStatus(VerificationStatus status);
    long countByVerificationStatus(VerificationStatus status);
}
