const axios = require("axios");

const getPersonalizedRecommendations = async (req, res) => {
  try {
    // Get the authenticated user's ID from your existing middleware
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "User authentication required"
      });
    }

    // Request personalized recommendations from Flask
    const response = await axios.get(
      `http://127.0.0.1:5001/recommendations/${userId}`,
      { timeout: 15000 }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "Recommendation API error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      message: "Failed to fetch personalized recommendations"
    });
  }
};

module.exports = {
  getPersonalizedRecommendations
};