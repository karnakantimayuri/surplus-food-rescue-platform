package com.foodrescue.platform.controller;

import com.foodrescue.platform.dto.request.UserStatusUpdateRequest;
import com.foodrescue.platform.dto.request.VerificationActionRequest;
import com.foodrescue.platform.dto.response.*;
import com.foodrescue.platform.service.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final DonationService donationService;
    private final FoodRequestService foodRequestService;
    private final AssignmentService assignmentService;

    public AdminController(AdminService adminService,
                           DonationService donationService,
                           FoodRequestService foodRequestService,
                           AssignmentService assignmentService) {
        this.adminService = adminService;
        this.donationService = donationService;
        this.foodRequestService = foodRequestService;
        this.assignmentService = assignmentService;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse> getStats() {
        AdminStatsResponse stats = adminService.getPlatformStats();
        return ResponseEntity.ok(ApiResponse.ok("Platform statistics retrieved", stats));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse> getAllUsers() {
        List<UserResponse> users = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.ok("Users retrieved", users));
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse> updateUserStatus(@PathVariable Long id,
                                                        @RequestBody UserStatusUpdateRequest request) {
        UserResponse response = adminService.updateUserStatus(id, request.isEnabled());
        return ResponseEntity.ok(ApiResponse.ok("User status updated successfully", response));
    }

    @PostMapping("/verify/{profileType}/{id}")
    public ResponseEntity<ApiResponse> verifyProfile(@PathVariable String profileType,
                                                     @PathVariable Long id,
                                                     @Valid @RequestBody VerificationActionRequest request) {
        Object response = adminService.verifyProfile(profileType, id, request.getStatus(), request.getComment());
        return ResponseEntity.ok(ApiResponse.ok("Verification status updated successfully", response));
    }

    @GetMapping("/donors")
    public ResponseEntity<ApiResponse> getAllDonors() {
        List<DonorProfileResponse> donors = adminService.getAllDonors();
        return ResponseEntity.ok(ApiResponse.ok("Donor profiles retrieved", donors));
    }

    @GetMapping("/ngos")
    public ResponseEntity<ApiResponse> getAllNgos() {
        List<OrganizationProfileResponse> ngos = adminService.getAllNgos();
        return ResponseEntity.ok(ApiResponse.ok("NGO profiles retrieved", ngos));
    }

    @GetMapping("/volunteers")
    public ResponseEntity<ApiResponse> getAllVolunteers() {
        List<VolunteerProfileResponse> volunteers = adminService.getAllVolunteers();
        return ResponseEntity.ok(ApiResponse.ok("Volunteer profiles retrieved", volunteers));
    }

    @GetMapping("/donations")
    public ResponseEntity<ApiResponse> getAllDonations() {
        List<FoodDonationResponse> donations = donationService.getAllDonations();
        return ResponseEntity.ok(ApiResponse.ok("All donations retrieved", donations));
    }

    @GetMapping("/requests")
    public ResponseEntity<ApiResponse> getAllRequests() {
        List<FoodRequestResponse> requests = foodRequestService.getAllRequests();
        return ResponseEntity.ok(ApiResponse.ok("All requests retrieved", requests));
    }

    @GetMapping("/assignments")
    public ResponseEntity<ApiResponse> getAllAssignments() {
        List<PickupAssignmentResponse> assignments = assignmentService.getAllAssignments();
        return ResponseEntity.ok(ApiResponse.ok("All assignments retrieved", assignments));
    }
}
