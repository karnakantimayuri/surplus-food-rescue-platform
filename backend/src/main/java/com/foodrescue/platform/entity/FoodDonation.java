package com.foodrescue.platform.entity;

import com.foodrescue.platform.enums.DonationStatus;
import com.foodrescue.platform.enums.FoodUnit;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "food_donations")
public class FoodDonation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donor_id", nullable = false)
    private DonorProfile donor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private FoodCategory category;

    @Column(name = "food_name", nullable = false, length = 150)
    private String foodName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "quantity", nullable = false, precision = 10, scale = 2)
    private BigDecimal quantity;

    @Column(name = "allocated_quantity", nullable = false, precision = 10, scale = 2)
    private BigDecimal allocatedQuantity = BigDecimal.ZERO;

    @Column(name = "remaining_quantity", nullable = false, precision = 10, scale = 2)
    private BigDecimal remainingQuantity;

    @Enumerated(EnumType.STRING)
    @Column(name = "unit", nullable = false, length = 20)
    private FoodUnit unit;

    @Column(name = "prepared_at")
    private LocalDateTime preparedAt;

    @Column(name = "pickup_deadline", nullable = false)
    private LocalDateTime pickupDeadline;

    @Column(name = "pickup_address", nullable = false, length = 255)
    private String pickupAddress;

    @Column(name = "city", nullable = false, length = 100)
    private String city;

    @Column(name = "area", length = 100)
    private String area;

    @Column(name = "special_information", columnDefinition = "TEXT")
    private String specialInformation;

    @Column(name = "vegetarian", nullable = false)
    private boolean vegetarian = false;

    @Column(name = "allergen_information", length = 255)
    private String allergenInformation;

    @Column(name = "storage_instructions", length = 255)
    private String storageInstructions;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private DonationStatus status = DonationStatus.AVAILABLE;

    @Version
    @Column(name = "version")
    private Long version;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "donation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<FoodRequest> requests = new ArrayList<>();

    public FoodDonation() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.allocatedQuantity == null) {
            this.allocatedQuantity = BigDecimal.ZERO;
        }
        if (this.remainingQuantity == null) {
            this.remainingQuantity = this.quantity;
        }
        if (this.status == null) {
            this.status = DonationStatus.AVAILABLE;
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

    public DonorProfile getDonor() {
        return donor;
    }

    public void setDonor(DonorProfile donor) {
        this.donor = donor;
    }

    public FoodCategory getCategory() {
        return category;
    }

    public void setCategory(FoodCategory category) {
        this.category = category;
    }

    public String getFoodName() {
        return foodName;
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getAllocatedQuantity() {
        return allocatedQuantity;
    }

    public void setAllocatedQuantity(BigDecimal allocatedQuantity) {
        this.allocatedQuantity = allocatedQuantity;
    }

    public BigDecimal getRemainingQuantity() {
        return remainingQuantity;
    }

    public void setRemainingQuantity(BigDecimal remainingQuantity) {
        this.remainingQuantity = remainingQuantity;
    }

    public FoodUnit getUnit() {
        return unit;
    }

    public void setUnit(FoodUnit unit) {
        this.unit = unit;
    }

    public LocalDateTime getPreparedAt() {
        return preparedAt;
    }

    public void setPreparedAt(LocalDateTime preparedAt) {
        this.preparedAt = preparedAt;
    }

    public LocalDateTime getPickupDeadline() {
        return pickupDeadline;
    }

    public void setPickupDeadline(LocalDateTime pickupDeadline) {
        this.pickupDeadline = pickupDeadline;
    }

    public String getPickupAddress() {
        return pickupAddress;
    }

    public void setPickupAddress(String pickupAddress) {
        this.pickupAddress = pickupAddress;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getSpecialInformation() {
        return specialInformation;
    }

    public void setSpecialInformation(String specialInformation) {
        this.specialInformation = specialInformation;
    }

    public boolean isVegetarian() {
        return vegetarian;
    }

    public void setVegetarian(boolean vegetarian) {
        this.vegetarian = vegetarian;
    }

    public String getAllergenInformation() {
        return allergenInformation;
    }

    public void setAllergenInformation(String allergenInformation) {
        this.allergenInformation = allergenInformation;
    }

    public String getStorageInstructions() {
        return storageInstructions;
    }

    public void setStorageInstructions(String storageInstructions) {
        this.storageInstructions = storageInstructions;
    }

    public DonationStatus getStatus() {
        return status;
    }

    public void setStatus(DonationStatus status) {
        this.status = status;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
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

    public List<FoodRequest> getRequests() {
        return requests;
    }

    public void setRequests(List<FoodRequest> requests) {
        this.requests = requests;
    }
}
