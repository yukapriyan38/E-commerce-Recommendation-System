import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await API.get(
          "/orders/my-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setOrders(response.data.orders);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
          "Failed to load orders"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="orders-container">
        <h1>My Orders</h1>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-container">
        <h1>My Orders</h1>
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="orders-container">

      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <div>
          <p>You have not placed any orders yet.</p>

          <Link to="/products">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">

          {orders.map((order) => (
            <div
              className="order-card"
              key={order._id}
            >

              <div className="order-header">

                <div>
                  <h3>
                    Order #{order._id.slice(-6)}
                  </h3>

                  <p>
                    Date:{" "}
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p>
                    Status:{" "}
                    <strong>
                      {order.status}
                    </strong>
                  </p>

                  <p>
                    Payment:{" "}
                    {order.paymentMethod}
                  </p>
                </div>

              </div>

              <div className="order-items">

                {order.items.map((item, index) => (
                  <div
                    className="order-item"
                    key={index}
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                    />

                    <div>
                      <h4>{item.name}</h4>

                      <p>
                        ₹{item.price} ×{" "}
                        {item.quantity}
                      </p>
                    </div>

                    <p>
                      ₹
                      {item.price *
                        item.quantity}
                    </p>

                  </div>
                ))}

              </div>

              <div className="order-total">

                <strong>
                  Total: ₹{order.totalAmount}
                </strong>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Orders;
