"use strict";

const { authentication } = require("../../auth/authUtils");
const discountController = require("../../controllers/discount.controller");
const asyncHandler = require("../../helpers/asyncHandler");

const router = require("express").Router();

router.get(
  "/products-with-discount",
  discountController.getAllProductWidthDiscountCode
);
router.get("/discount-of-shop", discountController.getAllDiscountOfShop);

// authentication
router.use(authentication);

router.post("/", asyncHandler(discountController.createDiscount));
router.patch("/:discountId", asyncHandler(discountController.updateDiscount));

module.exports = router;
