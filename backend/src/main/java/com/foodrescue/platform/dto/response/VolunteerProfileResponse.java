package com.foodrescue.platform.dto.response;

import com.foodrescue.platform.enums.VerificationStatus;
import com.foodrescue.platform.enums.VolunteerAvailability;
import java.time.LocalDateTime;

public class VolunteerProfileResponse {

    private Long id;
    private Long userId;
    private String userFullName;
    private String userEmail;
    private String userPhone;
    private String city;
    private String serviceArea;
    private VolunteerAvailability availability;
    private VerificationStatus verificationStatus;
    private LocalDateTime createdAt;
    private int completedAssignmentsCount;
    private int activeAssignmentsCount;

    public VolunteerProfileResponse() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserFullName() {
        return userFullName;
    }

    public void setUserFullName(String userFullName) {
        this.userFullName = userFullName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserPhone() {
        return userPhone;
    }

    public void setUserPhone(String userPhone) {
        this.userPhone = userPhone;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getServiceArea() {
        return serviceArea;
    }

    public void setServiceArea(String serviceArea) {
        this.serviceArea = serviceArea;
    }

    public VolunteerAvailability getAvailability() {
        return availability;
    }

    public void setAvailability(VolunteerAvailability availability) {
        this.availability = availability;
    }

    public VerificationStatus getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(VerificationStatus verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public int getCompletedAssignmentsCount() {
        return completedAssignmentsCount;
    }

    public void setCompletedAssignmentsCount(int completedAssignmentsCount) {
        this.completedAssignmentsCount = completedAssignmentsCount;
    }

    public int getActiveAssignmentsCount() {
        return activeAssignmentsCount;
    }

    public void setActiveAssignmentsCount(int activeAssignmentsCount) {
        this.activeAssignmentsCount = activeAssignmentsCount;
    }
}
