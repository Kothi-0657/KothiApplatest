import React, { useEffect, useState } from "react";
import { Table, Tag, Button, message, Spin } from "antd";
import adminAPI from "../api/adminAPI";

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const res = await adminAPI.get("/admin/payments");
      if (res.data.success) {
        setPayments(res.data.payments || []);
      } else {
        message.error(res.data.message || "Failed to load payments");
      }
    } catch (err) {
      console.error(err);
      message.error("Error fetching payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleMarkPaid = async (id: string) => {
    try {
      const res = await adminAPI.put(`/admin/payments/${id}`, { payment_status: "paid" });
      if (res.data.success) {
        message.success("Payment marked as paid");
        fetchPayments();
      } else {
        message.error("Failed to update payment");
      }
    } catch (err) {
      message.error("Error updating payment");
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await adminAPI.get("/admin/payments/report", {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "payment_report.csv";
      link.click();
    } catch (error) {
      message.error("Error downloading report");
    }
  };

  const columns = [
    { title: "Customers", dataIndex: ["userId", "name"], key: "customers" },
    { title: "Email", dataIndex: ["userId", "email"], key: "email" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    {
      title: "Status",
      dataIndex: "payment_status",
      key: "payment_status",
      render: (status: string) =>
        status === "paid" ? (
          <Tag color="green">Paid</Tag>
        ) : (
          <Tag color="red">Pending</Tag>
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) =>
        record.payment_status !== "paid" && (
          <Button type="primary" onClick={() => handleMarkPaid(record._id)}>
            Mark Paid
          </Button>
        ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Payments</h2>
        <Button onClick={handleDownloadReport} type="default">
          Download CSV
        </Button>
      </div>
      {loading ? (
        <Spin />
      ) : (
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={payments}
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default Payments;
