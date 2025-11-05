// src/pages/Vendors.tsx
import React, { useEffect, useState } from "react";
import adminAPI from "../api/adminAPI";
import DataTable from "../components/DataTable";

export default function Vendors(){
  const [vendors, setVendors] = useState<any[]>([]);

  const load = async ()=> {
    const res = await adminAPI.get("/vendors");
    setVendors(res.data.vendors);
  };

  useEffect(()=> { load(); }, []);

  const remove = async (id:number) => {
    if(!confirm("Delete vendor?")) return;
    await adminAPI.delete(`/vendors/${id}`);
    load();
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "city", label: "City" },
    { key: "payment_pending", label: "Pending" },
    { key: "payment_done", label: "Paid" },
    { key: "actions", label: "Actions", render: (v:any) => (
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=> { const amt = Number(prompt("Add to paid amount", "0")); if(amt) adminAPI.put(`/vendors/${v.id}`, {...v, payment_done: (v.payment_done||0) + amt, payment_pending: Math.max(0,(v.payment_pending||0)-amt)}).then(load);}}>Settle</button>
        <button onClick={()=>remove(v.id)}>Delete</button>
      </div>
    )}
  ];

  return (
    <div>
      <h2>Vendors</h2>
      <div style={{marginTop:16}}>
        <DataTable columns={columns as any} data={vendors as any} />
      </div>
    </div>
  );
}
