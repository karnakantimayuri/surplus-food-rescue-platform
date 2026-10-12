package com.foodrescue.platform.service;

import com.foodrescue.platform.dto.request.FoodDonationRequest;
import com.foodrescue.platform.dto.response.FoodDonationResponse;
import com.foodrescue.platform.entity.DonorProfile;
import com.foodrescue.platform.entity.FoodCategory;
import com.foodrescue.platform.entity.FoodDonation;
import com.foodrescue.platform.enums.DonationStatus;
import com.foodrescue.platform.enums.NotificationType;
import com.foodrescue.platform.exception.BadRequestException;
import com.foodrescue.platform.exception.ResourceNotFoundException;
import com.foodrescue.platform.exception.UnauthorizedException;
import com.foodrescue.platform.mapper.EntityMapper;
import com.foodrescue.platform.repository.DonorProfileRepository;
import com.foodrescue.platform.repository.FoodCategoryRepository;
import com.foodrescue.platform.repository.FoodDonationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DonationService {

    private final FoodDonationRepository donationRepository;
    private final DonorProfileRepository donorProfileRepository;
    private final FoodCategoryRepository categoryRepository;
    private final NotificationService notificationService;
    private final EntityMapper entityMapper;

    public DonationService(FoodDonationRepository donationRepository,
                           DonorProfileRepository donorProfileRepository,
                           FoodCategoryRepository categoryRepository,
                           NotificationService notificationService,
                           EntityMapper entityMapper) {
        this.donationRepository = donationRepository;
        this.donorProfileRepository = donorProfileRepository;
        this.categoryRepository = categoryRepository;
        this.notificationService = notificationService;
        this.entityMapper = entityMapper;
    }

    @Transactional
    public FoodDonationResponse createDonation(Long userId, FoodDonationRequest request) {
        DonorProfile donor = donorProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("You must complete your Donor profile before listing donations"));

        FoodCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        if (request.getPickupDeadline().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Pickup deadline must be in the future");
        }

        if (request.getQuantity().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Donation quantity must be greater than zero");
        }

        FoodDonation donation = new FoodDonation();
        donation.setDonor(donor);
        donation.setCategory(category);
        donation.setFoodName(request.getFoodName());
        donation.setDescription(request.getDescription());
        donation.setQuantity(request.getQuantity());
        donation.setAllocatedQuantity(BigDecimal.ZERO);
        donation.setRemainingQuantity(request.getQuantity());
        donation.setUnit(request.getUnit());
        donation.setPreparedAt(request.getPreparedAt() != null ? request.getPreparedAt() : LocalDateTime.now());
        donation.setPickupDeadline(request.getPickupDeadline());
        donation.setPickupAddress(request.getPickupAddress());
        donation.setCity(request.getCity());
        donation.setArea(request.getArea());
        donation.setSpecialInformation(request.getSpecialInformation());
        donation.setVegetarian(request.isVegetarian());
        donation.setAllergenInformation(request.getAllergenInformation());
        donation.setStorageInstructions(request.getStorageInstructions());
        donation.setStatus(DonationStatus.AVAILABLE);

        donation = donationRepository.save(donation);

        notificationService.createNotification(
                donor.getUser(),
                "Donation Listed Successfully",
                "Your food donation listing '" + donation.getFoodName() + "' has been published.",
                NotificationType.SYSTEM,
                "DONATION",
                donation.getId()
        );

        return entityMapper.toFoodDonationResponse(donation);
    }

    @Transactional
    public FoodDonationResponse updateDonation(Long userId, Long donationId, FoodDonationRequest request) {
        FoodDonation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found with id: " + donationId));

        if (!donation.getDonor().getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to edit this donation");
        }

        if (donation.getStatus() == DonationStatus.COMPLETED || donation.getStatus() == DonationStatus.CANCELLED) {
            throw new BadRequestException("Cannot edit a donation that is " + donation.getStatus());
        }

        if (request.getPickupDeadline().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Pickup deadline must be in the future");
        }

        FoodCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        donation.setCategory(category);
        donation.setFoodName(request.getFoodName());
        donation.setDescription(request.getDescription());
        donation.setPickupDeadline(request.getPickupDeadline());
        donation.setPickupAddress(request.getPickupAddress());
        donation.setCity(request.getCity());
        donation.setArea(request.getArea());
        donation.setSpecialInformation(request.getSpecialInformation());
        donation.setVegetarian(request.isVegetarian());
        donation.setAllergenInformation(request.getAllergenInformation());
        donation.setStorageInstructions(request.getStorageInstructions());

        donation = donationRepository.save(donation);
        return entityMapper.toFoodDonationResponse(donation);
    }

    @Transactional
    public FoodDonationResponse cancelDonation(Long userId, Long donationId) {
        FoodDonation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found with id: " + donationId));

        if (!donation.getDonor().getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to cancel this donation");
        }

        if (donation.getStatus() == DonationStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel a donation that has already been completed");
        }

        if (donation.getStatus() == DonationStatus.IN_PROGRESS) {
            throw new BadRequestException("Cannot cancel a donation with food currently in-transit or collected");
        }

        donation.setStatus(DonationStatus.CANCELLED);
        donation = donationRepository.save(donation);

        notificationService.createNotification(
                donation.getDonor().getUser(),
                "Donation Cancelled",
                "Your donation listing '" + donation.getFoodName() + "' was cancelled.",
                NotificationType.SYSTEM,
                "DONATION",
                donation.getId()
        );

        return entityMapper.toFoodDonationResponse(donation);
    }

    @Transactional(readOnly = true)
    public FoodDonationResponse getDonationById(Long id) {
        FoodDonation donation = donationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found with id: " + id));
        return entityMapper.toFoodDonationResponse(donation);
    }

    @Transactional(readOnly = true)
    public List<FoodDonationResponse> searchDonations(DonationStatus status, Long categoryId, String city, Boolean vegetarian, String search) {
        return donationRepository.searchDonations(status, categoryId, city, vegetarian, search).stream()
                .map(entityMapper::toFoodDonationResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FoodDonationResponse> getDonorDonations(Long userId) {
        DonorProfile donor = donorProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Donor profile not found for user: " + userId));
        return donationRepository.findByDonorIdOrderByCreatedAtDesc(donor.getId()).stream()
                .map(entityMapper::toFoodDonationResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FoodDonationResponse> getAllDonations() {
        return donationRepository.findAll().stream()
                .map(entityMapper::toFoodDonationResponse)
                .collect(Collectors.toList());
    }
}
