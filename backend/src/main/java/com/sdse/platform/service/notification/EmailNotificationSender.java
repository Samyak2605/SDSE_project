package com.sdse.platform.service.notification;

import com.sdse.platform.model.Notification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class EmailNotificationSender implements NotificationSender {
    private static final Logger log = LoggerFactory.getLogger(EmailNotificationSender.class);

    @Override
    public void send(Notification notification) {
        log.info("[EMAIL DISPATCHED] To: {} | Subject: {} | Body: {}",
                notification.getRecipient() != null ? notification.getRecipient().getEmail() : "N/A",
                notification.getTitle(),
                notification.getMessage());
    }

    @Override
    public String getChannelType() {
        return "EMAIL";
    }
}
