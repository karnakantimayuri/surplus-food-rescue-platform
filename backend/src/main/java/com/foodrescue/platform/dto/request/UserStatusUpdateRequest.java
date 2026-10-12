package com.foodrescue.platform.dto.request;

public class UserStatusUpdateRequest {

    private boolean enabled;

    public UserStatusUpdateRequest() {}

    public UserStatusUpdateRequest(boolean enabled) {
        this.enabled = enabled;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
}
