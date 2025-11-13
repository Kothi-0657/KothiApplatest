import React, { useEffect, useState } from "react";
import { Table, Tag, Select, message, Spin } from "antd";
import adminAPI from "../api/adminAPI";

const { Option } = Select;

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await adminAPI.get("/admin/bookings");
      if (res.data.success) {
        setBookings(res.data.bookings || []);
      } else {
        message.error(res.data.message || "Failed to load bookings");
      }
    } catch (err) {
      console.error(err);
      message.error("Error fetching bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await adminAPI.put(`/admin/bookings/${id}`, { status: newStatus });
      if (res.data.success) {
        message.success("Booking status updated");
        fetchBookings();
      } else {
        message.error("Failed to update status");
      }
    } catch (err) {
      message.error("Error updating booking status");
    }
  };

  const columns = [
    { title: "Customer", dataIndex: ["user", "name"], key: "customer" },
    { title: "Service", dataIndex: ["service", "title"], key: "service" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: any) => (
        <Select
          value={status}
          style={{ width: 120 }}
          onChange={(value) => handleStatusChange(record._id, value)}
        >
          <Option value="pending">Pending</Option>
          <Option value="confirmed">Confirmed</Option>
          <Option value="completed">Completed</Option>
          <Option value="cancelled">Cancelled</Option>
        </Select>
      ),
    },
    {
      title: "Payment",
      dataIndex: "payment_status",
      key: "payment_status",
      render: (status: string) =>
        status === "paid" ? (
          <Tag color="green">Paid</Tag>
        ) : (
          <Tag color="volcano">Unpaid</Tag>
        ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 20 }}>All Bookings</h2>
      {loading ? (
        <Spin />
      ) : (
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={bookings}
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default Bookings;
