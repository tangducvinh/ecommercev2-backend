"use strict";

const ProductService = require("../services/product.service");
const { SuccessResponse } = require("../core/success.response");

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new product success",
      metadata: await ProductService.createProduct(
        req.body.product_type,
        req.body
      ),
    }).send(res);
  };

  // update product
  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "update product success",
      metadata: await ProductService.updateProduct(
        req.body.product_type,
        req.body,
        req.params.productId
      ),
    }).send(res);
  };

  // query
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list Draft success",
      metadata: await ProductService.findAllDraftsForShop({
        product_shop: req.keyStore.shop,
      }),
    }).send(res);
  };

  getAllPublishedForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list Published success",
      metadata: await ProductService.findAllPublishedForShop({
        product_shop: req.keyStore.shop,
      }),
    }).send(res);
  };

  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "search product success",
      metadata: await ProductService.searchProducts(req.params),
    }).send(res);
  };

  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "search product success",
      metadata: await ProductService.findAllProducts(req.query),
    }).send(res);
  };

  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "search success",
      metadata: await ProductService.findProduct({
        product_slug: req.params.product_slug,
      }),
    }).send(res);
  };

  publishedProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "published product success",
      metadata: await ProductService.publishProductByShop({
        product_shop: req.keyStore.shop,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  unPublishedProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "unpublish product success",
      metadata: await ProductService.unPublishProductByShop({
        product_shop: req.keyStore.shop,
        product_id: req.params.id,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
