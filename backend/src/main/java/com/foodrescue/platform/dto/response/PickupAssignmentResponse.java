package com.foodrescue.platform.dto.response;

import com.foodrescue.platform.enums.DeliveryStatus;
import com.foodrescue.platform.enums.FoodUnit;
import com.foodrescue.platform.enums.PickupStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PickupAssignmentResponse {

    private Long id;
    private Long foodRequestId;
    private Long donationId;
    private String foodName;
    private BigDecimal quantity;
    private FoodUnit unit;
    private String donorName;
    private String donorOrganization;
    private String pickupAddress;
    private String donorPhone;
    private String recipientOrganization;
    private String recipientAddress;
    private String recipientPhone;
    private String recipientContactPerson;
    private Long volunteerId;
    private String volunteerName;
    private String volunteerPhone;
    private LocalDateTime pickupTime;
    private LocalDateTime deliveryTime;
    private PickupStatus pickupStatus;
    private DeliveryStatus deliveryStatus;
    private String pickupNotes;
    private String deliveryNotes;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;

    public PickupAssignmentResponse() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFoodRequestId() {
        return foodRequestId;
    }

    public void setFoodRequestId(Long foodRequestId) {
        this.foodRequestId = foodRequestId;
    }

    public Long getDonationId() {
        return donationId;
    }

    public void setDonationId(Long donationId) {
        this.donationId = donationId;
    }

    public String getFoodName() {
        return foodName;
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public FoodUnit getUnit() {
        return unit;
    }

    public void setUnit(FoodUnit unit) {
        this.unit = unit;
    }

    public String getDonorName() {
        return donorName;
    }

    public void setDonorName(String donorName) {
        this.donorName = donorName;
    }

    public String getDonorOrganization() {
        return donorOrganization;
    }

    public void setDonorOrganization(String donorOrganization) {
        this.donorOrganization = donorOrganization;
    }

    public String getPickupAddress() {
        return pickupAddress;
    }

    public void setPickupAddress(String pickupAddress) {
        this.pickupAddress = pickupAddress;
    }

    public String getDonorPhone() {
        return donorPhone;
    }

    public void setDonorPhone(String donorPhone) {
        this.donorPhone = donorPhone;
    }

    public String getRecipientOrganization() {
        return recipientOrganization;
    }

    public void setRecipientOrganization(String recipientOrganization) {
        this.recipientOrganization = recipientOrganization;
    }

    public String getRecipientAddress() {
        return recipientAddress;
    }

    public void setRecipientAddress(String recipientAddress) {
        this.recipientAddress = recipientAddress;
    }

    public String getRecipientPhone() {
        return recipientPhone;
    }

    public void setRecipientPhone(String recipientPhone) {
        this.recipientPhone = recipientPhone;
    }

    public String getRecipientContactPerson() {
        return recipientContactPerson;
    }

    public void setRecipientContactPerson(String recipientContactPerson) {
        this.recipientContactPerson = recipientContactPerson;
    }

    public Long getVolunteerId() {
        return volunteerId;
    }

    public void setVolunteerId(Long volunteerId) {
        this.volunteerId = volunteerId;
    }

    public String getVolunteerName() {
        return volunteerName;
    }

    public void setVolunteerName(String volunteerName) {
        this.volunteerName = volunteerName;
    }

    public String getVolunteerPhone() {
        return volunteerPhone;
    }

    public void setVolunteerPhone(String volunteerPhone) {
        this.volunteerPhone = volunteerPhone;
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

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
