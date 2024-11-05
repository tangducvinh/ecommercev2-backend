"use strict";

const { authentication } = require("../../auth/authUtils");
const checkoutController = require("../../controllers/checkout.controller");
const asyncHandler = require("../../helpers/asyncHandler");

const router = require("express").Router();

// authentication
router.use(authentication);

router.post("/review", asyncHandler(checkoutController.checkoutReview));

module.exports = router;
