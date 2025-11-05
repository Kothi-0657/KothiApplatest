// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import Users from "./pages/Users";
import Payments from "./pages/Payments";
import Vendors from "./pages/vendors";
import Bookings from "./pages/Bookings";

/**
 * NOTE:
 * - This is a simple routing layout. Add auth gating if required.
 */

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="services" element={<Services />} />
          <Route path="users" element={<Users />} />
          <Route path="payments" element={<Payments />} />
          <Route path="vendors" element={<Vendors />} />
          <Route path="bookings" element={<Bookings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
