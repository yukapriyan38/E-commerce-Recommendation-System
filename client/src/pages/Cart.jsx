import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    getCartTotal,
    getCartCount
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <h1>Your Cart</h1>

        <p>Your cart is empty.</p>

        <Link to="/products">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>

      <p className="cart-count">
        {getCartCount()} item(s) in your cart
      </p>

      <div className="cart-items">
        {cartItems.map((item) => (
          <div
            className="cart-item"
            key={item._id}
          >
            <img
              src={item.image}
              alt={item.name}
              className="cart-item-image"
            />

            <div className="cart-item-info">
              <h3>{item.name}</h3>

              <p>{item.brand}</p>

              <p>₹{item.price}</p>

              <div className="quantity-controls">
                <button
                  onClick={() =>
                    decreaseQuantity(item._id)
                  }
                >
                  −
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() =>
                    increaseQuantity(item._id)
                  }
                >
                  +
                </button>
              </div>

              <p>
                Item Total: ₹
                {item.price * item.quantity}
              </p>

              <button
                className="remove-button"
                onClick={() =>
                  removeFromCart(item._id)
                }
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h2>Cart Summary</h2>

        <p>
          Total Items: {getCartCount()}
        </p>

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

      <Link to="/products">
        ← Continue Shopping
      </Link>
    </div>
  );
}

export default Cart;