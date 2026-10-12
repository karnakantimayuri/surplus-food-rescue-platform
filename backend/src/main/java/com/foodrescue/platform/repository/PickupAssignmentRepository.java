package com.foodrescue.platform.repository;

import com.foodrescue.platform.entity.PickupAssignment;
import com.foodrescue.platform.enums.DeliveryStatus;
import com.foodrescue.platform.enums.PickupStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PickupAssignmentRepository extends JpaRepository<PickupAssignment, Long> {

    Optional<PickupAssignment> findByFoodRequestId(Long foodRequestId);

    List<PickupAssignment> findByVolunteerIdOrderByCreatedAtDesc(Long volunteerId);

    List<PickupAssignment> findByPickupStatus(PickupStatus pickupStatus);

    List<PickupAssignment> findByDeliveryStatus(DeliveryStatus deliveryStatus);

    boolean existsByFoodRequestId(Long foodRequestId);

    long countByDeliveryStatus(DeliveryStatus deliveryStatus);

    @Query("SELECT a FROM PickupAssignment a WHERE a.foodRequest.donation.donor.id = :donorId ORDER BY a.createdAt DESC")
    List<PickupAssignment> findByDonorId(@Param("donorId") Long donorId);

    @Query("SELECT a FROM PickupAssignment a WHERE a.foodRequest.organization.id = :orgId ORDER BY a.createdAt DESC")
    List<PickupAssignment> findByOrganizationId(@Param("orgId") Long orgId);
}
