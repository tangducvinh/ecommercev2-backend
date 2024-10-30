"use strict";

const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/product.model");
const slugify = require("slugify");
const { BadRequestError } = require("../core/error.response");
const ProductRepo = require("../models/repositories/product.repo");
const { removeUndefinedObject, updateNestedObjectParser } = require("../ultis");

// define factory class to create product
class ProductFactory {
  static productRegistry = {};

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static createProduct = async (type, payload) => {
    const productClass = this.productRegistry[type];
    if (!productClass) throw new BadRequestError("Invalid product type");
    return new productClass(payload).createProduct();
  };

  static updateProduct = async (type, payload, productId) => {
    const productClass = this.productRegistry[type];
    if (!productClass) throw new BadRequestError("Invalid product type");
    return new productClass(payload).updateProduct(productId);
  };

  //put
  static async publishProductByShop({ product_shop, product_id }) {
    return await ProductRepo.publishProductByShop({ product_shop, product_id });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await ProductRepo.unPublishProductByShop({
      product_shop,
      product_id,
    });
  }

  // query
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };

    return await ProductRepo.findAllDraftsForShop({ query, limit, skip });
  }

  static async findAllPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };

    return await ProductRepo.findAllPublishedForShop({ query, limit, skip });
  }

  static async searchProducts({ keySearch }) {
    return await ProductRepo.searchProductUser({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await ProductRepo.findAllProducts({
      limit,
      sort,
      page,
      filter,
      page,
      select: ["product_name", "product_price", "product_thumb"],
    });
  }

  static async findProduct({ product_slug }) {
    return await ProductRepo.findProduct(product_slug);
  }
}

// define base product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  // create new product
  async createProduct() {
    return await product.create(this);
  }

  // update product
  async updateProduct(productId, bodyUpdate) {
    return await ProductRepo.updateProductById({
      productId,
      bodyUpdate,
      model: product,
    });
  }
}

// Define sub-class for different product types Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create(this.product_attributes);
    if (!newClothing) throw new BadRequestError("Create new clothing error");

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("Create new Product error");

    return newProduct;
  }

  async updateProduct(productId) {
    const objectParams = removeUndefinedObject(this);

    if (objectParams.product_attribute) {
      // update child
      await ProductRepo.updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attribute),
        model: clothing,
      });
    }

    const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams.product_attribute));
    return updateProduct;
  }
}

// Define sub-class for different product types Electronic
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create(this.product_attributes);
    if (!newElectronic)
      throw new BadRequestError("Create new electronic error");

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("Create new Product error");

    return newProduct;
  }
}

// Define sub-class for different product types Furniture
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create(this.product_attributes);
    if (!newFurniture) throw new BadRequestError("Create new electronic error");

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("Create new Product error");

    return newProduct;
  }
}

// register product types
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory;
