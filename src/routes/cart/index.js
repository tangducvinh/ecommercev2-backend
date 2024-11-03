"use strict";

const router = require("express").Router();
const { authentication } = require("../../auth/authUtils");
const CartController = require("../../controllers/cart.controller");

router.use(authentication);

router.post("/", CartController.addToCart);
router.get("/", CartController.getCart);
router.delete("/item", CartController.deleteItemCart);

module.exports = router;
