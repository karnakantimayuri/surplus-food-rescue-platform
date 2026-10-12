package com.foodrescue.platform.dto.request;

public class FoodRequestActionRequest {

    private String donorResponse;

    public FoodRequestActionRequest() {}

    public FoodRequestActionRequest(String donorResponse) {
        this.donorResponse = donorResponse;
    }

    public String getDonorResponse() {
        return donorResponse;
    }

    public void setDonorResponse(String donorResponse) {
        this.donorResponse = donorResponse;
    }
}
