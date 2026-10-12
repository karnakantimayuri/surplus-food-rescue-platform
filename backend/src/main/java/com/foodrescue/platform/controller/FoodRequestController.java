package com.foodrescue.platform.controller;

import com.foodrescue.platform.dto.request.FoodRequestActionRequest;
import com.foodrescue.platform.dto.request.FoodRequestCreateRequest;
import com.foodrescue.platform.dto.response.ApiResponse;
import com.foodrescue.platform.dto.response.FoodRequestResponse;
import com.foodrescue.platform.security.UserPrincipal;
import com.foodrescue.platform.service.FoodRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class FoodRequestController {

    private final FoodRequestService requestService;

    public FoodRequestController(FoodRequestService requestService) {
        this.requestService = requestService;
    }

    @PostMapping
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<ApiResponse> createRequest(@AuthenticationPrincipal UserPrincipal principal,
                                                     @Valid @RequestBody FoodRequestCreateRequest requestDto) {
        FoodRequestResponse response = requestService.createRequest(principal.getId(), requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Food request submitted successfully", response));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<ApiResponse> getMyRequests(@AuthenticationPrincipal UserPrincipal principal) {
        List<FoodRequestResponse> list = requestService.getNgoRequests(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("NGO requests retrieved", list));
    }

    @GetMapping("/donor")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<ApiResponse> getDonorRequests(@AuthenticationPrincipal UserPrincipal principal) {
        List<FoodRequestResponse> list = requestService.getDonorRequests(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Donor requests retrieved", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getRequestById(@PathVariable Long id) {
        FoodRequestResponse response = requestService.getRequestById(id);
        return ResponseEntity.ok(ApiResponse.ok("Request retrieved", response));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<ApiResponse> approveRequest(@AuthenticationPrincipal UserPrincipal principal,
                                                      @PathVariable Long id,
                                                      @RequestBody(required = false) FoodRequestActionRequest actionRequest) {
        FoodRequestResponse response = requestService.approveRequest(principal.getId(), id, actionRequest);
        return ResponseEntity.ok(ApiResponse.ok("Request approved successfully", response));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<ApiResponse> rejectRequest(@AuthenticationPrincipal UserPrincipal principal,
                                                     @PathVariable Long id,
                                                     @RequestBody(required = false) FoodRequestActionRequest actionRequest) {
        FoodRequestResponse response = requestService.rejectRequest(principal.getId(), id, actionRequest);
        return ResponseEntity.ok(ApiResponse.ok("Request rejected", response));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<ApiResponse> cancelRequest(@AuthenticationPrincipal UserPrincipal principal,
                                                     @PathVariable Long id) {
        FoodRequestResponse response = requestService.cancelRequest(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Request cancelled successfully", response));
    }
}
