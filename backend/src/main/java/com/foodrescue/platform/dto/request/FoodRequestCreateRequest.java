package com.foodrescue.platform.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class FoodRequestCreateRequest {

    @NotNull(message = "Donation ID is required")
    private Long donationId;

    @NotNull(message = "Requested quantity is required")
    @DecimalMin(value = "0.01", message = "Requested quantity must be greater than zero")
    private BigDecimal requestedQuantity;

    private String requestMessage;

    public FoodRequestCreateRequest() {}

    public Long getDonationId() {
        return donationId;
    }

    public void setDonationId(Long donationId) {
        this.donationId = donationId;
    }

    public BigDecimal getRequestedQuantity() {
        return requestedQuantity;
    }

    public void setRequestedQuantity(BigDecimal requestedQuantity) {
        this.requestedQuantity = requestedQuantity;
    }

    public String getRequestMessage() {
        return requestMessage;
    }

    public void setRequestMessage(String requestMessage) {
        this.requestMessage = requestMessage;
    }
}
