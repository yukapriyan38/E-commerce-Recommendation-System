import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { user, logout } = useAuth();
  const { resetCartState } = useCart();

  const navigate = useNavigate();

  const handleLogout = () => {
    resetCartState();

    logout();

    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">Home</Link>

        <Link to="/products">
          Products
        </Link>

        {user && (
          <Link to="/cart">
            Cart
          </Link>
        )}

        {user && (
          <Link to="/orders">
            My Orders
          </Link>
        )}
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <span>
              Hello, {user.name}
            </span>

            <button
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;