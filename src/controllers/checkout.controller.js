"use strict";

const { OK, CREATED, SuccessResponse } = require("../core/success.response");
const CheckoutService = require("../services/checkout.service");

class CheckoutController {
  async checkoutReview(req, res, next) {
    new OK({
      message: "checkout success!",
      metadata: await CheckoutService.checkoutReview(req.body),
    }).send(res);
  }
}

module.exports = new CheckoutController();
