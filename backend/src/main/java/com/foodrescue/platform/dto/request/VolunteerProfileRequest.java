package com.foodrescue.platform.dto.request;

import com.foodrescue.platform.enums.VolunteerAvailability;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class VolunteerProfileRequest {

    @NotBlank(message = "City is required")
    private String city;

    private String serviceArea;

    @NotNull(message = "Availability status is required")
    private VolunteerAvailability availability;

    public VolunteerProfileRequest() {}

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getServiceArea() {
        return serviceArea;
    }

    public void setServiceArea(String serviceArea) {
        this.serviceArea = serviceArea;
    }

    public VolunteerAvailability getAvailability() {
        return availability;
    }

    public void setAvailability(VolunteerAvailability availability) {
        this.availability = availability;
    }
}
