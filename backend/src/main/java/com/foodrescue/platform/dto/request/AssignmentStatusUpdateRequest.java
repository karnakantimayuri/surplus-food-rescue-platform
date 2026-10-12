package com.foodrescue.platform.dto.request;

public class AssignmentStatusUpdateRequest {

    private String action; // ACCEPT, COLLECT, DELIVER
    private String notes;

    public AssignmentStatusUpdateRequest() {}

    public AssignmentStatusUpdateRequest(String action, String notes) {
        this.action = action;
        this.notes = notes;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
