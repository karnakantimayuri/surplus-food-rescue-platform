package com.foodrescue.platform.repository;

import com.foodrescue.platform.entity.User;
import com.foodrescue.platform.entity.VolunteerProfile;
import com.foodrescue.platform.enums.VerificationStatus;
import com.foodrescue.platform.enums.VolunteerAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VolunteerProfileRepository extends JpaRepository<VolunteerProfile, Long> {
    Optional<VolunteerProfile> findByUser(User user);
    Optional<VolunteerProfile> findByUserId(Long userId);
    List<VolunteerProfile> findByAvailability(VolunteerAvailability availability);
    List<VolunteerProfile> findByVerificationStatus(VerificationStatus status);
    List<VolunteerProfile> findByCityIgnoreCase(String city);
    long countByAvailability(VolunteerAvailability availability);
    long countByVerificationStatus(VerificationStatus status);
}
