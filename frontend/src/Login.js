import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await axios.post("http://localhost:5000/login", { name, phone });
      navigate("/customer", { state: { name, phone } });
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div>
      <h2>Customer Login</h2>
      <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="Phone Number" onChange={(e) => setPhone(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;

