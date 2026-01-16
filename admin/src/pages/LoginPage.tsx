import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Input, Button, message, Typography } from "antd";
import axios from "axios";

const { Title } = Typography;

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      message.warning("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:4000/api/admin/auth/login",
        { email, password }
      );

      if (res.data?.success) {
        localStorage.setItem("admin_token", res.data.token);
        message.success("Welcome back, Admin!");
        navigate("/dashboard");
      } else {
        message.error(res.data?.message || "Login failed");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      message.error("Invalid credentials or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
        padding: 16,
      }}
    >
      <Card
        style={{
          width: 400,
          borderRadius: 20,
          boxShadow: "0 12px 25px rgba(0,0,0,0.15)",
          padding: "40px 30px",
          textAlign: "center",
          backgroundColor: "#ffffff",
        }}
      >
        <Title level={3} style={{ marginBottom: 32, color: "#333" }}>
          Kothi Admin Login
        </Title>

        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: 16, borderRadius: 8 }}
        />

        <Input.Password
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: 24, borderRadius: 8 }}
        />

        <Button
          type="primary"
          block
          onClick={handleLogin}
          loading={loading}
          style={{
            borderRadius: 10,
            padding: "8px 0",
            fontSize: 16,
            fontWeight: 500,
          }}
        >
          Login
        </Button>
      </Card>
    </div>
  );
};

export default LoginPage;
