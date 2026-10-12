package com.foodrescue.platform.service;

import com.foodrescue.platform.dto.request.LoginRequest;
import com.foodrescue.platform.dto.request.RegisterRequest;
import com.foodrescue.platform.dto.response.AuthResponse;
import com.foodrescue.platform.dto.response.UserResponse;
import com.foodrescue.platform.entity.*;
import com.foodrescue.platform.enums.NotificationType;
import com.foodrescue.platform.enums.Role;
import com.foodrescue.platform.enums.VolunteerAvailability;
import com.foodrescue.platform.exception.BadRequestException;
import com.foodrescue.platform.exception.UnauthorizedException;
import com.foodrescue.platform.mapper.EntityMapper;
import com.foodrescue.platform.repository.*;
import com.foodrescue.platform.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final DonorProfileRepository donorProfileRepository;
    private final OrganizationProfileRepository organizationProfileRepository;
    private final VolunteerProfileRepository volunteerProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final NotificationService notificationService;
    private final EntityMapper entityMapper;

    public AuthService(UserRepository userRepository,
                       DonorProfileRepository donorProfileRepository,
                       OrganizationProfileRepository organizationProfileRepository,
                       VolunteerProfileRepository volunteerProfileRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider,
                       NotificationService notificationService,
                       EntityMapper entityMapper) {
        this.userRepository = userRepository;
        this.donorProfileRepository = donorProfileRepository;
        this.organizationProfileRepository = organizationProfileRepository;
        this.volunteerProfileRepository = volunteerProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.notificationService = notificationService;
        this.entityMapper = entityMapper;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (request.getRole() == Role.ADMIN) {
            throw new BadRequestException("Public registration of ADMIN role is prohibited");
        }

        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("An account with this email already exists");
        }

        User user = new User(
                request.getFullName(),
                request.getEmail().toLowerCase().trim(),
                passwordEncoder.encode(request.getPassword()),
                request.getRole(),
                request.getPhone()
        );
        user = userRepository.save(user);

        // Auto-create role profile
        if (request.getRole() == Role.DONOR) {
            DonorProfile profile = new DonorProfile(
                    user,
                    request.getOrganizationName() != null ? request.getOrganizationName() : request.getFullName(),
                    request.getContactPerson() != null ? request.getContactPerson() : request.getFullName(),
                    request.getAddress() != null ? request.getAddress() : "Address to be updated",
                    request.getCity() != null ? request.getCity() : "City",
                    request.getArea(),
                    request.getDescription()
            );
            donorProfileRepository.save(profile);
            user.setDonorProfile(profile);
        } else if (request.getRole() == Role.NGO) {
            OrganizationProfile profile = new OrganizationProfile(
                    user,
                    request.getOrganizationName() != null ? request.getOrganizationName() : request.getFullName() + " Org",
                    request.getContactPerson() != null ? request.getContactPerson() : request.getFullName(),
                    request.getAddress() != null ? request.getAddress() : "Address to be updated",
                    request.getCity() != null ? request.getCity() : "City",
                    request.getServiceArea() != null ? request.getServiceArea() : "City-wide",
                    request.getOrganizationType() != null ? request.getOrganizationType() : "Non-Profit",
                    request.getCapacity() != null ? request.getCapacity() : 100
            );
            organizationProfileRepository.save(profile);
            user.setOrganizationProfile(profile);
        } else if (request.getRole() == Role.VOLUNTEER) {
            VolunteerProfile profile = new VolunteerProfile(
                    user,
                    request.getCity() != null ? request.getCity() : "City",
                    request.getServiceArea() != null ? request.getServiceArea() : "City-wide",
                    VolunteerAvailability.AVAILABLE
            );
            volunteerProfileRepository.save(profile);
            user.setVolunteerProfile(profile);
        }

        notificationService.createNotification(
                user,
                "Welcome to Surplus Food Rescue Platform",
                "Your " + user.getRole().name() + " account has been successfully created. Welcome aboard!",
                NotificationType.REGISTRATION,
                "USER",
                user.getId()
        );

        String token = tokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());
        UserResponse userResponse = entityMapper.toUserResponse(user);
        return new AuthResponse(token, userResponse);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        if (!user.isEnabled()) {
            throw new UnauthorizedException("Account is disabled. Please contact system administrator.");
        }

        String token = tokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());
        UserResponse userResponse = entityMapper.toUserResponse(user);
        return new AuthResponse(token, userResponse);
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("User session not found"));
        return entityMapper.toUserResponse(user);
    }
}
