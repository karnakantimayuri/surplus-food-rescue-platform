package com.foodrescue.platform.mapper;

import com.foodrescue.platform.dto.response.*;
import com.foodrescue.platform.entity.*;
import org.springframework.stereotype.Component;

@Component
public class EntityMapper {

    public UserResponse toUserResponse(User user) {
        if (user == null) return null;
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setPhone(user.getPhone());
        response.setEnabled(user.isEnabled());
        response.setCreatedAt(user.getCreatedAt());

        if (user.getDonorProfile() != null) {
            response.setProfileId(user.getDonorProfile().getId());
            response.setVerificationStatus(user.getDonorProfile().getVerificationStatus().name());
        } else if (user.getOrganizationProfile() != null) {
            response.setProfileId(user.getOrganizationProfile().getId());
            response.setVerificationStatus(user.getOrganizationProfile().getVerificationStatus().name());
        } else if (user.getVolunteerProfile() != null) {
            response.setProfileId(user.getVolunteerProfile().getId());
            response.setVerificationStatus(user.getVolunteerProfile().getVerificationStatus().name());
        }
        return response;
    }

    public DonorProfileResponse toDonorProfileResponse(DonorProfile profile) {
        if (profile == null) return null;
        DonorProfileResponse response = new DonorProfileResponse();
        response.setId(profile.getId());
        if (profile.getUser() != null) {
            response.setUserId(profile.getUser().getId());
            response.setUserFullName(profile.getUser().getFullName());
            response.setUserEmail(profile.getUser().getEmail());
            response.setUserPhone(profile.getUser().getPhone());
        }
        response.setOrganizationName(profile.getOrganizationName());
        response.setContactPerson(profile.getContactPerson());
        response.setAddress(profile.getAddress());
        response.setCity(profile.getCity());
        response.setArea(profile.getArea());
        response.setDescription(profile.getDescription());
        response.setVerificationStatus(profile.getVerificationStatus());
        response.setCreatedAt(profile.getCreatedAt());
        response.setDonationCount(profile.getDonations() != null ? profile.getDonations().size() : 0);
        return response;
    }

    public OrganizationProfileResponse toOrganizationProfileResponse(OrganizationProfile profile) {
        if (profile == null) return null;
        OrganizationProfileResponse response = new OrganizationProfileResponse();
        response.setId(profile.getId());
        if (profile.getUser() != null) {
            response.setUserId(profile.getUser().getId());
            response.setUserFullName(profile.getUser().getFullName());
            response.setUserEmail(profile.getUser().getEmail());
            response.setUserPhone(profile.getUser().getPhone());
        }
        response.setOrganizationName(profile.getOrganizationName());
        response.setContactPerson(profile.getContactPerson());
        response.setAddress(profile.getAddress());
        response.setCity(profile.getCity());
        response.setServiceArea(profile.getServiceArea());
        response.setOrganizationType(profile.getOrganizationType());
        response.setCapacity(profile.getCapacity());
        response.setVerificationStatus(profile.getVerificationStatus());
        response.setCreatedAt(profile.getCreatedAt());
        response.setRequestCount(profile.getFoodRequests() != null ? profile.getFoodRequests().size() : 0);
        return response;
    }

    public VolunteerProfileResponse toVolunteerProfileResponse(VolunteerProfile profile) {
        if (profile == null) return null;
        VolunteerProfileResponse response = new VolunteerProfileResponse();
        response.setId(profile.getId());
        if (profile.getUser() != null) {
            response.setUserId(profile.getUser().getId());
            response.setUserFullName(profile.getUser().getFullName());
            response.setUserEmail(profile.getUser().getEmail());
            response.setUserPhone(profile.getUser().getPhone());
        }
        response.setCity(profile.getCity());
        response.setServiceArea(profile.getServiceArea());
        response.setAvailability(profile.getAvailability());
        response.setVerificationStatus(profile.getVerificationStatus());
        response.setCreatedAt(profile.getCreatedAt());
        if (profile.getAssignments() != null) {
            int completed = (int) profile.getAssignments().stream()
                    .filter(a -> a.getDeliveryStatus() == com.foodrescue.platform.enums.DeliveryStatus.DELIVERED)
                    .count();
            int active = (int) profile.getAssignments().stream()
                    .filter(a -> a.getDeliveryStatus() != com.foodrescue.platform.enums.DeliveryStatus.DELIVERED &&
                                 a.getDeliveryStatus() != com.foodrescue.platform.enums.DeliveryStatus.FAILED &&
                                 a.getPickupStatus() != com.foodrescue.platform.enums.PickupStatus.CANCELLED)
                    .count();
            response.setCompletedAssignmentsCount(completed);
            response.setActiveAssignmentsCount(active);
        }
        return response;
    }

    public FoodCategoryResponse toFoodCategoryResponse(FoodCategory category) {
        if (category == null) return null;
        FoodCategoryResponse response = new FoodCategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setDescription(category.getDescription());
        response.setActive(category.isActive());
        response.setCreatedAt(category.getCreatedAt());
        response.setDonationCount(category.getDonations() != null ? category.getDonations().size() : 0);
        return response;
    }

    public FoodDonationResponse toFoodDonationResponse(FoodDonation donation) {
        if (donation == null) return null;
        FoodDonationResponse response = new FoodDonationResponse();
        response.setId(donation.getId());
        if (donation.getDonor() != null) {
            response.setDonorId(donation.getDonor().getId());
            response.setDonorName(donation.getDonor().getUser() != null ? donation.getDonor().getUser().getFullName() : null);
            response.setDonorOrganization(donation.getDonor().getOrganizationName());
            response.setDonorPhone(donation.getDonor().getUser() != null ? donation.getDonor().getUser().getPhone() : null);
        }
        if (donation.getCategory() != null) {
            response.setCategoryId(donation.getCategory().getId());
            response.setCategoryName(donation.getCategory().getName());
        }
        response.setFoodName(donation.getFoodName());
        response.setDescription(donation.getDescription());
        response.setQuantity(donation.getQuantity());
        response.setAllocatedQuantity(donation.getAllocatedQuantity());
        response.setRemainingQuantity(donation.getRemainingQuantity());
        response.setUnit(donation.getUnit());
        response.setPreparedAt(donation.getPreparedAt());
        response.setPickupDeadline(donation.getPickupDeadline());
        response.setPickupAddress(donation.getPickupAddress());
        response.setCity(donation.getCity());
        response.setArea(donation.getArea());
        response.setSpecialInformation(donation.getSpecialInformation());
        response.setVegetarian(donation.isVegetarian());
        response.setAllergenInformation(donation.getAllergenInformation());
        response.setStorageInstructions(donation.getStorageInstructions());
        response.setStatus(donation.getStatus());
        response.setCreatedAt(donation.getCreatedAt());
        response.setUpdatedAt(donation.getUpdatedAt());
        response.setRequestCount(donation.getRequests() != null ? donation.getRequests().size() : 0);
        return response;
    }

    public FoodRequestResponse toFoodRequestResponse(FoodRequest request) {
        if (request == null) return null;
        FoodRequestResponse response = new FoodRequestResponse();
        response.setId(request.getId());
        if (request.getDonation() != null) {
            response.setDonationId(request.getDonation().getId());
            response.setFoodName(request.getDonation().getFoodName());
            response.setUnit(request.getDonation().getUnit());
            response.setPickupAddress(request.getDonation().getPickupAddress());
            if (request.getDonation().getDonor() != null) {
                response.setDonorName(request.getDonation().getDonor().getOrganizationName());
                if (request.getDonation().getDonor().getUser() != null) {
                    response.setDonorPhone(request.getDonation().getDonor().getUser().getPhone());
                }
            }
        }
        if (request.getOrganization() != null) {
            response.setOrganizationId(request.getOrganization().getId());
            response.setOrganizationName(request.getOrganization().getOrganizationName());
            response.setOrganizationContact(request.getOrganization().getContactPerson());
            if (request.getOrganization().getUser() != null) {
                response.setOrganizationPhone(request.getOrganization().getUser().getPhone());
            }
        }
        response.setRequestedQuantity(request.getRequestedQuantity());
        response.setStatus(request.getStatus());
        response.setRequestMessage(request.getRequestMessage());
        response.setDonorResponse(request.getDonorResponse());
        response.setCreatedAt(request.getCreatedAt());
        response.setUpdatedAt(request.getUpdatedAt());
        response.setApprovedAt(request.getApprovedAt());
        response.setCancelledAt(request.getCancelledAt());

        if (request.getPickupAssignment() != null) {
            PickupAssignment pa = request.getPickupAssignment();
            response.setAssignmentId(pa.getId());
            if (pa.getVolunteer() != null && pa.getVolunteer().getUser() != null) {
                response.setVolunteerName(pa.getVolunteer().getUser().getFullName());
                response.setVolunteerPhone(pa.getVolunteer().getUser().getPhone());
            }
            response.setPickupStatus(pa.getPickupStatus().name());
            response.setDeliveryStatus(pa.getDeliveryStatus().name());
        }
        return response;
    }

    public PickupAssignmentResponse toPickupAssignmentResponse(PickupAssignment pa) {
        if (pa == null) return null;
        PickupAssignmentResponse response = new PickupAssignmentResponse();
        response.setId(pa.getId());
        if (pa.getFoodRequest() != null) {
            FoodRequest fr = pa.getFoodRequest();
            response.setFoodRequestId(fr.getId());
            response.setQuantity(fr.getRequestedQuantity());
            if (fr.getDonation() != null) {
                FoodDonation donation = fr.getDonation();
                response.setDonationId(donation.getId());
                response.setFoodName(donation.getFoodName());
                response.setUnit(donation.getUnit());
                response.setPickupAddress(donation.getPickupAddress());
                if (donation.getDonor() != null) {
                    response.setDonorOrganization(donation.getDonor().getOrganizationName());
                    if (donation.getDonor().getUser() != null) {
                        response.setDonorName(donation.getDonor().getUser().getFullName());
                        response.setDonorPhone(donation.getDonor().getUser().getPhone());
                    }
                }
            }
            if (fr.getOrganization() != null) {
                OrganizationProfile org = fr.getOrganization();
                response.setRecipientOrganization(org.getOrganizationName());
                response.setRecipientAddress(org.getAddress());
                response.setRecipientContactPerson(org.getContactPerson());
                if (org.getUser() != null) {
                    response.setRecipientPhone(org.getUser().getPhone());
                }
            }
        }
        if (pa.getVolunteer() != null) {
            response.setVolunteerId(pa.getVolunteer().getId());
            if (pa.getVolunteer().getUser() != null) {
                response.setVolunteerName(pa.getVolunteer().getUser().getFullName());
                response.setVolunteerPhone(pa.getVolunteer().getUser().getPhone());
            }
        }
        response.setPickupTime(pa.getPickupTime());
        response.setDeliveryTime(pa.getDeliveryTime());
        response.setPickupStatus(pa.getPickupStatus());
        response.setDeliveryStatus(pa.getDeliveryStatus());
        response.setPickupNotes(pa.getPickupNotes());
        response.setDeliveryNotes(pa.getDeliveryNotes());
        response.setCreatedAt(pa.getCreatedAt());
        response.setCompletedAt(pa.getCompletedAt());
        return response;
    }

    public NotificationResponse toNotificationResponse(Notification notification) {
        if (notification == null) return null;
        NotificationResponse response = new NotificationResponse();
        response.setId(notification.getId());
        if (notification.getRecipient() != null) {
            response.setRecipientId(notification.getRecipient().getId());
        }
        response.setTitle(notification.getTitle());
        response.setMessage(notification.getMessage());
        response.setType(notification.getType());
        response.setRelatedEntityType(notification.getRelatedEntityType());
        response.setRelatedEntityId(notification.getRelatedEntityId());
        response.setRead(notification.isRead());
        response.setCreatedAt(notification.getCreatedAt());
        return response;
    }
}
