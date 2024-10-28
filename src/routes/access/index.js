"use strict";

const { authentication } = require("../../auth/authUtils");
const accessController = require("../../controllers/access.controller");
const asyncHandler = require("../../helpers/asyncHandler");

const router = require("express").Router();

// signUp
router.post("/shop/signup", asyncHandler(accessController.signUp));
router.post("/shop/signin", asyncHandler(accessController.signIn));

// authentication
router.use(authentication);

router.post("/shop/logout", asyncHandler(accessController.logOut));
router.post(
  "/shop/refresh-token",
  asyncHandler(accessController.handlerRefreshToken)
);

module.exports = router;
