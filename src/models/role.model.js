"use strict";

const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Role";
const COLLECTION_NAME = "Roles";

// Declare the Schema of the Mongo model
var roleSchema = new mongoose.Schema(
  {
    rol_name: {
      type: String,
      required: true,
      default: "user",
      enum: ["user", "shop", "admin"],
    },
    rol_lug: {
      type: String,
      required: true,
    },
    rol_status: {
      type: String,
      required: true,
      default: "acttive",
      enum: ["active", "block", "pending"],
    },
    rol_description: {
      type: String,
      default: "",
    },
    rol_grants: [
      {
        resource: {
          type: mongoose.Types.ObjectId,
          ref: "Resource",
          required: true,
        },
        actions: [
          {
            type: String,
            required: true,
          },
        ],
        attributes: { type: String, default: "" },
      },
    ],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, roleSchema);
