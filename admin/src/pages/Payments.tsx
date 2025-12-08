import React, { useEffect, useState } from "react";
import { Table, Tag, Spin, Input, message } from "antd";
import adminAPI from "../api/adminAPI";

const { Search } = Input;

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  // Fetch all payments
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.get("/api/admin/payments");
      if (res.data.success) {
        setPayments(res.data.payments);
        setFilteredPayments(res.data.payments);
      }
    } catch (e) {
      console.error(e);
      message.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Handle search
  const onSearch = (value: string) => {
    setSearchText(value);
    if (!value) {
      setFilteredPayments(payments);
      return;
    }
    const filtered = payments.filter((p) =>
      (p.payment_ref || "").toLowerCase().includes(value.toLowerCase()) ||
      (p.booking_ref || "").toLowerCase().includes(value.toLowerCase()) ||
      (p.payer?.name || "").toLowerCase().includes(value.toLowerCase()) ||
      (p.payee?.name || "").toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPayments(filtered);
  };

  const columns = [
    { title: "Ref", dataIndex: "payment_ref", render: (ref: string) => ref || "—" },
    { title: "Booking", dataIndex: "booking_ref", render: (ref: string) => ref || "—" },
    {
      title: "Booking Date",
      dataIndex: "booking_date",
      render: (d: string) => (d ? new Date(d).toLocaleString() : "—"),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (a: string | number) =>
        `₹${Number(a).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    },
    { title: "Method", dataIndex: "method", render: (m: string) => m || "—" },
    {
      title: "Direction",
      dataIndex: "direction",
      render: (d: string) => <Tag>{d.toUpperCase()}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s: string) =>
        s === "success" || s === "completed" ? (
          <Tag color="green">{s.toUpperCase()}</Tag>
        ) : s === "failed" ? (
          <Tag color="red">{s.toUpperCase()}</Tag>
        ) : (
          <Tag color="orange">{s.toUpperCase()}</Tag>
        ),
    },
    {
      title: "Transaction ID",
      dataIndex: "transaction_id",
      render: (id: string) => id || "—",
    },
    {
      title: "Payer",
      dataIndex: "payer",
      render: (payer: any) =>
        payer ? (
          <>
            <div><b>{payer.name}</b></div>
            <div>{payer.phone}</div>
          </>
        ) : "—",
    },
    {
      title: "Payee",
      dataIndex: "payee",
      render: (payee: any) =>
        payee ? (
          <>
            <div><b>{payee.name}</b></div>
            <div>{payee.phone}</div>
          </>
        ) : "—",
    },
    {
      title: "Created",
      dataIndex: "created_at",
      render: (d: string) => (d ? new Date(d).toLocaleString() : "—"),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 15 }}>Payments</h2>

      <Search
        placeholder="Search by ref, booking, payer or payee"
        allowClear
        enterButton="Search"
        size="middle"
        value={searchText}
        onChange={(e) => onSearch(e.target.value)}
        onSearch={onSearch}
        style={{ marginBottom: 15, maxWidth: 400 }}
      />

      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          dataSource={filteredPayments}
          rowKey="id"
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default Payments;
