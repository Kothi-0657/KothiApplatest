// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import Customers from "./pages/customers";
import Payments from "./pages/Payments";
import Vendors from "./pages/vendors";
import Bookings from "./pages/Bookings";
import LoginPage from "./pages/LoginPage";

export default function App() {
  const isAuthenticated = !!localStorage.getItem("admin_token");

  return (
    <BrowserRouter>
      <Routes>
        {/* Login route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected admin layout */}
        {isAuthenticated ? (
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="services" element={<Services />} />
            <Route path="customers" element={<Customers />} />
            <Route path="payments" element={<Payments />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="bookings" element={<Bookings />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}
