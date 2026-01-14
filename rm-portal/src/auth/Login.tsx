// src/auth/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      // TEMP: simulate login
      if (email === "rm@test.com" && password === "password") {
        login("dummy-token", { id: "632badda-ad4d-4722-a2f9-ef50e44059b3", name: "RM Test User", email });
        navigate("/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>RM Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button style={{ padding: 10, width: "100%" }} onClick={handleLogin}>
        Login
      </button>
    </div>
  );
};

export default Login;
