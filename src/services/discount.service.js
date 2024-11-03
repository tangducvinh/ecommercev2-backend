"use strict";

const {
  BadRequestError,
  NotFoundError,
  ConflictRequestError,
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

    if (new Date(start_date) > new Date(end_date)) {
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

  async getDiscountAmount({ code, userId, shopId, productId, products }) {
    const foundDiscount = await DiscountRepo.checkDiscountExists({
      model: discount,
      filter: {
        discount_shopId: convertToObjectMongodb(shopId),
        discount_code: code,
      },
    });

    if (!foundDiscount) {
      throw new NotFoundError("Discount not exists!");
    }

    const {
      discount_is_active,
      discount_applies_to,
      discount_product_ids,
      discount_value,
      discount_type,
      discount_max_uses,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_users_used,
      _id,
    } = foundDiscount;

    if (
      discount_applies_to === "specific" &&
      !discount_product_ids.find((value) => value === productId)
    ) {
      throw new BadRequestError("Discount is not apply for this product");
    }

    if (!discount_is_active) {
      throw new ConflictRequestError("Discount invalid");
    }

    if (!discount_max_uses) {
      throw new BadRequestError("Discount are out!");
    }

    // check min value
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      // get total
      totalOrder = products.reduce(
        (acc, product) => acc + product.quantity * product.price,
        0
      );

      if (totalOrder < discount_min_order_value) {
        throw new BadRequestError(
          "discount requires a minium order value of",
          discount_min_order_value
        );
      }
    }

    // check max use per user
    let useUserDiscount = {};
    if (discount_max_uses_per_user > 0 && discount_users_used) {
      useUserDiscount = discount_users_used?.find(
        (user) => user.userId === userId
      );
      if (
        useUserDiscount &&
        useUserDiscount.amount >= discount_max_uses_per_user
      ) {
        throw new BadRequestError("User has used maximum discount amount");
      }
    }

    // check discount_type
    const newAmount = useUserDiscount?.discount_users_used.amount || 1;
    console.log({ totalOrder });
    const amount =
      discount_type === "fix_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);

    // update discount
    await discount.findByIdAndUpdate(
      _id,
      {
        $inc: { discount_max_uses: -1, discount_uses_count: 1 },
        $push: {
          discount_users_used: { userId, amount: newAmount },
        },
      },
      { new: true }
    );

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount <= 0 ? 0 : totalOrder - amount,
    };
  }

  async deleteDiscountCode({ shopId, code }) {
    return await discount.findOneAndDelete({
      discount_code: code,
      discount_shopId: convertToObjectMongodb(shopId),
    });
  }

  async cancelDiscountCode({ code, shopId, userId }) {
    const foundDiscount = await DiscountRepo.checkDiscountExists({
      model: discount,
      filter: {
        discount_code: code,
        discount_shopId: convertToObjectMongodb(shopId),
      },
    });

    if (!foundDiscount) throw BadRequestError("discount not exists");

    return await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: { userId },
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });

    return result;
  }
}

module.exports = new DiscountService();
