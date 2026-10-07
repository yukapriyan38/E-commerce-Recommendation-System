const mongoose = require("mongoose");

const interactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: false
    },

    type: {
      type: String,
      enum: [
        "view",
        "search",
        "add_to_cart",
        "remove_from_cart",
        "purchase"
      ],
      required: true
    },

    searchQuery: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Interaction",
  interactionSchema
);