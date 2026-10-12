package com.foodrescue.platform.repository;

import com.foodrescue.platform.entity.OrganizationProfile;
import com.foodrescue.platform.entity.User;
import com.foodrescue.platform.enums.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrganizationProfileRepository extends JpaRepository<OrganizationProfile, Long> {
    Optional<OrganizationProfile> findByUser(User user);
    Optional<OrganizationProfile> findByUserId(Long userId);
    List<OrganizationProfile> findByVerificationStatus(VerificationStatus status);
    long countByVerificationStatus(VerificationStatus status);
}
