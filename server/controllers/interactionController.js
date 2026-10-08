const Interaction = require("../models/Interaction");

const createInteraction = async (req, res) => {
  try {
    const {
      product,
      type,
      searchQuery
    } = req.body;

    const allowedTypes = [
      "view",
      "search",
      "add_to_cart",
      "remove_from_cart",
      "purchase"
    ];

    // Check interaction type
    if (!type) {
      return res.status(400).json({
        message: "Interaction type is required"
      });
    }

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        message: "Invalid interaction type"
      });
    }

    // Product is required for product interactions
    const productRequiredTypes = [
      "view",
      "add_to_cart",
      "remove_from_cart",
      "purchase"
    ];

    if (
      productRequiredTypes.includes(type) &&
      !product
    ) {
      return res.status(400).json({
        message:
          "Product is required for this interaction"
      });
    }

    // Search query is required for searches
    if (
      type === "search" &&
      !searchQuery
    ) {
      return res.status(400).json({
        message:
          "Search query is required"
      });
    }

    // -----------------------------------------
    // Create a dedupe key for product views
    // -----------------------------------------

    let dedupeKey;

    if (type === "view") {
      /*
        Create a 5-second time bucket.

        Example:

        18:30:01.100
        18:30:01.102

        Both belong to the same bucket.

        Therefore they get the same dedupeKey.
      */

      const timeBucket =
        Math.floor(Date.now() / 5000);

      dedupeKey =
        `${req.userId}_${product}_${type}_${timeBucket}`;
    }

    // -----------------------------------------
    // Create interaction
    // -----------------------------------------

    try {
      const interaction =
        await Interaction.create({
          user: req.userId,
          product: product || null,
          type,
          searchQuery:
            searchQuery || "",
          dedupeKey
        });

      return res.status(201).json({
        message:
          "Interaction recorded successfully",
        interaction
      });
    } catch (error) {
      // Duplicate dedupeKey
      if (error.code === 11000) {
        const existingInteraction =
          await Interaction.findOne({
            dedupeKey
          });

        return res.status(200).json({
          message:
            "Duplicate view ignored",
          interaction:
            existingInteraction
        });
      }

      throw error;
    }
  } catch (error) {
    console.error(
      "Interaction error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to record interaction"
    });
  }
};

module.exports = {
  createInteraction
};