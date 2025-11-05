// src/pages/Bookings.tsx
import React, { useEffect, useState } from "react";
import adminAPI from "../api/adminAPI";
import DataTable from "../components/DataTable";

export default function Bookings(){
  const [bookings, setBookings] = useState<any[]>([]);
  const load = async ()=> {
    const res = await adminAPI.get("/bookings");
    setBookings(res.data.bookings);
  };
  useEffect(()=> { load(); }, []);

  const updateStatus = async (id:number) => {
    const newStatus = prompt("New status (initiated, in-progress, completed, cancelled)");
    if (!newStatus) return;
    await adminAPI.put(`/bookings/${id}`, { status: newStatus });
    load();
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "user_name", label: "User" },
    { key: "service_name", label: "Service" },
    { key: "vendor_name", label: "Vendor" },
    { key: "date", label: "Date" },
    { key: "status", label: "Status" },
    { key: "payment_status", label: "Payment" },
    { key: "actions", label: "Actions", render: (b:any) => <div><button onClick={()=>updateStatus(b.id)}>Change</button></div> }
  ];

  return (
    <div>
      <h2>Bookings</h2>
      <div style={{marginTop:16}}>
        <DataTable columns={columns as any} data={bookings as any} />
      </div>
    </div>
  );
}
