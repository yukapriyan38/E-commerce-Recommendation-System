const express = require("express");
const router = express.Router();

const {
  getPersonalizedRecommendations
} = require("../controllers/recommendationController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getPersonalizedRecommendations);

module.exports = router;