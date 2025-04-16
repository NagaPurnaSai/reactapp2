import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Admin.css"; // Ensure you create this file for styling

function Admin() {
  const [orders, setOrders] = useState([]);
  const [juices, setJuices] = useState([]);
  const [newJuice, setNewJuice] = useState({ name: "", price: "" });
  const [completedOrders, setCompletedOrders] = useState([]); // Added this state

  useEffect(() => {
    fetchOrders();
    fetchJuices();
  }, []);

  const fetchOrders = () => {
    axios.get("http://localhost:5000/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error fetching orders", err));
  };

  const fetchJuices = () => {
    axios.get("http://localhost:5000/juices")
      .then((res) => setJuices(res.data))
      .catch((err) => console.error("Error fetching juices", err));
  };

  const addJuice = () => {
    if (!newJuice.name || !newJuice.price) return alert("Please enter all fields");

    axios.post("http://localhost:5000/juices", newJuice)
      .then(() => {
        fetchJuices();
        setNewJuice({ name: "", price: "" });
      })
      .catch((err) => console.error("Error adding juice", err));
  };

  const deleteJuice = (id) => {
    axios.delete(`http://localhost:5000/juices/${id}`)
      .then(() => fetchJuices())
      .catch((err) => console.error("Error deleting juice", err));
  };

  const completeOrder = (id) => {
    const orderToComplete = orders.find(order => order.id === id);

    if (!orderToComplete) return;

    axios.delete(`http://localhost:5000/orders/${id}`)
      .then(() => {
        setOrders(orders.filter(order => order.id !== id)); // Remove from active orders
        setCompletedOrders([...completedOrders, orderToComplete]); // Add to completed orders
      })
      .catch((err) => console.error("Error completing order", err));
  };

  return (
    <div>
      <h2>Admin Panel - Orders</h2>

      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Items</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.name}</td>
              <td>{order.phone}</td>
              <td>
                <ul>
                  {order.items.map((item, i) => (
                    <li key={i}>{item.name} - ${item.price}</li>
                  ))}
                </ul>
              </td>
              <td><button disabled>In Process</button></td>
              <td>
                <button onClick={() => completeOrder(order.id)}>Completed</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Juices</h3>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price ($)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {juices.map((juice) => (
            <tr key={juice.id}>
              <td>{juice.id}</td>
              <td>{juice.name}</td>
              <td>{juice.price}</td>
              <td>
                <button onClick={() => deleteJuice(juice.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Add Juice</h3>
      <input
        type="text"
        placeholder="Juice Name"
        value={newJuice.name}
        onChange={(e) => setNewJuice({ ...newJuice, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Price"
        value={newJuice.price}
        onChange={(e) => setNewJuice({ ...newJuice, price: e.target.value })}
      />
      <button onClick={addJuice}>Add Juice</button>

      {completedOrders.length > 0 && (
        <>
          <h3>Completed Orders</h3>
          <table border="1">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Items</th>
              </tr>
            </thead>
            <tbody>
              {completedOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.name}</td>
                  <td>{order.phone}</td>
                  <td>
                    <ul>
                      {order.items.map((item, i) => (
                        <li key={i}>{item.name} - ${item.price}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default Admin;

