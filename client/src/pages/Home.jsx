import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Recommendations from "../components/Recommendations";

function Home() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <h1>Welcome to Our Store</h1>

      <p>
        Discover products recommended for you.
      </p>

      <Link to="/products">
        Browse Products
      </Link>

      {user && <Recommendations />}
    </div>
  );
}

export default Home;