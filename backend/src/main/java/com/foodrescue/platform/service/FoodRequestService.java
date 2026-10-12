package com.foodrescue.platform.service;

import com.foodrescue.platform.dto.request.FoodRequestActionRequest;
import com.foodrescue.platform.dto.request.FoodRequestCreateRequest;
import com.foodrescue.platform.dto.response.FoodRequestResponse;
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
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FoodRequestService {

    private final FoodRequestRepository requestRepository;
    private final FoodDonationRepository donationRepository;
    private final OrganizationProfileRepository organizationProfileRepository;
    private final DonorProfileRepository donorProfileRepository;
    private final NotificationService notificationService;
    private final EntityMapper entityMapper;

    public FoodRequestService(FoodRequestRepository requestRepository,
                              FoodDonationRepository donationRepository,
                              OrganizationProfileRepository organizationProfileRepository,
                              DonorProfileRepository donorProfileRepository,
                              NotificationService notificationService,
                              EntityMapper entityMapper) {
        this.requestRepository = requestRepository;
        this.donationRepository = donationRepository;
        this.organizationProfileRepository = organizationProfileRepository;
        this.donorProfileRepository = donorProfileRepository;
        this.notificationService = notificationService;
        this.entityMapper = entityMapper;
    }

    @Transactional
    public FoodRequestResponse createRequest(Long userId, FoodRequestCreateRequest requestDto) {
        OrganizationProfile organization = organizationProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("You must complete your NGO profile before requesting food"));

        FoodDonation donation = donationRepository.findByIdWithLock(requestDto.getDonationId())
                .orElseThrow(() -> new ResourceNotFoundException("Food donation not found with id: " + requestDto.getDonationId()));

        if (donation.getStatus() != DonationStatus.AVAILABLE && donation.getStatus() != DonationStatus.PARTIALLY_RESERVED) {
            throw new BadRequestException("This donation is no longer available for requests (Status: " + donation.getStatus() + ")");
        }

        if (donation.getPickupDeadline().isBefore(LocalDateTime.now())) {
            donation.setStatus(DonationStatus.EXPIRED);
            donationRepository.save(donation);
            throw new BadRequestException("This food donation has expired");
        }

        if (requestDto.getRequestedQuantity().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Requested quantity must be greater than zero");
        }

        if (requestDto.getRequestedQuantity().compareTo(donation.getRemainingQuantity()) > 0) {
            throw new BadRequestException("Requested quantity (" + requestDto.getRequestedQuantity() +
                    ") exceeds remaining available quantity (" + donation.getRemainingQuantity() + " " + donation.getUnit() + ")");
        }

        boolean hasActiveRequest = requestRepository.existsByDonationIdAndOrganizationIdAndStatusIn(
                donation.getId(),
                organization.getId(),
                Arrays.asList(RequestStatus.PENDING, RequestStatus.APPROVED, RequestStatus.ASSIGNED, RequestStatus.IN_PROGRESS)
        );

        if (hasActiveRequest) {
            throw new BadRequestException("You already have an active request pending or approved for this donation");
        }

        FoodRequest foodRequest = new FoodRequest(
                donation,
                organization,
                requestDto.getRequestedQuantity(),
                requestDto.getRequestMessage()
        );
        foodRequest = requestRepository.save(foodRequest);

        // Notify donor of incoming request
        notificationService.createNotification(
                donation.getDonor().getUser(),
                "New Food Request Received",
                organization.getOrganizationName() + " has requested " + foodRequest.getRequestedQuantity() + " " +
                        donation.getUnit() + " of '" + donation.getFoodName() + "'.",
                NotificationType.REQUEST_RECEIVED,
                "FOOD_REQUEST",
                foodRequest.getId()
        );

        return entityMapper.toFoodRequestResponse(foodRequest);
    }

    @Transactional
    public FoodRequestResponse approveRequest(Long userId, Long requestId, FoodRequestActionRequest actionRequest) {
        FoodRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Food request not found with id: " + requestId));

        FoodDonation donation = donationRepository.findByIdWithLock(request.getDonation().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Food donation not found"));

        if (!donation.getDonor().getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to approve requests for this donation");
        }

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new BadRequestException("Only PENDING requests can be approved. Current status: " + request.getStatus());
        }

        if (donation.getStatus() == DonationStatus.CANCELLED || donation.getStatus() == DonationStatus.EXPIRED) {
            throw new BadRequestException("Cannot approve request for a donation that is " + donation.getStatus());
        }

        if (request.getRequestedQuantity().compareTo(donation.getRemainingQuantity()) > 0) {
            throw new BadRequestException("Insufficient remaining quantity (" + donation.getRemainingQuantity() +
                    " " + donation.getUnit() + ") to fulfill requested amount (" + request.getRequestedQuantity() + ")");
        }

        // Concurrency-safe reservation
        BigDecimal newRemaining = donation.getRemainingQuantity().subtract(request.getRequestedQuantity());
        BigDecimal newAllocated = donation.getAllocatedQuantity().add(request.getRequestedQuantity());

        donation.setRemainingQuantity(newRemaining);
        donation.setAllocatedQuantity(newAllocated);

        if (newRemaining.compareTo(BigDecimal.ZERO) == 0) {
            donation.setStatus(DonationStatus.FULLY_RESERVED);
        } else {
            donation.setStatus(DonationStatus.PARTIALLY_RESERVED);
        }
        donationRepository.save(donation);

        request.setStatus(RequestStatus.APPROVED);
        request.setApprovedAt(LocalDateTime.now());
        if (actionRequest != null && actionRequest.getDonorResponse() != null) {
            request.setDonorResponse(actionRequest.getDonorResponse());
        }
        request = requestRepository.save(request);

        // Notify requesting NGO
        notificationService.createNotification(
                request.getOrganization().getUser(),
                "Request Approved!",
                "Your request for " + request.getRequestedQuantity() + " " + donation.getUnit() +
                        " of '" + donation.getFoodName() + "' was approved by the donor.",
                NotificationType.REQUEST_APPROVED,
                "FOOD_REQUEST",
                request.getId()
        );

        return entityMapper.toFoodRequestResponse(request);
    }

    @Transactional
    public FoodRequestResponse rejectRequest(Long userId, Long requestId, FoodRequestActionRequest actionRequest) {
        FoodRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Food request not found with id: " + requestId));

        FoodDonation donation = request.getDonation();

        if (!donation.getDonor().getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to reject requests for this donation");
        }

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new BadRequestException("Only PENDING requests can be rejected");
        }

        request.setStatus(RequestStatus.REJECTED);
        if (actionRequest != null && actionRequest.getDonorResponse() != null) {
            request.setDonorResponse(actionRequest.getDonorResponse());
        }
        request = requestRepository.save(request);

        // Notify requesting NGO
        notificationService.createNotification(
                request.getOrganization().getUser(),
                "Request Rejected",
                "Your request for '" + donation.getFoodName() + "' was rejected by the donor.",
                NotificationType.REQUEST_REJECTED,
                "FOOD_REQUEST",
                request.getId()
        );

        return entityMapper.toFoodRequestResponse(request);
    }

    @Transactional
    public FoodRequestResponse cancelRequest(Long userId, Long requestId) {
        FoodRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Food request not found with id: " + requestId));

        if (!request.getOrganization().getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to cancel this request");
        }

        if (request.getStatus() == RequestStatus.COMPLETED || request.getStatus() == RequestStatus.CANCELLED || request.getStatus() == RequestStatus.REJECTED) {
            throw new BadRequestException("Request cannot be cancelled in state: " + request.getStatus());
        }

        // If request was in progress and food was collected, cannot cancel
        if (request.getPickupAssignment() != null &&
                request.getPickupAssignment().getPickupStatus() == PickupStatus.COLLECTED) {
            throw new BadRequestException("Cannot cancel request after food has already been collected by volunteer");
        }

        // If it was APPROVED, restore the reserved quantity
        if (request.getStatus() == RequestStatus.APPROVED || request.getStatus() == RequestStatus.ASSIGNED) {
            FoodDonation donation = donationRepository.findByIdWithLock(request.getDonation().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Food donation not found"));

            BigDecimal restoredRemaining = donation.getRemainingQuantity().add(request.getRequestedQuantity());
            BigDecimal restoredAllocated = donation.getAllocatedQuantity().subtract(request.getRequestedQuantity());

            donation.setRemainingQuantity(restoredRemaining);
            donation.setAllocatedQuantity(restoredAllocated.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : restoredAllocated);

            if (donation.getStatus() == DonationStatus.FULLY_RESERVED || donation.getStatus() == DonationStatus.PARTIALLY_RESERVED) {
                donation.setStatus(restoredRemaining.compareTo(donation.getQuantity()) == 0 ?
                        DonationStatus.AVAILABLE : DonationStatus.PARTIALLY_RESERVED);
            }
            donationRepository.save(donation);
        }

        request.setStatus(RequestStatus.CANCELLED);
        request.setCancelledAt(LocalDateTime.now());
        request = requestRepository.save(request);

        // Cancel pickup assignment if one existed
        if (request.getPickupAssignment() != null) {
            request.getPickupAssignment().setPickupStatus(PickupStatus.CANCELLED);
            if (request.getPickupAssignment().getVolunteer() != null &&
                    request.getPickupAssignment().getVolunteer().getUser() != null) {
                notificationService.createNotification(
                        request.getPickupAssignment().getVolunteer().getUser(),
                        "Pickup Task Cancelled",
                        "The pickup task for '" + request.getDonation().getFoodName() + "' was cancelled by the NGO.",
                        NotificationType.REQUEST_CANCELLED,
                        "FOOD_REQUEST",
                        request.getId()
                );
            }
        }

        // Notify Donor
        notificationService.createNotification(
                request.getDonation().getDonor().getUser(),
                "Request Cancelled by NGO",
                request.getOrganization().getOrganizationName() + " has cancelled their request for '" +
                        request.getDonation().getFoodName() + "'. Stock has been restored.",
                NotificationType.REQUEST_CANCELLED,
                "FOOD_REQUEST",
                request.getId()
        );

        return entityMapper.toFoodRequestResponse(request);
    }

    @Transactional(readOnly = true)
    public List<FoodRequestResponse> getNgoRequests(Long userId) {
        OrganizationProfile org = organizationProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("NGO profile not found for user: " + userId));
        return requestRepository.findByOrganizationIdOrderByCreatedAtDesc(org.getId()).stream()
                .map(entityMapper::toFoodRequestResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FoodRequestResponse> getDonorRequests(Long userId) {
        DonorProfile donor = donorProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Donor profile not found for user: " + userId));
        return requestRepository.findByDonorIdOrderByCreatedAtDesc(donor.getId()).stream()
                .map(entityMapper::toFoodRequestResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FoodRequestResponse> getAllRequests() {
        return requestRepository.findAll().stream()
                .map(entityMapper::toFoodRequestResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FoodRequestResponse getRequestById(Long id) {
        FoodRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + id));
        return entityMapper.toFoodRequestResponse(request);
    }
}
