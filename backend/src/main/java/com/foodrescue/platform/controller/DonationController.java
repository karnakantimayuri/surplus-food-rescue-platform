package com.foodrescue.platform.controller;

import com.foodrescue.platform.dto.request.FoodDonationRequest;
import com.foodrescue.platform.dto.response.ApiResponse;
import com.foodrescue.platform.dto.response.FoodDonationResponse;
import com.foodrescue.platform.enums.DonationStatus;
import com.foodrescue.platform.security.UserPrincipal;
import com.foodrescue.platform.service.DonationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    private final DonationService donationService;

    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse> searchDonations(
            @RequestParam(required = false) DonationStatus status,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Boolean vegetarian,
            @RequestParam(required = false) String search) {
        List<FoodDonationResponse> list = donationService.searchDonations(status, categoryId, city, vegetarian, search);
        return ResponseEntity.ok(ApiResponse.ok("Donations retrieved", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getDonationById(@PathVariable Long id) {
        FoodDonationResponse donation = donationService.getDonationById(id);
        return ResponseEntity.ok(ApiResponse.ok("Donation details retrieved", donation));
    }

    @PostMapping
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<ApiResponse> createDonation(@AuthenticationPrincipal UserPrincipal principal,
                                                      @Valid @RequestBody FoodDonationRequest request) {
        FoodDonationResponse donation = donationService.createDonation(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Donation listed successfully", donation));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<ApiResponse> updateDonation(@AuthenticationPrincipal UserPrincipal principal,
                                                      @PathVariable Long id,
                                                      @Valid @RequestBody FoodDonationRequest request) {
        FoodDonationResponse donation = donationService.updateDonation(principal.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.ok("Donation updated successfully", donation));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<ApiResponse> cancelDonation(@AuthenticationPrincipal UserPrincipal principal,
                                                      @PathVariable Long id) {
        FoodDonationResponse donation = donationService.cancelDonation(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Donation cancelled successfully", donation));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<ApiResponse> getMyDonations(@AuthenticationPrincipal UserPrincipal principal) {
        List<FoodDonationResponse> list = donationService.getDonorDonations(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("My donations retrieved", list));
    }
}
