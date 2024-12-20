"use strict";

const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    usr_slug: {
      type: String,
      required: true,
    },
    usr_name: {
      type: String,
      required: true,
    },
    usr_password: {
      type: String,
      required: true,
    },
    usr_salf: {
      type: String,
      default: "",
    },
    usr_email: {
      type: String,
      required: true,
    },
    usr_phone: {
      type: String,
      default: "",
    },
    usr_sex: {
      type: String,
      default: "",
    },
    usr_avatar: {
      type: String,
      default: "",
    },
    usr_date_of_birth: {
      type: Date,
      default: "",
    },
    usr_role: {
      type: mongoose.Types.ObjectId,
      ref: "Role",
    },
    usr_status: {
      type: String,
      default: "pending",
      enum: ["pending", "active", "block"],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, userSchema);
