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
      const res = await adminAPI.get("/api/payments");
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
      render: (d: string) => <Tag color="#1f2937">{d.toUpperCase()}</Tag>,
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

  // ---------- Styles ----------
  const containerStyle: React.CSSProperties = {
    padding: 24,
    minHeight: "100vh",
    background: "#0d0d0d",
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    color: "#fff",
  };

  const searchStyle: React.CSSProperties = {
    marginBottom: 20,
    maxWidth: 500,
  };

  const tableStyle: React.CSSProperties = {
    background: "#111827",
    borderRadius: 8,
    overflow: "hidden",
  };

  const tableHeaderStyle: React.CSSProperties = {
    backgroundColor: "#1f2937",
    color: "#fff",
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: 20 }}>Payments</h2>

      <Search
        placeholder="Search by ref, booking, payer or payee"
        allowClear
        enterButton="Search"
        size="middle"
        value={searchText}
        onChange={(e) => onSearch(e.target.value)}
        onSearch={onSearch}
        style={searchStyle}
      />

      {loading ? (
        <Spin size="large" />
      ) : (
        <div style={tableStyle}>
          <Table
            dataSource={filteredPayments}
            rowKey="id"
            columns={columns}
            pagination={{ pageSize: 10 }}
            bordered
            style={{ color: "#fff" }}
            scroll={{ x: 1200 }}
          />
        </div>
      )}
    </div>
  );
};

export default Payments;
