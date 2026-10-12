package com.foodrescue.platform.entity;

import com.foodrescue.platform.enums.DeliveryStatus;
import com.foodrescue.platform.enums.PickupStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pickup_assignments")
public class PickupAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "food_request_id", nullable = false, unique = true)
    private FoodRequest foodRequest;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "volunteer_id", nullable = false)
    private VolunteerProfile volunteer;

    @Column(name = "pickup_time")
    private LocalDateTime pickupTime;

    @Column(name = "delivery_time")
    private LocalDateTime deliveryTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "pickup_status", nullable = false, length = 20)
    private PickupStatus pickupStatus = PickupStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "delivery_status", nullable = false, length = 20)
    private DeliveryStatus deliveryStatus = DeliveryStatus.PENDING;

    @Column(name = "pickup_notes", columnDefinition = "TEXT")
    private String pickupNotes;

    @Column(name = "delivery_notes", columnDefinition = "TEXT")
    private String deliveryNotes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public PickupAssignment() {}

    public PickupAssignment(FoodRequest foodRequest, VolunteerProfile volunteer) {
        this.foodRequest = foodRequest;
        this.volunteer = volunteer;
        this.pickupStatus = PickupStatus.PENDING;
        this.deliveryStatus = DeliveryStatus.PENDING;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.pickupStatus == null) {
            this.pickupStatus = PickupStatus.PENDING;
        }
        if (this.deliveryStatus == null) {
            this.deliveryStatus = DeliveryStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public FoodRequest getFoodRequest() {
        return foodRequest;
    }

    public void setFoodRequest(FoodRequest foodRequest) {
        this.foodRequest = foodRequest;
    }

    public VolunteerProfile getVolunteer() {
        return volunteer;
    }

    public void setVolunteer(VolunteerProfile volunteer) {
        this.volunteer = volunteer;
    }

    public LocalDateTime getPickupTime() {
        return pickupTime;
    }

    public void setPickupTime(LocalDateTime pickupTime) {
        this.pickupTime = pickupTime;
    }

    public LocalDateTime getDeliveryTime() {
        return deliveryTime;
    }

    public void setDeliveryTime(LocalDateTime deliveryTime) {
        this.deliveryTime = deliveryTime;
    }

    public PickupStatus getPickupStatus() {
        return pickupStatus;
    }

    public void setPickupStatus(PickupStatus pickupStatus) {
        this.pickupStatus = pickupStatus;
    }

    public DeliveryStatus getDeliveryStatus() {
        return deliveryStatus;
    }

    public void setDeliveryStatus(DeliveryStatus deliveryStatus) {
        this.deliveryStatus = deliveryStatus;
    }

    public String getPickupNotes() {
        return pickupNotes;
    }

    public void setPickupNotes(String pickupNotes) {
        this.pickupNotes = pickupNotes;
    }

    public String getDeliveryNotes() {
        return deliveryNotes;
    }

    public void setDeliveryNotes(String deliveryNotes) {
        this.deliveryNotes = deliveryNotes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
