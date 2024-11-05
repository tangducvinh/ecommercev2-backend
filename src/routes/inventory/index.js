"use strict";

const { authentication } = require("../../auth/authUtils");
const InventoryController = require("../../controllers/inventory.controller");
const asyncHandler = require("../../helpers/asyncHandler");

const router = require("express").Router();

// authentication
router.use(authentication);
router.pose("/", asyncHandler(InventoryController.addStockToInventory));

module.exports = router;
