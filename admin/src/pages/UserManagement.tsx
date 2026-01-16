// src/pages/UsersManagement.tsx
import { useEffect, useState } from "react";
import {
  fetchRMs,
  fetchFRMs,
  createRM,
  createFRM,
  deleteUser,
  toggleUserStatus,
} from "../api/adminAPI";

/* =====================
   Types
===================== */
interface User {
  id: string;
  email: string;
  status: "active" | "inactive";
}

/* =====================
   Component
===================== */
export default function UsersManagement() {
  const [rmList, setRmList] = useState<User[]>([]);
  const [frmList, setFrmList] = useState<User[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"RM" | "FRM">("RM");
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);

  /* =====================
     Load Users
  ===================== */
  const loadUsers = async () => {
    try {
      setLoading(true);
      const [rms, frms] = await Promise.all([fetchRMs(), fetchFRMs()]);
      setRmList(rms);
      setFrmList(frms);
    } catch (err) {
      console.error("Error loading users:", err);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  /* =====================
     Add User
  ===================== */
  const handleAddUser = async () => {
    if (!newEmail.trim()) {
      alert("Email is required");
      return;
    }

    if (!newEmail.endsWith("@kothiindia.com")) {
      alert("Only @kothiindia.com emails are allowed");
      return;
    }

    try {
      if (modalType === "RM") {
        await createRM({ email: newEmail });
      } else {
        await createFRM({ email: newEmail });
      }

      setNewEmail("");
      setModalVisible(false);
      loadUsers();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add user");
    }
  };

  /* =====================
     Delete User
  ===================== */
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await deleteUser(id);
      loadUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  /* =====================
     Toggle Status
  ===================== */
  const handleToggle = async (id: string) => {
    try {
      await toggleUserStatus(id);
      loadUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  /* =====================
     Styles
  ===================== */
  const containerStyle: React.CSSProperties = {
    padding: 24,
    minHeight: "100vh",
    background: "#0d0d0d",
    color: "#fff",
  };

  const boxStyle: React.CSSProperties = {
    background: "#111827",
    padding: 16,
    borderRadius: 8,
    marginBottom: 32,
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const th: React.CSSProperties = {
    padding: 12,
    borderBottom: "1px solid #444",
    textAlign: "left",
  };

  const td: React.CSSProperties = {
    padding: 12,
    borderBottom: "1px solid #333",
  };

  const btn = (bg: string): React.CSSProperties => ({
    padding: "6px 12px",
    borderRadius: 4,
    border: "none",
    cursor: "pointer",
    background: bg,
    color: "#fff",
    marginRight: 8,
  });

  /* =====================
     Render Table
  ===================== */
  const renderTable = (users: User[], type: "RM" | "FRM") => (
    <div style={boxStyle}>
      <h3>{type} Users</h3>

      <button
        style={btn("#0d6efd")}
        onClick={() => {
          setModalType(type);
          setModalVisible(true);
        }}
      >
        Add {type}
      </button>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={th}>Email</th>
            <th style={th}>Status</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={3} style={{ ...td, textAlign: "center", color: "#888" }}>
                No users found
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u.id}>
                <td style={td}>{u.email}</td>
                <td style={td}>{u.status}</td>
                <td style={td}>
                  <button
                    style={btn(u.status === "active" ? "#6c757d" : "#198754")}
                    onClick={() => handleToggle(u.id)}
                  >
                    {u.status === "active" ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    style={btn("#dc3545")}
                    onClick={() => handleDelete(u.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  /* =====================
     JSX
  ===================== */
  return (
    <div style={containerStyle}>
      <h2>User Management</h2>

      {loading && <p style={{ color: "#aaa" }}>Loading users...</p>}

      {renderTable(rmList, "RM")}
      {renderTable(frmList, "FRM")}

      {/* Modal */}
      {modalVisible && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#111827",
              padding: 24,
              borderRadius: 8,
              width: 400,
            }}
          >
            <h3>Add {modalType}</h3>

            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="email@kothiindia.com"
              style={{
                width: "100%",
                padding: 10,
                marginBottom: 16,
                background: "#0d0d0d",
                color: "#fff",
                border: "1px solid #555",
              }}
            />

            <div style={{ textAlign: "right" }}>
              <button
                style={btn("#6c757d")}
                onClick={() => setModalVisible(false)}
              >
                Cancel
              </button>
              <button style={btn("#0d6efd")} onClick={handleAddUser}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
