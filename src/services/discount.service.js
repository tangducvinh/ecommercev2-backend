"use strict";

const {
  BadRequestError,
  NotF,
  NotFoundError,
} = require("../core/error.response");
const discount = require("../models/discount.model");
const { convertToObjectMongodb } = require("../ultis");
const ProductRepo = require("../models/repositories/product.repo");
const DiscountRepo = require("../models/repositories/discount.repo");

class DiscountService {
  async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      users_used,
      max_uses,
      uses_count,
      max_uses_per_user,
    } = payload;

    // check
    if (new Date() > new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError("Discount code has expired");
    }

    if (new Date(start_date) > new Date(start_date)) {
      throw new BadRequestError("Start date must be before end date");
    }

    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectMongodb(shopId),
      })
      .lean();
    if (foundDiscount && foundDiscount.discount_is_active === true) {
      throw new BadRequestError("Code exists");
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value || 0,
      discount_max_value: max_value,
      discount_shopId: shopId,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === "all" ? [] : product_ids,
    });

    return newDiscount;
  }

  async updateDiscountCode({ discountId, payload }) {
    return await discount.findByIdAndUpdate(discountId, payload, { new: true });
  }

  async getAllProductWithDiscount({ code, shopId, limit = 50, page = 1 }) {
    const foundDiscount = await discount.findOne({
      discount_code: code,
      discount_shopId: convertToObjectMongodb(shopId),
    });

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("discount not exists");
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    if (discount_applies_to === "all") {
      // get all product
      const products = await ProductRepo.findAllProducts({
        filter: {
          product_shop: convertToObjectMongodb(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });

      return products;
    } else if (discount_applies_to === "specific") {
      //get the products ids
      console.log("specific");
      const products = await ProductRepo.findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });

      console.log(products);

      return products;
    }
  }

  async getAllDiscountOfShop({ shopId, limit, page }) {
    return await DiscountRepo.findAllDiscountCodesSelect({
      filter: {
        discount_shopId: convertToObjectMongodb(shopId),
        discount_is_active: true,
      },
      limit: +limit,
      page: +page,
      model: discount,
      select: ["discount_name", "discount_code"],
    });
  }
}

module.exports = new DiscountService();
