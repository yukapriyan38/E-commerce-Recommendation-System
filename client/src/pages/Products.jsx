import { useEffect, useState } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";

function Products() {
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch products
  const fetchProducts = async (searchValue = search) => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/products", {
        params: {
          search: searchValue || undefined,
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

  // Search button
  const handleSearch = async () => {
    const query = search.trim();

    // If search box is empty
    if (!query) {
      await fetchProducts("");
      return;
    }

    // Fetch matching products
    await fetchProducts(query);

    // Record search interaction only for logged-in users
    if (user) {
      try {
        await API.post(
          "/interactions",
          {
            type: "search",
            searchQuery: query
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "token"
              )}`
            }
          }
        );
      } catch (error) {
        console.error(
          "Failed to record search interaction:",
          error
        );
      }
    }
  };

  // Load products when category changes
  useEffect(() => {
    fetchProducts();
  }, [category]);

  return (
    <div className="products-page">

      <h1>All Products</h1>

      {/* Search and Filter */}
      <div className="product-filters">

        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />

        <button
          type="button"
          onClick={handleSearch}
        >
          Search
        </button>

        {/* Category */}
        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >
          <option value="">
            All Categories
          </option>

          <option value="Electronics">
            Electronics
          </option>

          <option value="Clothing">
            Clothing
          </option>

          <option value="Shoes">
            Shoes
          </option>

          <option value="Books">
            Books
          </option>

          <option value="Beauty">
            Beauty
          </option>

          <option value="Home">
            Home
          </option>

          <option value="Sports">
            Sports
          </option>
        </select>

      </div>

      {/* Loading */}
      {loading && (
        <p>Loading products...</p>
      )}

      {/* Error */}
      {error && (
        <p className="error">
          {error}
        </p>
      )}

      {/* No Products */}
      {!loading &&
        !error &&
        products.length === 0 && (
          <p>
            No products found.
          </p>
        )}

      {/* Products */}
      {!loading && !error && (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      )}

    </div>
  );
}

export default Products;