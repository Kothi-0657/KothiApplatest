// src/pages/rm/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logoa4.png";
import { rmApi } from "../api/rmApi";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      // ✅ Email-only login
      const data = await rmApi("/rm/auth/login", {
        method: "POST",
        body: { email },
      });

      if (!data?.token || !data?.user) {
        setError("Invalid RM account");
        return;
      }

      // ✅ Save RM token
      localStorage.setItem("rm_token", data.token);
      login(data.token, data.user);

      navigate("/dashboard");
    } catch (err: any) {
      console.error("RM login error:", err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.glassCard}>
        <img src={logo} alt="Company Logo" style={styles.logo} />
        <h2 style={styles.title}>RM Login</h2>

        {error && <p style={styles.error}>{error}</p>}

        <input
          style={styles.input}
          type="email"
          placeholder="Enter your company email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          style={styles.button}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default Login;

/* ===================== STYLES ===================== */
const styles: any = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #020617, #0f172a, #020617)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  glassCard: {
    width: 380,
    padding: 30,
    borderRadius: 16,
    background: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    boxShadow: "0 10px 40px rgba(0,0,0,.5)",
    textAlign: "center",
  },
  logo: {
    width: 170,
    marginBottom: 10,
  },
  title: { color: "#E5E7EB", marginBottom: 20 },
  error: { color: "#EF4444", marginBottom: 10 },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,.2)",
    background: "rgba(15,23,42,.8)",
    color: "#fff",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
};
