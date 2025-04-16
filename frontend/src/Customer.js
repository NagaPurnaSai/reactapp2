import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./Customer.css"; // Add a CSS file for styling
import { FaCheck } from "react-icons/fa";

function Customer() {
  const { state } = useLocation();
  const { name, phone } = state || {};
  const [juices, setJuices] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("https://node-react-backend.vercel.app/juices")
      .then((res) => setJuices(res.data))
      .catch((err) => console.error("Error fetching juices", err));
  }, []);

  const addToCart = (juice) => {
    if (cart.includes(juice)) {
      setCart(cart.filter((item) => item !== juice));
    } else {
      setCart([...cart, juice]);
    }
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("Please select at least one juice before proceeding.");
      return;
    }
    await axios.post("https://node-react-backend.vercel.app/order", {
      name,
      phone,
      items: cart,
    });
    alert("Order placed successfully!");
    setCart([]);
  };

  const filteredJuices = juices.filter((juice) =>
    juice.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="customer-container">
      <h2>Welcome, {name}</h2>
      <input
        type="text"
        placeholder="Search for a juice..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-box"
      />
      <h3>Juices Menu</h3>
      <div className="juice-list">
        {filteredJuices.length > 0 ? (
          filteredJuices.map((juice) => (
            <div
              key={juice.id}
              className={`juice-item ${cart.includes(juice) ? "selected" : ""}`}
              onClick={() => addToCart(juice)}
            >
              <p>
                {juice.name} - ${juice.price.toFixed(2)}
              </p>
              {cart.includes(juice) && <FaCheck className="check-icon" />}
            </div>
          ))
        ) : (
          <p>No juices found.</p>
        )}
      </div>
      <button className="proceed-btn" onClick={placeOrder}>
        Proceed
      </button>
    </div>
  );
}

export default Customer;

