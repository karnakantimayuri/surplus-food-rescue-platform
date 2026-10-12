package com.foodrescue.platform.dto.request;

import jakarta.validation.constraints.NotNull;

public class AssignmentCreateRequest {

    @NotNull(message = "Food Request ID is required")
    private Long foodRequestId;

    @NotNull(message = "Volunteer ID is required")
    private Long volunteerId;

    public AssignmentCreateRequest() {}

    public Long getFoodRequestId() {
        return foodRequestId;
    }

    public void setFoodRequestId(Long foodRequestId) {
        this.foodRequestId = foodRequestId;
    }

    public Long getVolunteerId() {
        return volunteerId;
    }

    public void setVolunteerId(Long volunteerId) {
        this.volunteerId = volunteerId;
    }
}
