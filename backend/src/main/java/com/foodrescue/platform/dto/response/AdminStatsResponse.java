package com.foodrescue.platform.dto.response;

import java.math.BigDecimal;

public class AdminStatsResponse {

    private long totalUsers;
    private long totalDonors;
    private long totalNgos;
    private long totalVolunteers;
    private long pendingDonorVerifications;
    private long pendingNgoVerifications;
    private long pendingVolunteerVerifications;
    private long totalDonations;
    private long activeDonations;
    private long completedDonations;
    private long totalRequests;
    private long pendingRequests;
    private long approvedRequests;
    private long totalAssignments;
    private long activeAssignments;
    private long completedDeliveries;
    private BigDecimal totalFoodDonated;
    private BigDecimal totalFoodRescued;

    public AdminStatsResponse() {}

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalDonors() {
        return totalDonors;
    }

    public void setTotalDonors(long totalDonors) {
        this.totalDonors = totalDonors;
    }

    public long getTotalNgos() {
        return totalNgos;
    }

    public void setTotalNgos(long totalNgos) {
        this.totalNgos = totalNgos;
    }

    public long getTotalVolunteers() {
        return totalVolunteers;
    }

    public void setTotalVolunteers(long totalVolunteers) {
        this.totalVolunteers = totalVolunteers;
    }

    public long getPendingDonorVerifications() {
        return pendingDonorVerifications;
    }

    public void setPendingDonorVerifications(long pendingDonorVerifications) {
        this.pendingDonorVerifications = pendingDonorVerifications;
    }

    public long getPendingNgoVerifications() {
        return pendingNgoVerifications;
    }

    public void setPendingNgoVerifications(long pendingNgoVerifications) {
        this.pendingNgoVerifications = pendingNgoVerifications;
    }

    public long getPendingVolunteerVerifications() {
        return pendingVolunteerVerifications;
    }

    public void setPendingVolunteerVerifications(long pendingVolunteerVerifications) {
        this.pendingVolunteerVerifications = pendingVolunteerVerifications;
    }

    public long getTotalDonations() {
        return totalDonations;
    }

    public void setTotalDonations(long totalDonations) {
        this.totalDonations = totalDonations;
    }

    public long getActiveDonations() {
        return activeDonations;
    }

    public void setActiveDonations(long activeDonations) {
        this.activeDonations = activeDonations;
    }

    public long getCompletedDonations() {
        return completedDonations;
    }

    public void setCompletedDonations(long completedDonations) {
        this.completedDonations = completedDonations;
    }

    public long getTotalRequests() {
        return totalRequests;
    }

    public void setTotalRequests(long totalRequests) {
        this.totalRequests = totalRequests;
    }

    public long getPendingRequests() {
        return pendingRequests;
    }

    public void setPendingRequests(long pendingRequests) {
        this.pendingRequests = pendingRequests;
    }

    public long getApprovedRequests() {
        return approvedRequests;
    }

    public void setApprovedRequests(long approvedRequests) {
        this.approvedRequests = approvedRequests;
    }

    public long getTotalAssignments() {
        return totalAssignments;
    }

    public void setTotalAssignments(long totalAssignments) {
        this.totalAssignments = totalAssignments;
    }

    public long getActiveAssignments() {
        return activeAssignments;
    }

    public void setActiveAssignments(long activeAssignments) {
        this.activeAssignments = activeAssignments;
    }

    public long getCompletedDeliveries() {
        return completedDeliveries;
    }

    public void setCompletedDeliveries(long completedDeliveries) {
        this.completedDeliveries = completedDeliveries;
    }

    public BigDecimal getTotalFoodDonated() {
        return totalFoodDonated;
    }

    public void setTotalFoodDonated(BigDecimal totalFoodDonated) {
        this.totalFoodDonated = totalFoodDonated;
    }

    public BigDecimal getTotalFoodRescued() {
        return totalFoodRescued;
    }

    public void setTotalFoodRescued(BigDecimal totalFoodRescued) {
        this.totalFoodRescued = totalFoodRescued;
    }
}
