"use strict";
const { OK, CREATED, SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
  createDiscount = async (req, res, next) => {
    new CREATED({
      message: "Create discount success",
      metadata: await DiscountService.createDiscountCode(req.body),
    }).send(res);
  };

  updateDiscount = async (req, res, next) => {
    new OK({
      message: "Update discount success",
      metadata: await DiscountService.updateDiscountCode({
        discountId: req.params.discountId,
        payload: req.body,
      }),
    }).send(res);
  };

  getAllProductWidthDiscountCode = async (req, res, next) => {
    new OK({
      message: "Get products success",
      metadata: await DiscountService.getAllProductWithDiscount(req.query),
    }).send(res);
  };

  getAllDiscountOfShop = async (req, res, next) => {
    new OK({
      message: "Get all discount by shop success",
      metadata: await DiscountService.getAllDiscountOfShop(req.query),
    }).send(res);
  };
}

module.exports = new DiscountController();
