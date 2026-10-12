package com.foodrescue.platform.repository;

import com.foodrescue.platform.entity.FoodRequest;
import com.foodrescue.platform.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodRequestRepository extends JpaRepository<FoodRequest, Long> {

    List<FoodRequest> findByDonationIdOrderByCreatedAtDesc(Long donationId);

    List<FoodRequest> findByOrganizationIdOrderByCreatedAtDesc(Long organizationId);

    @Query("SELECT r FROM FoodRequest r WHERE r.donation.donor.id = :donorId ORDER BY r.createdAt DESC")
    List<FoodRequest> findByDonorIdOrderByCreatedAtDesc(@Param("donorId") Long donorId);

    List<FoodRequest> findByStatus(RequestStatus status);

    long countByStatus(RequestStatus status);

    boolean existsByDonationIdAndOrganizationIdAndStatusIn(Long donationId, Long organizationId, List<RequestStatus> statuses);
}
