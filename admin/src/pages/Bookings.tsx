import React, { useEffect, useState } from "react";
import {
  Table,
  Select,
  Button,
  Modal,
  Descriptions,
  Spin,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import adminAPI from "../api/adminAPI";

const { Option } = Select;

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [detail, setDetail] = useState<any | null>(null);
  const [detailVisible, setDetailVisible] = useState<boolean>(false);

  // ---------------- FETCH BOOKINGS ----------------
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.get("/api/bookings");
      if (res.data?.success) {
        setBookings(res.data.bookings || []);
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ---------------- DETAILS ----------------
  const openDetails = async (id: string) => {
    try {
      const res = await adminAPI.get(`/api/bookings/${id}`);
      if (res.data?.success) {
        setDetail(res.data.booking);
        setDetailVisible(true);
      }
    } catch {
      message.error("Failed to load booking details");
    }
  };

  // ---------------- STATUS UPDATE ----------------
  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await adminAPI.patch(`/api/bookings/${id}/status`, { status });
      if (res.data?.success) {
        message.success("Status updated");
        fetchBookings();
      }
    } catch {
      message.error("Failed to update status");
    }
  };

  // ---------------- TABLE COLUMNS ----------------
  const columns: ColumnsType<any> = [
    {
      title: "Ref",
      dataIndex: "booking_ref",
      key: "booking_ref",
      width: 140,
    },
    {
      title: "Customer",
      key: "customer",
      width: 180,
      render: (_, record) =>
        record.customer?.full_name || record.customer?.name || "—",
    },
    {
      title: "Service",
      key: "service",
      width: 160,
      render: (_, record) => record.service?.name || "—",
    },
    {
      title: "Vendor",
      key: "vendor",
      width: 180,
      render: (_, record) =>
        record.vendor?.company_name || "Not Assigned",
    },
    {
      title: "Scheduled",
      dataIndex: "scheduled_at",
      key: "scheduled_at",
      width: 200,
      render: (d: string) =>
        d ? new Date(d).toLocaleString() : "—",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (p: number) => `₹${p}`,
    },
    {
      title: "Status",
      key: "status",
      width: 160,
      render: (_, record) => (
        <Select
          value={record.status}
          style={{ width: "100%" }}
          onChange={(v) => updateStatus(record.id, v)}
        >
          <Option value="requested">Requested</Option>
          <Option value="pending">Pending</Option>
          <Option value="confirmed">Confirmed</Option>
          <Option value="completed">Completed</Option>
          <Option value="cancelled">Cancelled</Option>
        </Select>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Button size="small" onClick={() => openDetails(record.id)}>
          Details
        </Button>
      ),
    },
  ];

  // ---------------- RENDER ----------------
  return (
    <div
      style={{
        width: "100%",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2 style={{ color: "#fff", marginBottom: 16 }}>Bookings</h2>

      <div
        style={{
          flex: 1,
          width: "100%",
          overflowX: "auto",
        }}
      >
        {loading ? (
          <Spin />
        ) : (
          <Table
            rowKey="id"
            dataSource={bookings}
            columns={columns}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1400 }}
            bordered
          />
        )}
      </div>

      {/* ---------------- DETAILS MODAL ---------------- */}
      <Modal
        open={detailVisible}
        title="Booking Details"
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={720}
        destroyOnClose
      >
        {detail ? (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Booking Ref">
              {detail.booking_ref}
            </Descriptions.Item>
            <Descriptions.Item label="Customer">
              {detail.customer?.full_name}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {detail.customer?.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Service">
              {detail.service?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Vendor">
              {detail.vendor?.company_name || "Not assigned"}
            </Descriptions.Item>
            <Descriptions.Item label="Scheduled At">
              {new Date(detail.scheduled_at).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {JSON.stringify(detail.address)}
            </Descriptions.Item>
            <Descriptions.Item label="Notes">
              {detail.notes || "—"}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <Spin />
        )}
      </Modal>
    </div>
  );
};

export default Bookings;
