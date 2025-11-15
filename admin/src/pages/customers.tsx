import { useEffect, useState } from "react";
import { fetchCustomers, updateCustomersStatus, deleteCustomers } from "../api/adminAPI";

interface Customers {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customers[]>([]);

  const loadCustomers = async () => {
    try {
      const list = await fetchCustomers();
      setCustomers(list);
    } catch (err) {
      console.error("Error loading Customers:", err);
      alert("Failed to load Customers");
    }
  };

  const handleStatus = async (id: string, status: string) => {
    try {
      await updateCustomersStatus(id, status);
      loadCustomers();
    } catch (err) {
      alert("Failed to update user");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete customers?")) return;
    await deleteCustomers(id);
    loadCustomers();
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  return (
    <div style={{ padding: 20, color: "#fff" }}>
      <h2>Customers</h2>
      <table style={{ width: "100%", background: "#fff", color: "#000" }}>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th></th>
          </tr>
        </thead>
        <tbody>
          {customers.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.phone}</td>
              <td>
                <select
                  value={u.status}
                  onChange={(e) => handleStatus(u.id, e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleDelete(u.id)} style={{ color: "red" }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
