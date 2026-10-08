import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import API from "../services/api";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const resetCartState = () => {
    setCartItems([]);
  };

  // Fetch logged-in user's cart
  const fetchCart = async () => {
    const currentToken = localStorage.getItem("token");

    if (!currentToken) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      const response = await API.get("/cart", {
        headers: {
          Authorization: `Bearer ${currentToken}`
        }
      });

      setCartItems(response.data.cart.items || []);
    } catch (error) {
      console.error(
        "Failed to fetch cart:",
        error
      );

      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Load cart when user is logged in
  useEffect(() => {
    fetchCart();
  }, []);

  // Add product
 const addToCart = async (product) => {
  try {
    const currentToken =
      localStorage.getItem("token");

    if (!currentToken) {
      alert("Please login first");
      return false;
    }

    const response = await API.post(
      "/cart/add",
      {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image
      },
      {
        headers: {
          Authorization: `Bearer ${currentToken}`
        }
      }
    );

    setCartItems(
      response.data.cart.items
    );

    return true;
  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
      "Failed to add product to cart"
    );

    return false;
  }
};

  // Remove product
const removeFromCart = async (productId) => {
  try {
    const currentToken =
      localStorage.getItem("token");

    if (!currentToken) {
      return false;
    }

    const response = await API.delete(
      `/cart/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${currentToken}`
        }
      }
    );

    setCartItems(
      response.data.cart.items
    );

    return true;
  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
      "Failed to remove product"
    );

    return false;
  }
};

  // Increase quantity
  const increaseQuantity = async (productId) => {
    try {
      const currentToken =
        localStorage.getItem("token");

      const item = cartItems.find(
        (item) =>
          item.product._id === productId
      );

      if (!item) return;

      const response = await API.put(
        `/cart/${productId}`,
        {
          quantity: item.quantity + 1
        },
        {
          headers: {
            Authorization: `Bearer ${currentToken}`
          }
        }
      );

      setCartItems(
        response.data.cart.items
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to update quantity"
      );
    }
  };

  // Decrease quantity
  const decreaseQuantity = async (productId) => {
    try {
      const currentToken =
        localStorage.getItem("token");

      const item = cartItems.find(
        (item) =>
          item.product._id === productId
      );

      if (!item) return;

      if (item.quantity === 1) {
        await removeFromCart(productId);
        return;
      }

      const response = await API.put(
        `/cart/${productId}`,
        {
          quantity: item.quantity - 1
        },
        {
          headers: {
            Authorization: `Bearer ${currentToken}`
          }
        }
      );

      setCartItems(
        response.data.cart.items
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to update quantity"
      );
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      const currentToken =
        localStorage.getItem("token");

      await API.delete("/cart", {
        headers: {
          Authorization: `Bearer ${currentToken}`
        }
      });

      setCartItems([]);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to clear cart"
      );
    }
  };

  // Calculate total
  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) =>
        total +
        item.price * item.quantity,
      0
    );
  };

  // Calculate item count
  const getCartCount = () => {
    return cartItems.reduce(
      (count, item) =>
        count + item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        getCartTotal,
        getCartCount,
        clearCart,
        refreshCart: fetchCart,
        resetCartState
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}