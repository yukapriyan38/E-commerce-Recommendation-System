import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await API.get(`/products/${id}`);
        setProduct(response.data);

        if (user) {
  try {
    await API.post(
      "/interactions",
      {
        product: id,
        type: "view"
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "token"
          )}`
        }
      }
    );
  } 
  catch (error) {
    console.error(
      "Failed to record product view:",
      error
    );
  }
}
      } catch (error) {
        console.error(error);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <p>Loading product...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <div className="product-details-container">
      <div className="product-details-card">

        <div className="product-details-image">
          <img
            src={product.image}
            alt={product.name}
          />
        </div>

        <div className="product-details-info">
          <p className="product-brand">
            {product.brand}
          </p>

          <h1>{product.name}</h1>

          <p className="product-category">
            Category: {product.category}
          </p>

          <p className="product-price">
            ₹{product.price}
          </p>

          <p>
            ⭐ {product.rating}
          </p>

          <p className="product-description">
            {product.description}
          </p>

          <p>
            Stock: {product.stock}
          </p>

        <button
  className="add-to-cart-button"
  disabled={product.stock === 0}
  onClick={async () => {
    try {
      // Add product to the user's MongoDB cart
      await addToCart(product);

      // Record add-to-cart interaction
      if (user) {
        await API.post(
          "/interactions",
          {
            product: product._id,
            type: "add_to_cart"
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "token"
              )}`
            }
          }
        );
      }

      alert("Product added to cart");
    } catch (error) {
      console.error(
        "Failed to record add-to-cart interaction:",
        error
      );
    }
  }}
>
  {product.stock > 0
    ? "Add to Cart"
    : "Out of Stock"}
</button>

          <br />
          <br />

          <Link to="/products">
            ← Back to Products
          </Link>
        </div>

      </div>
    </div>
  );
}

export default ProductDetails;