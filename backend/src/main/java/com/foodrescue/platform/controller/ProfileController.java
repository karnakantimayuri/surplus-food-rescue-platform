package com.foodrescue.platform.controller;

import com.foodrescue.platform.dto.request.DonorProfileRequest;
import com.foodrescue.platform.dto.request.OrganizationProfileRequest;
import com.foodrescue.platform.dto.request.VolunteerProfileRequest;
import com.foodrescue.platform.dto.response.ApiResponse;
import com.foodrescue.platform.enums.Role;
import com.foodrescue.platform.security.UserPrincipal;
import com.foodrescue.platform.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse> getMyProfile(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal.getRole() == Role.DONOR) {
            return ResponseEntity.ok(ApiResponse.ok("Donor profile retrieved", profileService.getDonorProfile(principal.getId())));
        } else if (principal.getRole() == Role.NGO) {
            return ResponseEntity.ok(ApiResponse.ok("NGO profile retrieved", profileService.getOrganizationProfile(principal.getId())));
        } else if (principal.getRole() == Role.VOLUNTEER) {
            return ResponseEntity.ok(ApiResponse.ok("Volunteer profile retrieved", profileService.getVolunteerProfile(principal.getId())));
        }
        return ResponseEntity.ok(ApiResponse.ok("No profile associated with ADMIN role"));
    }

    @GetMapping("/donor")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<ApiResponse> getDonorProfile(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok("Donor profile retrieved", profileService.getDonorProfile(principal.getId())));
    }

    @PutMapping("/donor")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<ApiResponse> updateDonorProfile(@AuthenticationPrincipal UserPrincipal principal,
                                                          @Valid @RequestBody DonorProfileRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Donor profile updated", profileService.updateDonorProfile(principal.getId(), request)));
    }

    @GetMapping("/ngo")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<ApiResponse> getNgoProfile(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok("NGO profile retrieved", profileService.getOrganizationProfile(principal.getId())));
    }

    @PutMapping("/ngo")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<ApiResponse> updateNgoProfile(@AuthenticationPrincipal UserPrincipal principal,
                                                        @Valid @RequestBody OrganizationProfileRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("NGO profile updated", profileService.updateOrganizationProfile(principal.getId(), request)));
    }

    @GetMapping("/volunteer")
    @PreAuthorize("hasRole('VOLUNTEER')")
    public ResponseEntity<ApiResponse> getVolunteerProfile(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok("Volunteer profile retrieved", profileService.getVolunteerProfile(principal.getId())));
    }

    @PutMapping("/volunteer")
    @PreAuthorize("hasRole('VOLUNTEER')")
    public ResponseEntity<ApiResponse> updateVolunteerProfile(@AuthenticationPrincipal UserPrincipal principal,
                                                             @Valid @RequestBody VolunteerProfileRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Volunteer profile updated", profileService.updateVolunteerProfile(principal.getId(), request)));
    }
}
