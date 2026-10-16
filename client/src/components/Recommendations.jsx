import { useCallback, useEffect, useState } from "react";
import API from "../services/api";
import ProductCard from "./ProductCard";

function Recommendations() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/recommendations");
      const recommendations = response.data.recommendations || [];

      const mappedProducts = recommendations.map((product) => ({
        ...product,
        _id: product.id,
        image: product.image || "",
        rating: product.rating ?? "N/A"
      }));

      setProducts(mappedProducts);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load recommendations. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return (
    <section className="recommendations-section">
      <div className="recommendations-header">
        <h2>Recommended for You</h2>

        <button
          type="button"
          onClick={fetchRecommendations}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh Recommendations"}
        </button>
      </div>

      {loading && <p>Finding products for you...</p>}

      {!loading && error && (
        <div>
          <p>{error}</p>
          <button type="button" onClick={fetchRecommendations}>
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <p>No personalized recommendations available yet.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="recommendations-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Recommendations;