"use strict";

const { BadRequestError } = require("../core/error.response");
const inventory = require("../models/inventory.model");
const ProductRepo = require("../models/repositories/product.repo");

class InventoryService {
  async addStockToInventory({
    stock,
    productId,
    shopId,
    location = "123 Da Nang",
  }) {
    const product = await ProductRepo.getProductById(productId);
    if (!product) throw new BadRequestError("the product does not exists");

    const query = { inven_shopId: shopId, inven_productId: productId },
      updateSet = {
        $inc: {
          inven_stock: stock,
        },
        $set: {
          inven_location: location,
        },
      },
      options = { upsert: true, new: true };

    return await inventory.findOneAndUpdate(query, updateSet, options);
  }
}

module.exports = new InventoryService();
