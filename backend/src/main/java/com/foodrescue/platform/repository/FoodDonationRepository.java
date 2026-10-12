package com.foodrescue.platform.repository;

import com.foodrescue.platform.entity.DonorProfile;
import com.foodrescue.platform.entity.FoodDonation;
import com.foodrescue.platform.enums.DonationStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface FoodDonationRepository extends JpaRepository<FoodDonation, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT d FROM FoodDonation d WHERE d.id = :id")
    Optional<FoodDonation> findByIdWithLock(@Param("id") Long id);

    List<FoodDonation> findByDonor(DonorProfile donor);

    List<FoodDonation> findByDonorIdOrderByCreatedAtDesc(Long donorId);

    List<FoodDonation> findByStatus(DonationStatus status);

    @Query("SELECT d FROM FoodDonation d WHERE d.status IN :statuses AND d.pickupDeadline > :now ORDER BY d.pickupDeadline ASC")
    List<FoodDonation> findAvailableDonations(@Param("statuses") List<DonationStatus> statuses, @Param("now") LocalDateTime now);

    @Query("SELECT d FROM FoodDonation d WHERE (:status IS NULL OR d.status = :status) " +
           "AND (:categoryId IS NULL OR d.category.id = :categoryId) " +
           "AND (:city IS NULL OR LOWER(d.city) = LOWER(:city)) " +
           "AND (:vegetarian IS NULL OR d.vegetarian = :vegetarian) " +
           "AND (:search IS NULL OR LOWER(d.foodName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(d.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY d.createdAt DESC")
    List<FoodDonation> searchDonations(@Param("status") DonationStatus status,
                                       @Param("categoryId") Long categoryId,
                                       @Param("city") String city,
                                       @Param("vegetarian") Boolean vegetarian,
                                       @Param("search") String search);

    long countByStatus(DonationStatus status);

    @Query("SELECT COALESCE(SUM(d.quantity), 0) FROM FoodDonation d")
    java.math.BigDecimal getTotalQuantityDonated();

    @Query("SELECT COALESCE(SUM(d.allocatedQuantity), 0) FROM FoodDonation d WHERE d.status = 'COMPLETED'")
    java.math.BigDecimal getTotalQuantityRescued();
}
