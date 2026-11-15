package com.sdse.platform.service.notification;

import com.sdse.platform.model.Notification;

public interface NotificationSender {
    void send(Notification notification);
    String getChannelType();
}
