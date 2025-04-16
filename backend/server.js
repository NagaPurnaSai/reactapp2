const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

let orders = [
  { id: 1, name: "John Doe", phone: "1234567890", items: [{ name: "Orange Juice", price: 5 }], date: new Date().toISOString() },
];
let completedOrders = [];
let juices = [];

app.get("/orders", (req, res) => res.json(orders));
app.get("/completed-orders", (req, res) => res.json(completedOrders));
app.get("/juices", (req, res) => res.json(juices));

app.post("/juices", (req, res) => {
  const juice = { id: juices.length + 1, ...req.body };
  juices.push(juice);
  res.json(juice);
});

app.post("/complete-order", (req, res) => {
  const orderIndex = orders.findIndex(order => order.id === req.body.id);
  if (orderIndex === -1) return res.status(404).json({ error: "Order not found" });

  const completedOrder = { ...orders[orderIndex], completedDate: req.body.completedDate };
  completedOrders.push(completedOrder);
  orders.splice(orderIndex, 1);

  res.json({ message: "Order marked as completed", completedOrder });
});

app.delete("/juices/:id", (req, res) => {
  juices = juices.filter(juice => juice.id !== parseInt(req.params.id));
  res.json({ message: "Juice deleted" });
});

app.listen(5000, () => console.log("Server running on port 5000"));

