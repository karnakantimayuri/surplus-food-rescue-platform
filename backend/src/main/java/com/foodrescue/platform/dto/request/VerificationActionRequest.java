package com.foodrescue.platform.dto.request;

import com.foodrescue.platform.enums.VerificationStatus;
import jakarta.validation.constraints.NotNull;

public class VerificationActionRequest {

    @NotNull(message = "Verification status is required")
    private VerificationStatus status;

    private String comment;

    public VerificationActionRequest() {}

    public VerificationActionRequest(VerificationStatus status, String comment) {
        this.status = status;
        this.comment = comment;
    }

    public VerificationStatus getStatus() {
        return status;
    }

    public void setStatus(VerificationStatus status) {
        this.status = status;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
