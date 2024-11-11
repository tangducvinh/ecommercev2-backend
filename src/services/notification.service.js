"use strict";

const notificationModel = require("../models/notification.model");

class NotificationService {
  async pushNotificationToSystem({
    type = "SHOP-001",
    receivedId = "1",
    senderId = "1",
    options = {},
  }) {
    let notification_content;

    switch (type) {
      case "SHOP-001":
        notification_content = `Vua moi them mot san pham: `;
        break;
      case "PROMOTION-001":
        notification_content = `Vua moi them mot voucher`;
    }

    const newNotification = await notificationModel.create({
      noti_type: type,
      noti_content: notification_content,
      noti_senderId: senderId,
      noti_receivedId: receivedId,
      noti_options: options,
    });

    return newNotification;
  }

  async listNotificationByUser({ userId = "1", type = "ALL", isRead = 0 }) {
    const match = { noti_receivedId: userId };

    if (type !== "ALL") {
      match["noti_type"] = type;
    }

    return await notificationModel.aggregate([
      {
        $match: match,
      },
      {
        $project: {
          noti_type: 1,
          noti_senderId: 1,
          noti_receivedId: 1,
          noti_content: {
            $concat: [
              {
                $substr: ["$noti_options.shop_name", 0, -1],
              },
              " vua moi them mot san pham moi: ",
              {
                $substr: ["$noti_options.product_name", 0, -1],
              },
            ],
          },
          createAt: 1,
          noti_options: 1,
        },
      },
    ]);
  }
}

module.exports = new NotificationService();
