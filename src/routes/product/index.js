"use strict";

const { authentication } = require("../../auth/authUtils");
const productController = require("../../controllers/product.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const router = require("express").Router();

router.get(
  "/search/:keySearch",
  asyncHandler(productController.getListSearchProduct)
);
router.get("/:product_slug", asyncHandler(productController.findProduct));
router.get("/", asyncHandler(productController.findAllProducts));

// authentication
router.use(authentication);

router.post("/", asyncHandler(productController.createProduct));
router.patch("/:productId", asyncHandler(productController.updateProduct));
router.put(
  "/published/:id",
  asyncHandler(productController.publishedProductByShop)
);
router.put(
  "/unpublished/:id",
  asyncHandler(productController.unPublishedProductByShop)
);

// query
/**
 * @desc Get all Draft fro shop
 * @params {Number} limit
 * @params {Number} skip
 * @return { JSON }
 */
router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));
router.get(
  "/published/all",
  asyncHandler(productController.getAllPublishedForShop)
);

module.exports = router;
