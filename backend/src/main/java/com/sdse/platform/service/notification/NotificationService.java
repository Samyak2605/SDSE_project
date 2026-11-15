package com.sdse.platform.service.notification;

import com.sdse.platform.model.Notification;
import com.sdse.platform.model.User;
import com.sdse.platform.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * High-level Notification Service:
 * Demonstrates Dependency Inversion Principle (DIP) and Observer Pattern dispatching.
 */
@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final List<NotificationSender> senders;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository, List<NotificationSender> senders) {
        this.notificationRepository = notificationRepository;
        this.senders = senders;
    }

    @Transactional
    public Notification sendNotification(Notification notification) {
        Notification saved = notificationRepository.save(notification);

        for (NotificationSender sender : senders) {
            try {
                sender.send(saved);
            } catch (Exception e) {
                // Non-blocking for notification channels
            }
        }
        return saved;
    }

    @Transactional
    public Notification createAndSend(User recipient, String title, String message, String type) {
        Notification notification = new Notification(recipient, title, message, type);
        return sendNotification(notification);
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByRecipientIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository.findByRecipientIdAndIsReadFalse(userId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }
}
