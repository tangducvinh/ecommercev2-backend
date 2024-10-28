"use strict";

const { authentication } = require("../../auth/authUtils");
const productController = require("../../controllers/product.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const router = require("express").Router();

// authentication
router.use(authentication);

router.post("/", asyncHandler(productController.createProduct));

module.exports = router;
