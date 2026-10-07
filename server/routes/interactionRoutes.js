const express = require("express");

const {
  createInteraction
} = require("../controllers/interactionController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  createInteraction
);

module.exports = router;