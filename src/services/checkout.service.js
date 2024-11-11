// "use strict";

// const CartRepo = require("../models/repositories/cart.repo");
// const ProductRepo = require("../models/repositories/product.repo");
// const DiscountService = require("../services/discount.service");
// const RedisService = require("../services/redis.service");
// const {
//   BadRequestError,
//   ConflictRequestError,
//   AuthFailureError,
//   NotFoundError,
// } = require("../core/error.response");
// const { releaseLock } = require("./redis.service");
// const order = require("../models/order.model");

// class CheckoutService {
//   // payload
//   /*
//     {
//       cartId,
//       userId,
//       shop_order_ids: [
//         {
//           shopId,
//           shop_discount: [],
//           item_products: [
//             {
//               price,
//               quantity,
//               productId
//             }
//           ]
//         },
//         {
//           shopId,
//           shop_discounts: [
//             {
//               "shopId",
//               "discountId",
//               "code": ,
//             }

//           ],
//           item_products: [
//             {
//               price,
//               quantity,
//               productId
//             }
//           ]
//         }

//       ]

//     }

//   */

//   // what is cartId used for?
//   // what is shop_order_ids
//   async checkoutReview({ cartId, userId, shop_order_ids }) {
//     // check cartId exist ?
//     const foundCart = await CartRepo.findCartById({ cartId });

//     if (!foundCart) throw new NotFoundError("cart not found");

//     // ok

//     const checkoutOrder = {
//         totalPrice: 0,
//         feeShip: 0,
//         totalDiscount: 0,
//         totalCheckout: 0,
//       },
//       shop_order_ids_new = [];

//     // sum bill money
//     for (let i = 0; i < shop_order_ids.length; i++) {
//       const {
//         shopId,
//         shop_discounts = [],
//         item_products = [],
//       } = shop_order_ids[i];

//       // check product available
//       const checkProductServer = await ProductRepo.checkProductByServer(
//         item_products
//       );
//       if (!checkProductServer[0]) throw new BadRequestError("order wrong");

//       const checkoutPrice = checkProductServer.reduce(
//         (acc, product) => acc + product.quantity * product.price,
//         0
//       );

//       // tong tien truoc khi xu li
//       checkoutOrder.totalPrice += checkoutPrice;

//       const itemCheckout = {
//         shopId,
//         shop_discounts,
//         priceRaw: checkoutPrice,
//         priceApplyDiscount: checkoutPrice,
//         item_products: checkProductServer,
//       };

//       if (shop_discounts.length > 0) {
//         // gia su chi co mot discount
//         // get amount discount
//         const { totalPrice = 0, discount = 0 } =
//           await DiscountService.getDiscountAmount({
//             code: shop_discounts[0].code,
//             userId,
//             shopId,
//             products: checkProductServer,
//           });

//         console.log({ discount });
//         // tong cong discount giam gia
//         checkoutOrder.totalDiscount += discount;

//         if (discount > 0) {
//           itemCheckout.priceApplyDiscount = checkoutPrice - discount;
//         }
//       }

//       checkoutOrder.totalCheckout += itemCheckout.priceApplyDiscount;
//       shop_order_ids_new.push(itemCheckout);
//     }

//     return {
//       shop_order_ids,
//       shop_order_ids_new,
//       checkout_order: checkoutOrder,
//     };
//   }

//   //order
//   async orderByUser({
//     shop_order_ids,
//     cartId,
//     userId,
//     user_address = {},
//     user_payment = {},
//   }) {
//     const { shop_order_ids_new, checkout_order } = await this.checkoutReview({
//       cartId,
//       userId,
//       shop_order_ids,
//     });

//     // check lai mot lan nua xem vuot ton kho hay khong
//     // get new array products
//     const products = shop_order_ids_new.flatMap((order) => order.item_products);

//     const acquireProduct = [];
//     for (const product of products) {
//       const { productId, quantity } = product;

//       const keyLock = await RedisService.acquireLock(
//         productId,
//         quantity,
//         cartId
//       );
//       acquireProduct.push(keyLock ? true : false);

//       if (keyLock) {
//         await RedisService.releaseLock(keyLock);
//       }
//     }

//     // check if co mot san pham het hang trong kho

//     if (acquireProduct.includes(false)) {
//       throw new BadRequestError("Mot so san pham da duoc cap nhat");
//     }

//     const newOrder = await order.create({
//       order_userId: userId,
//       order_checkout: checkout_order,
//       order_shipping: user_address,
//       order_payment: user_payment,
//       order_products: shop_order_ids_new,
//     });

//     if (newOrder) {
//       // remove product in my cart
//     }
//     return newOrder;
//   }

//   async getOrdersByUser() {

//   }

//   async getOneOrderByUser() {

//   }

//   async cancelORderByUser() {

//   }

//   async updateOrderStatusByShop() {

//   }
// }

// module.exports = new CheckoutService();
