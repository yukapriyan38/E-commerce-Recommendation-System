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

    // Product is required for product-related interactions
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

    // Search query is required for search interactions
    if (
      type === "search" &&
      !searchQuery
    ) {
      return res.status(400).json({
        message:
          "Search query is required"
      });
    }

    const interaction =
      await Interaction.create({
        user: req.userId,
        product: product || null,
        type,
        searchQuery:
          searchQuery || ""
      });

    res.status(201).json({
      message:
        "Interaction recorded successfully",
      interaction
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to record interaction"
    });
  }
};

module.exports = {
  createInteraction
};
