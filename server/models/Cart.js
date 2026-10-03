const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },

        name: {
          type: String,
          required: true
        },

        price: {
          type: Number,
          required: true
        },

        image: {
          type: String,
          default: ""
        },

        quantity: {
          type: Number,
          required: true,
          min: 1
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Cart", cartSchema);
