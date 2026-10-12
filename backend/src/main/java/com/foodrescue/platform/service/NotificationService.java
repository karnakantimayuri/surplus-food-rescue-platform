package com.foodrescue.platform.service;

import com.foodrescue.platform.dto.response.NotificationResponse;
import com.foodrescue.platform.entity.Notification;
import com.foodrescue.platform.entity.User;
import com.foodrescue.platform.enums.NotificationType;
import com.foodrescue.platform.exception.ResourceNotFoundException;
import com.foodrescue.platform.mapper.EntityMapper;
import com.foodrescue.platform.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final EntityMapper entityMapper;

    public NotificationService(NotificationRepository notificationRepository, EntityMapper entityMapper) {
        this.notificationRepository = notificationRepository;
        this.entityMapper = entityMapper;
    }

    @Transactional
    public void createNotification(User recipient, String title, String message, NotificationType type, String relatedEntityType, Long relatedEntityId) {
        if (recipient == null) return;
        Notification notification = new Notification(recipient, title, message, type, relatedEntityType, relatedEntityId);
        notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getUserNotifications(Long userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(entityMapper::toNotificationResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getUnreadNotificationCount(Long userId) {
        return notificationRepository.countByRecipientIdAndReadFalse(userId);
    }

    @Transactional
    public NotificationResponse markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));

        if (!notification.getRecipient().getId().equals(userId)) {
            throw new ResourceNotFoundException("Notification not found for current user");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
        return entityMapper.toNotificationResponse(notification);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository.findByRecipientIdAndReadFalseOrderByCreatedAtDesc(userId);
        for (Notification n : unread) {
            n.setRead(true);
        }
        notificationRepository.saveAll(unread);
    }
}
