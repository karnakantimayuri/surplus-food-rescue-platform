package com.foodrescue.platform.entity;

import com.foodrescue.platform.enums.VerificationStatus;
import com.foodrescue.platform.enums.VolunteerAvailability;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "volunteer_profiles")
public class VolunteerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "service_area", length = 100)
    private String serviceArea;

    @Enumerated(EnumType.STRING)
    @Column(name = "availability", nullable = false, length = 20)
    private VolunteerAvailability availability = VolunteerAvailability.AVAILABLE;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", nullable = false, length = 20)
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "volunteer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PickupAssignment> assignments = new ArrayList<>();

    public VolunteerProfile() {}

    public VolunteerProfile(User user, String city, String serviceArea, VolunteerAvailability availability) {
        this.user = user;
        this.city = city;
        this.serviceArea = serviceArea;
        this.availability = availability != null ? availability : VolunteerAvailability.AVAILABLE;
        this.verificationStatus = VerificationStatus.PENDING;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<PickupAssignment> getAssignments() {
        return assignments;
    }

    public void setAssignments(List<PickupAssignment> assignments) {
        this.assignments = assignments;
    }
}
