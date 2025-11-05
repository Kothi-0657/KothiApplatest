import React, { useEffect, useState } from "react";
import adminAPI from "../api/adminAPI";
import DataTable from "../components/DataTable";

type Service = {
  id: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
  city?: string;
  status: boolean;
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newService, setNewService] = useState({ name: "", price: "", city: "", category: "" });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await adminAPI.get("/services");
      if (res.data?.services) setServices(res.data.services);
      else setServices(res.data);
    } catch (err) {
      console.error("❌ Fetch services error", err);
      setError("Failed to fetch services. Please check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newService.name || !newService.price) {
      alert("Please fill in name and price");
      return;
    }
    try {
      setLoading(true);
      await adminAPI.post("/services", {
        name: newService.name,
        price: Number(newService.price),
        city: newService.city || null,
        category: newService.category || null,
      });
      setShowForm(false);
      setNewService({ name: "", price: "", city: "", category: "" });
      await fetchServices();
    } catch (err) {
      console.error("❌ Add service error", err);
      alert("Error adding service.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      await adminAPI.delete(`/services/${id}`);
      await fetchServices();
    } catch (err) {
      console.error("❌ Delete service error", err);
      alert("Failed to delete service.");
    }
  };

  const handlePriceUpdate = async (s: Service) => {
    const newPrice = prompt(`Update price for ${s.name}`, String(s.price));
    if (!newPrice) return;
    try {
      await adminAPI.put(`/services/${s.id}`, { ...s, price: Number(newPrice) });
      await fetchServices();
    } catch (err) {
      console.error("❌ Update price error", err);
    }
  };

  const columns = [
    { key: "name", label: "Service" },
    { key: "price", label: "Price", render: (r: Service) => `₹${r.price}` },
    { key: "city", label: "City" },
    { key: "category", label: "Category" },
    { key: "status", label: "Status", render: (r: Service) => (r.status ? "✅ Active" : "❌ Inactive") },
    {
      key: "actions",
      label: "Actions",
      render: (r: Service) => (
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => handlePriceUpdate(r)}>Edit Price</button>
          <button onClick={() => handleDelete(r.id)}>Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={{ color: "#d4af37" }}>🧰 Manage Services</h2>
        <button style={styles.addButton} onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close Form" : "Add Service"}
        </button>
      </div>

      {showForm && (
        <div style={styles.form}>
          <input
            type="text"
            placeholder="Service Name"
            value={newService.name}
            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price (₹)"
            value={newService.price}
            onChange={(e) => setNewService({ ...newService, price: e.target.value })}
          />
          <input
            type="text"
            placeholder="City (optional)"
            value={newService.city}
            onChange={(e) => setNewService({ ...newService, city: e.target.value })}
          />
          <input
            type="text"
            placeholder="Category (optional)"
            value={newService.category}
            onChange={(e) => setNewService({ ...newService, category: e.target.value })}
          />
          <button onClick={handleAdd}>Save Service</button>
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        {loading && <div>Loading services...</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}
        {!loading && !error && (
          <DataTable columns={columns as any} data={services as any} />
        )}
      </div>
    </div>
  );
}

/* 🎨 Styles */
const styles: Record<string, React.CSSProperties> = {
  container: { padding: 24, color: "#fff" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  addButton: {
    background: "#d4af37",
    color: "#000",
    border: "none",
    padding: "8px 16px",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 600,
  },
  form: {
    display: "flex",
    gap: 8,
    background: "#1a1a1a",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
};
