"use strict";

const { OK, CREATED, SuccessResponse } = require("../core/success.response");
const InventoryService = require("../services/inventory.service");

class InventoryController {
  async addStockToInventory(req, res, next) {
    new SuccessResponse({
      message: "Add to cart success!",
      metadata: await InventoryService.addStockToInventory(req.body),
    }).send(res);
  }
}

module.exports = new InventoryController();
