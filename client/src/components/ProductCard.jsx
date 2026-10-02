import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <div className="product-card">

      <img
        src={product.image}
        alt={product.name}
        className="product-image"
      />

      <div className="product-info">

        <p className="product-brand">
          {product.brand}
        </p>

        <h3>{product.name}</h3>

        <p className="product-category">
          {product.category}
        </p>

        <p className="product-price">
          ₹{product.price}
        </p>

        <p>
          ⭐ {product.rating}
        </p>

        <Link to={`/products/${product._id}`}>
          View Product
        </Link>

      </div>

    </div>
  );
}

export default ProductCard;
