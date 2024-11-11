"use strict";

const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Comment";
const COLLECTION_NAME = "Comments";

// Declare the Schema of the Mongo model
var commentSchema = new mongoose.Schema(
  {
    comment_productId: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
    },
    comment_userId: {
      type: String,
    },
    comment_content: {
      type: String,
      default: "text",
    },
    comment_left: {
      type: Number,
      default: 0,
    },
    comment_right: {
      type: Number,
      default: 0,
    },
    comment_parentId: {
      type: mongoose.Types.ObjectId,
      ref: DOCUMENT_NAME,
    },
    idDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, commentSchema);
