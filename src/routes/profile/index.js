"use strict";

const router = require("express").Router();
const ProfileController = require("../../controllers/profile.controller");
const { grantAccess } = require("../../middlewares/rbac");
// admin

router.get(
  "/viewAny",
  grantAccess("readAny", "profile"),
  ProfileController.profiles
);

// shop
router.get("/viewOwn", ProfileController.profile);

module.exports = router;
