const Product = require("../models/Product");

// Get all products
const getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;

    let filter = {};

    // Search by product name
    if (search) {
      filter.name = {
        $regex: search,
        $options: "i"
      };
    }

    // Filter by category
    if (category) {
      filter.category = {
        $regex: `^${category}$`,
        $options: "i"
      };
    }

    const products = await Product.find(filter).sort({
      createdAt: -1
    });

    res.json({
      count: products.length,
      products
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch products"
    });
  }
};


// Get single product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json(product);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch product"
    });
  }
};


// Create product
const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      brand,
      price,
      description,
      tags,
      image,
      stock
    } = req.body;

    if (
      !name ||
      !category ||
      !brand ||
      price === undefined ||
      !description
    ) {
      return res.status(400).json({
        message: "Please provide all required product fields"
      });
    }

    const product = await Product.create({
      name,
      category,
      brand,
      price,
      description,
      tags,
      image,
      stock
    });

    res.status(201).json({
      message: "Product created successfully",
      product
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create product"
    });
  }
};


// Update product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json({
      message: "Product updated successfully",
      product
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update product"
    });
  }
};


// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json({
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete product"
    });
  }
};


module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};