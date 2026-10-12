package com.foodrescue.platform.service;

import com.foodrescue.platform.dto.request.DonorProfileRequest;
import com.foodrescue.platform.dto.request.OrganizationProfileRequest;
import com.foodrescue.platform.dto.request.VolunteerProfileRequest;
import com.foodrescue.platform.dto.response.DonorProfileResponse;
import com.foodrescue.platform.dto.response.OrganizationProfileResponse;
import com.foodrescue.platform.dto.response.VolunteerProfileResponse;
import com.foodrescue.platform.entity.*;
import com.foodrescue.platform.exception.BadRequestException;
import com.foodrescue.platform.exception.ResourceNotFoundException;
import com.foodrescue.platform.mapper.EntityMapper;
import com.foodrescue.platform.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final DonorProfileRepository donorProfileRepository;
    private final OrganizationProfileRepository organizationProfileRepository;
    private final VolunteerProfileRepository volunteerProfileRepository;
    private final EntityMapper entityMapper;

    public ProfileService(UserRepository userRepository,
                          DonorProfileRepository donorProfileRepository,
                          OrganizationProfileRepository organizationProfileRepository,
                          VolunteerProfileRepository volunteerProfileRepository,
                          EntityMapper entityMapper) {
        this.userRepository = userRepository;
        this.donorProfileRepository = donorProfileRepository;
        this.organizationProfileRepository = organizationProfileRepository;
        this.volunteerProfileRepository = volunteerProfileRepository;
        this.entityMapper = entityMapper;
    }

    @Transactional(readOnly = true)
    public DonorProfileResponse getDonorProfile(Long userId) {
        DonorProfile profile = donorProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Donor profile not found for user: " + userId));
        return entityMapper.toDonorProfileResponse(profile);
    }

    @Transactional
    public DonorProfileResponse updateDonorProfile(Long userId, DonorProfileRequest request) {
        DonorProfile profile = donorProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
                    DonorProfile newProfile = new DonorProfile();
                    newProfile.setUser(user);
                    return newProfile;
                });

        profile.setOrganizationName(request.getOrganizationName());
        profile.setContactPerson(request.getContactPerson());
        profile.setAddress(request.getAddress());
        profile.setCity(request.getCity());
        profile.setArea(request.getArea());
        profile.setDescription(request.getDescription());

        profile = donorProfileRepository.save(profile);
        return entityMapper.toDonorProfileResponse(profile);
    }

    @Transactional(readOnly = true)
    public OrganizationProfileResponse getOrganizationProfile(Long userId) {
        OrganizationProfile profile = organizationProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization profile not found for user: " + userId));
        return entityMapper.toOrganizationProfileResponse(profile);
    }

    @Transactional
    public OrganizationProfileResponse updateOrganizationProfile(Long userId, OrganizationProfileRequest request) {
        OrganizationProfile profile = organizationProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
                    OrganizationProfile newProfile = new OrganizationProfile();
                    newProfile.setUser(user);
                    return newProfile;
                });

        profile.setOrganizationName(request.getOrganizationName());
        profile.setContactPerson(request.getContactPerson());
        profile.setAddress(request.getAddress());
        profile.setCity(request.getCity());
        profile.setServiceArea(request.getServiceArea());
        profile.setOrganizationType(request.getOrganizationType());
        profile.setCapacity(request.getCapacity());

        profile = organizationProfileRepository.save(profile);
        return entityMapper.toOrganizationProfileResponse(profile);
    }

    @Transactional(readOnly = true)
    public VolunteerProfileResponse getVolunteerProfile(Long userId) {
        VolunteerProfile profile = volunteerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Volunteer profile not found for user: " + userId));
        return entityMapper.toVolunteerProfileResponse(profile);
    }

    @Transactional
    public VolunteerProfileResponse updateVolunteerProfile(Long userId, VolunteerProfileRequest request) {
        VolunteerProfile profile = volunteerProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
                    VolunteerProfile newProfile = new VolunteerProfile();
                    newProfile.setUser(user);
                    return newProfile;
                });

        profile.setCity(request.getCity());
        profile.setServiceArea(request.getServiceArea());
        if (request.getAvailability() != null) {
            profile.setAvailability(request.getAvailability());
        }

        profile = volunteerProfileRepository.save(profile);
        return entityMapper.toVolunteerProfileResponse(profile);
    }
}
