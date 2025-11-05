// src/pages/Payments.tsx
import React, { useEffect, useState } from "react";
import adminAPI from "../api/adminAPI";
import DataTable from "../components/DataTable";

export default function Payments(){
  const [payments, setPayments] = useState<any[]>([]);

  const load = async ()=> {
    const res = await adminAPI.get("/payments");
    setPayments(res.data.payments);
  };

  useEffect(()=> { load(); }, []);

  const markPaid = async (id:number) => {
    await adminAPI.put(`/payments/${id}`, { payment_status: "paid" });
    load();
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "user_name", label: "User" },
    { key: "amount", label: "Amount", render: (r:any)=> `₹ ${r.amount}` },
    { key: "payment_status", label: "Status" },
    { key: "payment_method", label: "Method" },
    { key: "created_at", label: "Date" },
    { key: "actions", label: "Actions", render: (r:any)=> (
      <div>
        {r.payment_status !== "paid" && <button onClick={()=>markPaid(r.id)}>Mark Paid</button>}
      </div>
    ) }
  ];

  return (
    <div>
      <h2>Payments</h2>
      <div style={{marginTop:16}}>
        <DataTable columns={columns as any} data={payments as any} />
      </div>
    </div>
  );
}
