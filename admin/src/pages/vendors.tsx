import React, { useEffect, useState } from "react";
import { Table, Select, Button, Modal, Descriptions, Spin, message } from "antd";
import adminAPI from "../api/adminAPI";

const { Option } = Select;

const Vendors: React.FC = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<any | null>(null);
  const [visible, setVisible] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.get("/api/vendors");
      if (res.data.success) setVendors(res.data.vendors);
    } catch {
      message.error("Failed to load vendors");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const changeStatus = async (id: string, status: string) => {
    try {
      const res = await adminAPI.put(`/api/vendors/${id}`, { status });
      if (res.data.success) {
        message.success("Vendor updated");
        fetch();
      }
    } catch {
      message.error("Failed to update vendor");
    }
  };

  const open = async (id: string) => {
    try {
      const res = await adminAPI.get(`/api/vendors/${id}`);
      if (res.data.success) {
        setDetail(res.data.vendor);
        setVisible(true);
      }
    } catch {
      message.error("Failed to load vendor");
    }
  };

  const columns = [
    { title: "Company", dataIndex: "company_name" },
    { title: "Contact", dataIndex: "contact_name" },
    { title: "Phone", dataIndex: "phone" },
    { title: "Email", dataIndex: "email" },
    { title: "Rating", dataIndex: "rating" },
    {
      title: "Status",
      render: (r: any) => (
        <Select
          value={r.status}
          onChange={(v) => changeStatus(r.id, v)}
          style={{ minWidth: 120 }}
        >
          <Option value="active">Active</Option>
          <Option value="inactive">Inactive</Option>
        </Select>
      ),
    },
    { title: "View", render: (r: any) => <Button size="small" onClick={() => open(r.id)}>View</Button> },
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

  const tableWrapperStyle: React.CSSProperties = {
    background: "#111827",
    borderRadius: 8,
    padding: 10,
    overflowX: "auto",
  };

  const tableHeaderStyle: React.CSSProperties = {
    backgroundColor: "#1f2937",
    color: "#fff",
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: 20 }}>Vendors</h2>

      {loading ? (
        <Spin size="large" />
      ) : (
        <div style={tableWrapperStyle}>
          <Table
            rowKey="id"
            dataSource={vendors}
            columns={columns}
            pagination={{ pageSize: 10 }}
            bordered
            scroll={{ x: 1000 }}
          />
        </div>
      )}

      <Modal
        visible={visible}
        title="Vendor Details"
        onCancel={() => setVisible(false)}
        footer={null}
        width={800}
      >
        {detail ? (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Company">{detail.company_name}</Descriptions.Item>
            <Descriptions.Item label="Contact">{detail.contact_name}</Descriptions.Item>
            <Descriptions.Item label="Phone">{detail.phone}</Descriptions.Item>
            <Descriptions.Item label="Email">{detail.email}</Descriptions.Item>
            <Descriptions.Item label="Address">{JSON.stringify(detail.address)}</Descriptions.Item>
            <Descriptions.Item label="Services">{JSON.stringify(detail.services_offered_details)}</Descriptions.Item>
            <Descriptions.Item label="Rating / Jobs">{detail.rating} / {detail.total_jobs}</Descriptions.Item>
          </Descriptions>
        ) : <Spin />}
      </Modal>
    </div>
  );
};

export default Vendors;
