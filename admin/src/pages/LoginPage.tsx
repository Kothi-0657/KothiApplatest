import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Input, Button, message } from "antd";
import axios from "axios";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log("Login button clicked");
    try {
     const res = await axios.post("http://localhost:4000/api/admin/auth/login", {
  email,
  password,
});

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
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #dfe9f3 0%, #ffffff 100%)",
      }}
    >
      <Card
        title="Kothi Admin Login"
        style={{ width: 380, textAlign: "center", borderRadius: 16 }}
      >
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <Input.Password
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Button
          type="primary"
          block
          onClick={handleLogin}
          style={{ borderRadius: 8 }}
        >
          Login
        </Button>
      </Card>
    </div>
  );
};

export default LoginPage;
