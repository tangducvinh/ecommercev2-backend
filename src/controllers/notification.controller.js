"use strict";

const NotificationService = require("../services/notification.service");
const { SuccessResponse } = require("../core/success.response");

class NotificationController {
  listNotificationByUser = async (req, res, next) => {
    new SuccessResponse({
      message: "get notification success",
      metadata: await NotificationService.listNotificationByUser(req.query),
    }).send(res);
  };
}

module.exports = new NotificationController();
