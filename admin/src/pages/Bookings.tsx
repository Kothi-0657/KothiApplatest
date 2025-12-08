import React, { useEffect, useState } from "react";
import { Table, Select, Button, Modal, Descriptions, Spin, message } from "antd";
import adminAPI from "../api/adminAPI";

const { Option } = Select;

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<any | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.get("/api/bookings");
      if (res.data.success) setBookings(res.data.bookings);
    } catch (err) {
      message.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const openDetails = async (id: string) => {
    try {
      const res = await adminAPI.get(`/api/bookings/${id}`);
      if (res.data.success) {
        setDetail(res.data.booking);
        setDetailVisible(true);
      }
    } catch {
      message.error("Failed to load booking details");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await adminAPI.patch(`/api/bookings/${id}/status`, { status });
      if (res.data.success) {
        message.success("Status updated");
        fetchBookings();
      }
    } catch {
      message.error("Failed to update status");
    }
  };

  const assignVendor = async (id: string, vendor_id: string) => {
    try {
      const res = await adminAPI.patch(`/api/bookings/${id}/vendor`, { vendor_id });
      if (res.data.success) {
        message.success("Vendor assigned");
        fetchBookings();
      }
      
    } catch {
      message.error("Failed to assign vendor");
    }
  };

  const columns = [
    { title: "Ref", dataIndex: "booking_ref", key: "booking_ref" },
    { title: "Customer", render: (r:any) => r.customer?.full_name || r.customer?.name || "—" },
    { title: "Service", render: (r:any) => r.service?.name || "—" },
    { title: "Vendor", render: (r:any) => r.vendor?.company_name || "Not Assigned" },
    { title: "Scheduled", dataIndex: "scheduled_at", render: (d:string)=> new Date(d).toLocaleString() },
    { title: "Price", dataIndex: "price", render: (p:number) => `₹${p}` },
    {
      title: "Status",
      render: (r:any) => (
        <Select value={r.status} style={{ width: 160 }} onChange={(v)=> updateStatus(r.id, v)}>
          <Option value="requested">Requested</Option>
          <Option value="pending">Pending</Option>
          <Option value="confirmed">Confirmed</Option>
          <Option value="completed">Completed</Option>
          <Option value="cancelled">Cancelled</Option>
        </Select>
      )
    },
    {
      title: "Actions",
      render: (r:any) => (
        <>
          <Button size="small" onClick={()=> openDetails(r.id)}>Details</Button>
        </>
      )
    }
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Bookings</h2>
      {loading ? <Spin /> : <Table rowKey="id" dataSource={bookings} columns={columns} pagination={{ pageSize: 10 }} />}
      <Modal visible={detailVisible} title="Booking Details" onCancel={()=> setDetailVisible(false)} footer={null} width={800}>
        {detail ? (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Booking Ref">{detail.booking_ref}</Descriptions.Item>
            <Descriptions.Item label="Customer">{detail.customer?.full_name}</Descriptions.Item>
            <Descriptions.Item label="Customer Phone">{detail.customer?.phone}</Descriptions.Item>
            <Descriptions.Item label="Service">{detail.service?.name}</Descriptions.Item>
            <Descriptions.Item label="Vendor">{detail.vendor?.company_name || "Not assigned"}</Descriptions.Item>
            <Descriptions.Item label="Scheduled At">{new Date(detail.scheduled_at).toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="Address">{JSON.stringify(detail.address)}</Descriptions.Item>
            <Descriptions.Item label="Notes">{detail.notes}</Descriptions.Item>
            <Descriptions.Item label="Payments">{JSON.stringify(detail.payments)}</Descriptions.Item>
          </Descriptions>
        ) : <Spin /> }
      </Modal>
    </div>
  );
};

export default Bookings;
