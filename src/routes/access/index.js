"use strict";

const accessController = require("../../controllers/access.controller");

const router = require("express").Router();

// signUp
router.post("/shop/signup", accessController.signUp);

module.exports = router;
