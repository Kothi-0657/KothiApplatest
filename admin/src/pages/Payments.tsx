import React, { useEffect, useState } from "react";
import { Table, Tag, Spin, message } from "antd";
import adminAPI from "../api/adminAPI";

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.get("/api/payments");
      if (res.data.success) setPayments(res.data.payments);
    } catch {
      message.error("Failed to load payments");
    } finally { setLoading(false); }
  };

  useEffect(()=> { fetch(); }, []);

  const columns = [
    { title: "Ref", dataIndex: "payment_ref" },
    { title: "Booking", dataIndex: "booking_ref" },
    { title: "Amount", dataIndex: "amount", render: (a:number)=> `₹${a}` },
    { title: "Method", dataIndex: "method" },
    { title: "Direction", dataIndex: "direction" },
    {
      title: "Status",
      dataIndex: "status",
      render: (s:string) => s === "success" ? <Tag color="green">Success</Tag> : <Tag>{s}</Tag>
    },
    { title: "Created At", dataIndex: "created_at", render: (d:string)=> new Date(d).toLocaleString() }
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Payments</h2>
      {loading ? <Spin /> : <Table dataSource={payments} rowKey="id" columns={columns} pagination={{ pageSize: 12 }} />}
    </div>
  );
};

export default Payments;
