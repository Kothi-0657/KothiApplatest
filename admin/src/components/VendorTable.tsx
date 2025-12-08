import React, { useState } from "react";
import { Table, Button, Modal, Input, message, Space } from "antd";
import axios from "axios";

interface Vendor {
  id: number;
  name: string;
  phone: string;
  service: string;
}

const VendorTable: React.FC<{ vendors: Vendor[]; fetchVendors: () => void }> = ({
  vendors,
  fetchVendors,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editing, setEditing] = useState<Vendor | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", service: "" });

  const showModal = (vendor?: Vendor) => {
    setEditing(vendor || null);
    setForm(vendor || { name: "", phone: "", service: "" });
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await axios.put(`http://localhost:4000/api/vendors/${editing.id}`, form);
        message.success("Vendor updated");
      } else {
        await axios.post("http://localhost:4000/api/vendors", form);
        message.success("Vendor added");
      }
      fetchVendors();
      setIsModalVisible(false);
    } catch {
      message.error("Error saving vendor");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:4000/api/vendors/${id}`);
      message.success("Vendor deleted");
      fetchVendors();
    } catch {
      message.error("Error deleting vendor");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Name", dataIndex: "name" },
    { title: "Phone", dataIndex: "phone" },
    { title: "Service", dataIndex: "service" },
    {
      title: "Actions",
      render: (_: any, record: Vendor) => (
        <Space>
          <Button onClick={() => showModal(record)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => showModal()}
      >
        Add Vendor
      </Button>
      <Table dataSource={vendors} columns={columns} rowKey="id" />

      <Modal
        title={editing ? "Edit Vendor" : "Add Vendor"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSave}
      >
        <Input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={{ marginBottom: 8 }}
        />
        <Input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          style={{ marginBottom: 8 }}
        />
        <Input
          placeholder="Service"
          value={form.service}
          onChange={(e) => setForm({ ...form, service: e.target.value })}
        />
      </Modal>
    </>
  );
};

export default VendorTable;
