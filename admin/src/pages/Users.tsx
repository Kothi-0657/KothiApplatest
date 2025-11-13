import React, { useEffect, useState } from "react";
import { Table, Tag, message, Spin } from "antd";
import adminAPI from "../api/adminAPI";

const Users: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await adminAPI.get("/admin/users");
      if (res.data.success) {
        setUsers(res.data.users || []);
      } else {
        message.error(res.data.message || "Failed to load users");
      }
    } catch (err) {
      console.error(err);
      message.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) =>
        isActive ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 20 }}>Registered Users</h2>
      {loading ? (
        <Spin />
      ) : (
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={users}
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default Users;
