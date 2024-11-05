"use strict";

const { OK, CREATED, SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
  //ok
  async addToCart(req, res, next) {
    new CREATED({
      message: "Add to cart success!",
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  }
  //ok
  async getCart(req, res, next) {
    new OK({
      message: "get cart success!",
      metadata: await CartService.getListUserCart(req.query),
    }).send(res);
  }
  //ok
  async deleteItemCart(req, res, next) {
    new OK({
      message: "delete success!",
      metadata: await CartService.deleteUserCart(req.body),
    }).send(res);
  }

  async updateQuantityItem(req, res, next) {
    new OK({
      message: "update success!",
      metadata: await CartService.addToCartV2(req.body),
    }).send(res);
  }
}

module.exports = new CartController();
