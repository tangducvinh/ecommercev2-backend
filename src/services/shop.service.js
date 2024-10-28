"use strict";

const shopModel = require("../models/shop.model");
const { Types } = require("mongoose");

class ShopService {
  static findByEmail = async ({
    email,
    select = { email: 1, password: 1, name: 1, status: 1, roles: 1 },
  }) => {
    return await shopModel.findOne({ email }).select(select).lean();
  };

  static findById = async (shopId) => {
    return await shopModel.findById({ _id: new Types.ObjectId(shopId) });
  };
}

module.exports = ShopService;
