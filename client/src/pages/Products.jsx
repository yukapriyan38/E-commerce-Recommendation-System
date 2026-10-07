import { useEffect, useState } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";

function Products() {
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/products", {
        params: {
          search: search || undefined,
          category: category || undefined
        }
      });

      setProducts(response.data.products);
    } catch (error) {
      console.error(error);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category]);

  return (
    <div className="products-page">

      <h1>All Products</h1>

      {/* Search and Filter */}
      <div className="product-filters">

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Shoes">Shoes</option>
          <option value="Books">Books</option>
          <option value="Beauty">Beauty</option>
          <option value="Home">Home</option>
          <option value="Sports">Sports</option>
        </select>

      </div>

      {loading && <p>Loading products...</p>}

      {error && <p className="error">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p>No products found.</p>
      )}

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
          />
        ))}
      </div>

    </div>
  );
}

export default Products;