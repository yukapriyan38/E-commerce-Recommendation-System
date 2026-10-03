import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cartItems,
    loading,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    getCartTotal,
    getCartCount
  } = useCart();

  if (loading) {
    return (
      <div className="cart-container">
        <h1>Shopping Cart</h1>
        <p>Loading cart...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <h1>Shopping Cart</h1>

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
    <div className="cart-container">
      <h1>Shopping Cart</h1>

      <div className="cart-items">
        {cartItems.map((item) => (
          <div
            className="cart-item"
            key={item.product._id}
          >
            <img
              src={item.image}
              alt={item.name}
              className="cart-item-image"
            />

            <div className="cart-item-info">
              <h3>{item.name}</h3>

              <p>
                ₹{item.price}
              </p>

              <div className="quantity-controls">
                <button
                  onClick={() =>
                    decreaseQuantity(
                      item.product._id
                    )
                  }
                >
                  -
                </button>

                <span>
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    increaseQuantity(
                      item.product._id
                    )
                  }
                >
                  +
                </button>
              </div>

              <p>
                Item Total: ₹
                {item.price *
                  item.quantity}
              </p>

              <button
                className="remove-button"
                onClick={() =>
                  removeFromCart(
                    item.product._id
                  )
                }
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>
          Total Items: {getCartCount()}
        </h3>

        <h2>
          Total: ₹{getCartTotal()}
        </h2>

        <Link
          to="/checkout"
          className="checkout-button"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}

export default Cart;