package com.sdse.platform.service.notification;

import com.sdse.platform.model.Notification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class SmsNotificationSender implements NotificationSender {
    private static final Logger log = LoggerFactory.getLogger(SmsNotificationSender.class);

    @Override
    public void send(Notification notification) {
        log.info("[SMS DISPATCHED] To Phone: {} | SMS: {}",
                notification.getRecipient() != null ? notification.getRecipient().getPhone() : "N/A",
                notification.getMessage());
    }

    @Override
    public String getChannelType() {
        return "SMS";
    }
}
