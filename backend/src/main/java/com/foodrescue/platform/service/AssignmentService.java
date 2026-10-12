package com.foodrescue.platform.service;

import com.foodrescue.platform.dto.request.AssignmentCreateRequest;
import com.foodrescue.platform.dto.request.AssignmentStatusUpdateRequest;
import com.foodrescue.platform.dto.response.PickupAssignmentResponse;
import com.foodrescue.platform.entity.*;
import com.foodrescue.platform.enums.*;
import com.foodrescue.platform.exception.BadRequestException;
import com.foodrescue.platform.exception.ResourceNotFoundException;
import com.foodrescue.platform.exception.UnauthorizedException;
import com.foodrescue.platform.mapper.EntityMapper;
import com.foodrescue.platform.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssignmentService {

    private final PickupAssignmentRepository assignmentRepository;
    private final FoodRequestRepository requestRepository;
    private final VolunteerProfileRepository volunteerProfileRepository;
    private final FoodDonationRepository donationRepository;
    private final DonorProfileRepository donorProfileRepository;
    private final NotificationService notificationService;
    private final EntityMapper entityMapper;

    public AssignmentService(PickupAssignmentRepository assignmentRepository,
                             FoodRequestRepository requestRepository,
                             VolunteerProfileRepository volunteerProfileRepository,
                             FoodDonationRepository donationRepository,
                             DonorProfileRepository donorProfileRepository,
                             NotificationService notificationService,
                             EntityMapper entityMapper) {
        this.assignmentRepository = assignmentRepository;
        this.requestRepository = requestRepository;
        this.volunteerProfileRepository = volunteerProfileRepository;
        this.donationRepository = donationRepository;
        this.donorProfileRepository = donorProfileRepository;
        this.notificationService = notificationService;
        this.entityMapper = entityMapper;
    }

    @Transactional
    public PickupAssignmentResponse assignVolunteer(AssignmentCreateRequest requestDto) {
        FoodRequest foodRequest = requestRepository.findById(requestDto.getFoodRequestId())
                .orElseThrow(() -> new ResourceNotFoundException("Food request not found: " + requestDto.getFoodRequestId()));

        if (foodRequest.getStatus() != RequestStatus.APPROVED) {
            throw new BadRequestException("Only APPROVED requests can be assigned to a volunteer. Current status: " + foodRequest.getStatus());
        }

        if (assignmentRepository.existsByFoodRequestId(foodRequest.getId())) {
            throw new BadRequestException("This request already has an active volunteer assignment");
        }

        VolunteerProfile volunteer = volunteerProfileRepository.findById(requestDto.getVolunteerId())
                .orElseThrow(() -> new ResourceNotFoundException("Volunteer not found: " + requestDto.getVolunteerId()));

        if (volunteer.getAvailability() == VolunteerAvailability.OFFLINE) {
            throw new BadRequestException("Selected volunteer is currently offline");
        }

        PickupAssignment assignment = new PickupAssignment(foodRequest, volunteer);
        assignment = assignmentRepository.save(assignment);

        foodRequest.setStatus(RequestStatus.ASSIGNED);
        foodRequest.setPickupAssignment(assignment);
        requestRepository.save(foodRequest);

        // Notify volunteer
        notificationService.createNotification(
                volunteer.getUser(),
                "New Pickup Assignment",
                "You have been assigned to collect '" + foodRequest.getDonation().getFoodName() +
                        "' from " + foodRequest.getDonation().getPickupAddress() + ".",
                NotificationType.ASSIGNMENT_CREATED,
                "ASSIGNMENT",
                assignment.getId()
        );

        // Notify NGO
        notificationService.createNotification(
                foodRequest.getOrganization().getUser(),
                "Volunteer Assigned to Your Request",
                volunteer.getUser().getFullName() + " has been assigned to pick up your approved food donation.",
                NotificationType.ASSIGNMENT_CREATED,
                "ASSIGNMENT",
                assignment.getId()
        );

        return entityMapper.toPickupAssignmentResponse(assignment);
    }

    @Transactional
    public PickupAssignmentResponse updateAssignmentStatus(Long userId, Long assignmentId, AssignmentStatusUpdateRequest updateDto) {
        PickupAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + assignmentId));

        if (!assignment.getVolunteer().getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to update this assignment");
        }

        String action = updateDto.getAction() != null ? updateDto.getAction().toUpperCase().trim() : "";
        FoodRequest foodRequest = assignment.getFoodRequest();
        FoodDonation donation = foodRequest.getDonation();

        switch (action) {
            case "ACCEPT" -> {
                if (assignment.getPickupStatus() != PickupStatus.PENDING) {
                    throw new BadRequestException("Assignment cannot be accepted from state: " + assignment.getPickupStatus());
                }
                assignment.setPickupStatus(PickupStatus.ACCEPTED);
            }
            case "COLLECT" -> {
                if (assignment.getPickupStatus() != PickupStatus.ACCEPTED && assignment.getPickupStatus() != PickupStatus.PENDING) {
                    throw new BadRequestException("Food can only be collected after task is accepted");
                }
                assignment.setPickupStatus(PickupStatus.COLLECTED);
                assignment.setDeliveryStatus(DeliveryStatus.IN_TRANSIT);
                assignment.setPickupTime(LocalDateTime.now());
                if (updateDto.getNotes() != null) {
                    assignment.setPickupNotes(updateDto.getNotes());
                }

                foodRequest.setStatus(RequestStatus.IN_PROGRESS);
                donation.setStatus(DonationStatus.IN_PROGRESS);
                requestRepository.save(foodRequest);
                donationRepository.save(donation);

                // Notify NGO and Donor
                notificationService.createNotification(
                        foodRequest.getOrganization().getUser(),
                        "Food Collected and In Transit",
                        "Volunteer " + assignment.getVolunteer().getUser().getFullName() +
                                " has collected the food and is en route for delivery.",
                        NotificationType.FOOD_COLLECTED,
                        "ASSIGNMENT",
                        assignment.getId()
                );
                notificationService.createNotification(
                        donation.getDonor().getUser(),
                        "Food Picked Up by Volunteer",
                        "Your food donation '" + donation.getFoodName() + "' was collected by volunteer " +
                                assignment.getVolunteer().getUser().getFullName() + ".",
                        NotificationType.FOOD_COLLECTED,
                        "ASSIGNMENT",
                        assignment.getId()
                );
            }
            case "DELIVER" -> {
                if (assignment.getPickupStatus() != PickupStatus.COLLECTED) {
                    throw new BadRequestException("Cannot deliver food that has not yet been collected!");
                }
                assignment.setDeliveryStatus(DeliveryStatus.DELIVERED);
                assignment.setPickupStatus(PickupStatus.DELIVERED);
                assignment.setDeliveryTime(LocalDateTime.now());
                assignment.setCompletedAt(LocalDateTime.now());
                if (updateDto.getNotes() != null) {
                    assignment.setDeliveryNotes(updateDto.getNotes());
                }

                foodRequest.setStatus(RequestStatus.COMPLETED);
                requestRepository.save(foodRequest);

                // If no remaining quantity on donation, mark donation COMPLETED
                if (donation.getRemainingQuantity().compareTo(BigDecimal.ZERO) == 0) {
                    donation.setStatus(DonationStatus.COMPLETED);
                    donationRepository.save(donation);
                }

                // Notify NGO and Donor
                notificationService.createNotification(
                        foodRequest.getOrganization().getUser(),
                        "Food Delivered Successfully!",
                        "Your requested food donation '" + donation.getFoodName() + "' has been successfully delivered.",
                        NotificationType.FOOD_DELIVERED,
                        "ASSIGNMENT",
                        assignment.getId()
                );
                notificationService.createNotification(
                        donation.getDonor().getUser(),
                        "Donation Successfully Delivered!",
                        "Your food donation '" + donation.getFoodName() + "' was safely delivered to " +
                                foodRequest.getOrganization().getOrganizationName() + ".",
                        NotificationType.FOOD_DELIVERED,
                        "ASSIGNMENT",
                        assignment.getId()
                );
            }
            default -> throw new BadRequestException("Invalid action: '" + action + "'. Valid actions: ACCEPT, COLLECT, DELIVER");
        }

        assignment = assignmentRepository.save(assignment);
        return entityMapper.toPickupAssignmentResponse(assignment);
    }

    @Transactional(readOnly = true)
    public List<PickupAssignmentResponse> getVolunteerAssignments(Long userId) {
        VolunteerProfile volunteer = volunteerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Volunteer profile not found for user: " + userId));
        return assignmentRepository.findByVolunteerIdOrderByCreatedAtDesc(volunteer.getId()).stream()
                .map(entityMapper::toPickupAssignmentResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PickupAssignmentResponse> getAllAssignments() {
        return assignmentRepository.findAll().stream()
                .map(entityMapper::toPickupAssignmentResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PickupAssignmentResponse getAssignmentById(Long id) {
        PickupAssignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));
        return entityMapper.toPickupAssignmentResponse(assignment);
    }

    @Transactional(readOnly = true)
    public List<PickupAssignmentResponse> getDonorAssignments(Long userId) {
        DonorProfile donor = donorProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Donor profile not found for user: " + userId));
        return assignmentRepository.findByDonorId(donor.getId()).stream()
                .map(entityMapper::toPickupAssignmentResponse)
                .collect(Collectors.toList());
    }
}
