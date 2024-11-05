"use strict";

/*
    Key features: Cart Service
    - add product to card [user]
    - reduce product quantity by one
    - increase product quantity by one
    - get cart 
    - delete cart
    - delete item cart
*/

const cart = require("../models/cart.model");
const CartRepo = require("../models/repositories/cart.repo");
const ProductRepo = require("../models/repositories/product.repo");
const { convertToObjectMongodb } = require("../ultis");

const {
  BadRequestError,
  ConflictRequestError,
  AuthFailureError,
  NotFoundError,
} = require("../core/error.response");

class CartService {
  //ok
  async addToCart({ userId, product = {} }) {
    const { productId } = product;
    const userCart = await cart.findOne({ cart_userId: userId });

    // check for cart existence
    if (!userCart) {
      return await CartRepo.createUserCart({ userId, product });
    }

    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    if (!userCart.cart_products.some((item) => item.productId === productId)) {
      return await CartRepo.addNewItemToCart({ userId, product });
    }

    return await CartRepo.updateQuantityCart({ userId, product });
  }

  /*
    shop_order_ids: [
        {
            shopId,
            item_products: [
                {
                    quantity,
                    price,
                    shopId,
                    old_quantity,
                    productId
                }
            ],
            version
        }
    ]


  */
  //
  async addToCartV2({ userId, shop_order_ids }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0].item_products[0];

    const foundProduct = await ProductRepo.getProductById(productId);
    if (!foundProduct) throw new NotFoundError("Product is not exists");

    if (foundProduct.product_shop.toString() !== shop_order_ids[0].shopId) {
      throw new NotFoundError("Product do not belong to the shop");
    }

    if (quantity === 0) {
      CartService.deleteUserCart({ userId });
    }

    return await CartRepo.updateQuantityCart({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  // ok
  async deleteUserCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: "active" };
    const updateSet = {
      $pull: {
        cart_products: { productId },
      },
    };

    return await cart.updateOne(query, updateSet, { new: true });
  }

  // ok
  async getListUserCart({ userId }) {
    return await cart
      .findOne({
        cart_userId: userId,
      })
      .lean();
  }
}

module.exports = new CartService();
