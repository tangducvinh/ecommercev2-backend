"use strict";

const mongoose = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
  {
    order_userId: {
      type: String,
      required: true,
    },
    order_checkout: {
      type: Object,
      default: {},
    },
    order_shipping: {
      type: Object,
      default: {},
    },
    order_payment: {
      type: Object,
      default: {}
    },
    order_products: {
        type: Array,
        required: true
    },
    order_payment: {
        type: Object,
        default: {}
    },
    order_trackingNumber: {
        type: String,
        default: '#00000118052022'
    },
    order_status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'],
        default: 'pending'
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, orderSchema);
