package com.foodrescue.platform.service;

import com.foodrescue.platform.dto.response.*;
import com.foodrescue.platform.entity.*;
import com.foodrescue.platform.enums.*;
import com.foodrescue.platform.exception.BadRequestException;
import com.foodrescue.platform.exception.ResourceNotFoundException;
import com.foodrescue.platform.mapper.EntityMapper;
import com.foodrescue.platform.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final DonorProfileRepository donorProfileRepository;
    private final OrganizationProfileRepository organizationProfileRepository;
    private final VolunteerProfileRepository volunteerProfileRepository;
    private final FoodDonationRepository donationRepository;
    private final FoodRequestRepository requestRepository;
    private final PickupAssignmentRepository assignmentRepository;
    private final NotificationService notificationService;
    private final EntityMapper entityMapper;

    public AdminService(UserRepository userRepository,
                        DonorProfileRepository donorProfileRepository,
                        OrganizationProfileRepository organizationProfileRepository,
                        VolunteerProfileRepository volunteerProfileRepository,
                        FoodDonationRepository donationRepository,
                        FoodRequestRepository requestRepository,
                        PickupAssignmentRepository assignmentRepository,
                        NotificationService notificationService,
                        EntityMapper entityMapper) {
        this.userRepository = userRepository;
        this.donorProfileRepository = donorProfileRepository;
        this.organizationProfileRepository = organizationProfileRepository;
        this.volunteerProfileRepository = volunteerProfileRepository;
        this.donationRepository = donationRepository;
        this.requestRepository = requestRepository;
        this.assignmentRepository = assignmentRepository;
        this.notificationService = notificationService;
        this.entityMapper = entityMapper;
    }

    @Transactional(readOnly = true)
    public AdminStatsResponse getPlatformStats() {
        AdminStatsResponse stats = new AdminStatsResponse();
        stats.setTotalUsers(userRepository.count());
        stats.setTotalDonors(donorProfileRepository.count());
        stats.setTotalNgos(organizationProfileRepository.count());
        stats.setTotalVolunteers(volunteerProfileRepository.count());

        stats.setPendingDonorVerifications(donorProfileRepository.countByVerificationStatus(VerificationStatus.PENDING));
        stats.setPendingNgoVerifications(organizationProfileRepository.countByVerificationStatus(VerificationStatus.PENDING));
        stats.setPendingVolunteerVerifications(volunteerProfileRepository.countByVerificationStatus(VerificationStatus.PENDING));

        stats.setTotalDonations(donationRepository.count());
        stats.setActiveDonations(donationRepository.countByStatus(DonationStatus.AVAILABLE) +
                donationRepository.countByStatus(DonationStatus.PARTIALLY_RESERVED));
        stats.setCompletedDonations(donationRepository.countByStatus(DonationStatus.COMPLETED));

        stats.setTotalRequests(requestRepository.count());
        stats.setPendingRequests(requestRepository.countByStatus(RequestStatus.PENDING));
        stats.setApprovedRequests(requestRepository.countByStatus(RequestStatus.APPROVED));

        stats.setTotalAssignments(assignmentRepository.count());
        stats.setActiveAssignments(assignmentRepository.countByDeliveryStatus(DeliveryStatus.IN_TRANSIT) +
                assignmentRepository.countByDeliveryStatus(DeliveryStatus.PENDING));
        stats.setCompletedDeliveries(assignmentRepository.countByDeliveryStatus(DeliveryStatus.DELIVERED));

        BigDecimal donated = donationRepository.getTotalQuantityDonated();
        BigDecimal rescued = donationRepository.getTotalQuantityRescued();
        stats.setTotalFoodDonated(donated != null ? donated : BigDecimal.ZERO);
        stats.setTotalFoodRescued(rescued != null ? rescued : BigDecimal.ZERO);

        return stats;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(entityMapper::toUserResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponse updateUserStatus(Long userId, boolean enabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (user.getRole() == Role.ADMIN) {
            throw new BadRequestException("Cannot disable administrator accounts");
        }

        user.setEnabled(enabled);
        user = userRepository.save(user);

        notificationService.createNotification(
                user,
                enabled ? "Account Activated" : "Account Suspended",
                enabled ? "Your account has been reactivated by the administrator." : "Your account has been deactivated by the administrator.",
                NotificationType.SYSTEM,
                "USER",
                user.getId()
        );

        return entityMapper.toUserResponse(user);
    }

    @Transactional
    public Object verifyProfile(String profileType, Long profileId, VerificationStatus status, String comment) {
        if ("DONOR".equalsIgnoreCase(profileType)) {
            DonorProfile profile = donorProfileRepository.findById(profileId)
                    .orElseThrow(() -> new ResourceNotFoundException("Donor profile not found with id: " + profileId));
            profile.setVerificationStatus(status);
            profile = donorProfileRepository.save(profile);

            notificationService.createNotification(
                    profile.getUser(),
                    "Profile Verification Update",
                    "Your donor organization profile verification status is now: " + status +
                            (comment != null ? ". Admin note: " + comment : ""),
                    NotificationType.VERIFICATION,
                    "DONOR_PROFILE",
                    profile.getId()
            );
            return entityMapper.toDonorProfileResponse(profile);

        } else if ("NGO".equalsIgnoreCase(profileType) || "ORGANIZATION".equalsIgnoreCase(profileType)) {
            OrganizationProfile profile = organizationProfileRepository.findById(profileId)
                    .orElseThrow(() -> new ResourceNotFoundException("Organization profile not found with id: " + profileId));
            profile.setVerificationStatus(status);
            profile = organizationProfileRepository.save(profile);

            notificationService.createNotification(
                    profile.getUser(),
                    "NGO Verification Update",
                    "Your NGO profile verification status is now: " + status +
                            (comment != null ? ". Admin note: " + comment : ""),
                    NotificationType.VERIFICATION,
                    "ORGANIZATION_PROFILE",
                    profile.getId()
            );
            return entityMapper.toOrganizationProfileResponse(profile);

        } else if ("VOLUNTEER".equalsIgnoreCase(profileType)) {
            VolunteerProfile profile = volunteerProfileRepository.findById(profileId)
                    .orElseThrow(() -> new ResourceNotFoundException("Volunteer profile not found with id: " + profileId));
            profile.setVerificationStatus(status);
            profile = volunteerProfileRepository.save(profile);

            notificationService.createNotification(
                    profile.getUser(),
                    "Volunteer Verification Update",
                    "Your volunteer verification status is now: " + status +
                            (comment != null ? ". Admin note: " + comment : ""),
                    NotificationType.VERIFICATION,
                    "VOLUNTEER_PROFILE",
                    profile.getId()
            );
            return entityMapper.toVolunteerProfileResponse(profile);
        } else {
            throw new BadRequestException("Invalid profile type: " + profileType + ". Allowed: DONOR, NGO, VOLUNTEER");
        }
    }

    @Transactional(readOnly = true)
    public List<DonorProfileResponse> getAllDonors() {
        return donorProfileRepository.findAll().stream()
                .map(entityMapper::toDonorProfileResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrganizationProfileResponse> getAllNgos() {
        return organizationProfileRepository.findAll().stream()
                .map(entityMapper::toOrganizationProfileResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VolunteerProfileResponse> getAllVolunteers() {
        return volunteerProfileRepository.findAll().stream()
                .map(entityMapper::toVolunteerProfileResponse)
                .collect(Collectors.toList());
    }
}
