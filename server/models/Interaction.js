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
    },

    // Used to prevent accidental duplicate
    // view events
    dedupeKey: {
      type: String,
      unique: true,
      sparse: true
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