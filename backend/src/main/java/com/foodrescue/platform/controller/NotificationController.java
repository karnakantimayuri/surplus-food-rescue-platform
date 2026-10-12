package com.foodrescue.platform.controller;

import com.foodrescue.platform.dto.response.ApiResponse;
import com.foodrescue.platform.dto.response.NotificationResponse;
import com.foodrescue.platform.security.UserPrincipal;
import com.foodrescue.platform.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getNotifications(@AuthenticationPrincipal UserPrincipal principal) {
        List<NotificationResponse> list = notificationService.getUserNotifications(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Notifications retrieved", list));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse> getUnreadCount(@AuthenticationPrincipal UserPrincipal principal) {
        long count = notificationService.getUnreadNotificationCount(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Unread notification count", count));
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<ApiResponse> markAsRead(@AuthenticationPrincipal UserPrincipal principal,
                                                  @PathVariable Long id) {
        NotificationResponse response = notificationService.markAsRead(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Notification marked as read", response));
    }

    @PostMapping("/read-all")
    public ResponseEntity<ApiResponse> markAllAsRead(@AuthenticationPrincipal UserPrincipal principal) {
        notificationService.markAllAsRead(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("All notifications marked as read"));
    }
}
