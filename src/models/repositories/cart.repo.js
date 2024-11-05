"use strict";

const { template } = require("lodash");
const cart = require("../cart.model");

const findCartById = async ({ cartId }) => {
  return await cart.findById(cartId).lean();
};

const createUserCart = async ({ userId, product }) => {
  const query = { cart_userId: userId, cart_state: "active" };
  const updateOrInsert = {
    $addToSet: {
      cart_products: product,
    },
  };
  const options = { upsert: true, new: true };

  return await cart.findOneAndUpdate(query, updateOrInsert, options);
};

const addNewItemToCart = async ({ userId, product }) => {
  const query = { cart_userId: userId, cart_state: "active" };
  const update = {
    $addToSet: {
      cart_products: product,
    },
  };
  const options = { new: true };
  return await cart.updateOne(query, update, options);
};

const updateQuantityCart = async ({ userId, product }) => {
  const { productId, quantity } = product;
  const query = {
    cart_userId: userId,
    "cart_products.productId": productId,
    cart_state: "active",
  };
  const update = {
    $inc: { "cart_products.$.quantity": quantity },
  };
  const options = { new: true };

  return await cart.findOneAndUpdate(query, update, options);
};

module.exports = {
  createUserCart,
  updateQuantityCart,
  addNewItemToCart,
  findCartById,
};
