"use strict";

const { authentication } = require("../../auth/authUtils");
const accessController = require("../../controllers/access.controller");
const asyncHandler = require("../../helpers/asyncHandler");

const router = require("express").Router();

// signUp
router.post("/user/signup", asyncHandler(accessController.signUp));
router.post("/user/signin", asyncHandler(accessController.signIn));

// authentication
router.use(authentication);

router.post("/user/logout", asyncHandler(accessController.logOut));

module.exports = router;
