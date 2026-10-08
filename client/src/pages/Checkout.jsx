import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useCart } from "../context/CartContext";
import API from "../services/api";

function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    getCartTotal,
    clearCart
  } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        setError(
          "Please login before placing an order."
        );
        return;
      }

      // -----------------------------------------
      // Prepare order items
      // -----------------------------------------

      const orderItems = cartItems.map(
        (item) => ({
          product: item.product._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })
      );

      // -----------------------------------------
      // Create order
      // -----------------------------------------

      const response = await API.post(
        "/orders",
        {
          items: orderItems,
          totalAmount: getCartTotal(),
          shippingAddress: formData,
          paymentMethod: "COD"
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      // -----------------------------------------
      // Record purchase interactions
      // -----------------------------------------

      try {
        for (const item of cartItems) {
          await API.post(
            "/interactions",
            {
              product: item.product._id,
              type: "purchase"
            },
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );
        }
      } catch (interactionError) {
        // The order was already successfully
        // created, so don't treat this as an
        // order failure.
        console.error(
          "Failed to record purchase interaction:",
          interactionError
        );
      }

      // -----------------------------------------
      // Order completed
      // -----------------------------------------

      console.log(
        "Order response:",
        response.data
      );

      alert(
        "Order placed successfully!"
      );

      // Clear MongoDB cart
      await clearCart();

      // Go to My Orders
      navigate("/orders");

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to place order"
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // Empty cart
  // -----------------------------------------

  if (cartItems.length === 0) {
    return (
      <div className="checkout-container">
        <h1>Checkout</h1>

        <p>
          Your cart is empty.
        </p>

        <Link to="/products">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-container">

      {/* ================================
          CHECKOUT FORM
      ================================= */}

      <div className="checkout-form-section">

        <h1>Checkout</h1>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={handleChange}
            required
          />

          <h3>
            Payment Method
          </h3>

          <p>
            Cash on Delivery
          </p>

          {error && (
            <p className="error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Placing Order..."
              : "Place Order"}
          </button>

        </form>

      </div>

      {/* ================================
          ORDER SUMMARY
      ================================= */}

      <div className="checkout-summary">

        <h2>
          Order Summary
        </h2>

        {cartItems.map((item) => (
          <div
            className="checkout-item"
            key={item.product._id}
          >
            <p>
              {item.name} ×{" "}
              {item.quantity}
            </p>

            <p>
              ₹
              {item.price *
                item.quantity}
            </p>
          </div>
        ))}

        <hr />

        <h2>
          Total: ₹{getCartTotal()}
        </h2>

      </div>

    </div>
  );
}

export default Checkout;