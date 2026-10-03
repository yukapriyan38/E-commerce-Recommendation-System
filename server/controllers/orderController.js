const Order = require("../models/Order");

const createOrder = async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      shippingAddress,
      paymentMethod
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty"
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        message: "Shipping address is required"
      });
    }

    const order = await Order.create({
      user: req.userId,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || "COD"
    });

    res.status(201).json({
      message: "Order placed successfully",
      order
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create order"
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.userId
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json({
      orders
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch orders"
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.userId
    }).populate("items.product");

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.json({
      order
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch order"
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById
};
