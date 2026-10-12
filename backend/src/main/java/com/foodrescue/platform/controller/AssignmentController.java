package com.foodrescue.platform.controller;

import com.foodrescue.platform.dto.request.AssignmentCreateRequest;
import com.foodrescue.platform.dto.request.AssignmentStatusUpdateRequest;
import com.foodrescue.platform.dto.response.ApiResponse;
import com.foodrescue.platform.dto.response.PickupAssignmentResponse;
import com.foodrescue.platform.dto.response.VolunteerProfileResponse;
import com.foodrescue.platform.security.UserPrincipal;
import com.foodrescue.platform.service.AdminService;
import com.foodrescue.platform.service.AssignmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;
    private final AdminService adminService;

    public AssignmentController(AssignmentService assignmentService, AdminService adminService) {
        this.assignmentService = assignmentService;
        this.adminService = adminService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('DONOR', 'NGO', 'ADMIN')")
    public ResponseEntity<ApiResponse> assignVolunteer(@Valid @RequestBody AssignmentCreateRequest requestDto) {
        PickupAssignmentResponse response = assignmentService.assignVolunteer(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Volunteer assigned successfully", response));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('VOLUNTEER')")
    public ResponseEntity<ApiResponse> getMyAssignments(@AuthenticationPrincipal UserPrincipal principal) {
        List<PickupAssignmentResponse> list = assignmentService.getVolunteerAssignments(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Volunteer assignments retrieved", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getAssignmentById(@PathVariable Long id) {
        PickupAssignmentResponse response = assignmentService.getAssignmentById(id);
        return ResponseEntity.ok(ApiResponse.ok("Assignment retrieved", response));
    }

    @PostMapping("/{id}/status")
    @PreAuthorize("hasRole('VOLUNTEER')")
    public ResponseEntity<ApiResponse> updateStatus(@AuthenticationPrincipal UserPrincipal principal,
                                                    @PathVariable Long id,
                                                    @RequestBody AssignmentStatusUpdateRequest updateDto) {
        PickupAssignmentResponse response = assignmentService.updateAssignmentStatus(principal.getId(), id, updateDto);
        return ResponseEntity.ok(ApiResponse.ok("Assignment status updated successfully", response));
    }

    @GetMapping("/volunteers")
    public ResponseEntity<ApiResponse> getAvailableVolunteers() {
        List<VolunteerProfileResponse> list = adminService.getAllVolunteers();
        return ResponseEntity.ok(ApiResponse.ok("Available volunteers retrieved", list));
    }
}
