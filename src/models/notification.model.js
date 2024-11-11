"use strict";

const mongoose = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "Notifications";

// ORDER-001: order successfully
// ORDER-002 order failed
// PROMOTION-001 new Promotion
// SHOP-001 new product by User following

// Declare the Schema of the Mongo model
var notificationSchema = new mongoose.Schema(
  {
    noti_type: {
      type: String,
      required: true,
      enum: ["ORDER-001", "ORDER-002", "PROMOTION-001", "SHOP-001"],
    },
    noti_senderId: {
      type: mongoose.Types.ObjectId,
      ref: "Shop",
    },
    noti_receivedId: {
      type: String,
      required: true,
    },
    noti_content: {
      type: String,
      required: true,
    },
    noti_options: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, notificationSchema);
