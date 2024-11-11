"use strict";

const { authentication } = require("../../auth/authUtils");
const NotificationController = require("../../controllers/notification.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const router = require("express").Router();

// authentication
router.use(authentication);

router.get("/", asyncHandler(NotificationController.listNotificationByUser));

module.exports = router;
