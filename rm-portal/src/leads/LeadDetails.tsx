import React, { useState } from "react";
import LeadTimeline from "./LeadTimeline";
import CallLogModal from "./CallLogModal";
import FollowUpModal from "./FollowUpModal";
import SiteVisitModal from "./SiteVisitModal";

export default function LeadDetails() {
  const [showCallLog, setShowCallLog] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [showVisit, setShowVisit] = useState(false);

  // MOCK DATA (later comes from API)
  const lead = {
    customerName: "Rahul Sharma",
    phone: "+91 98765 43210",
    status: "CONTACTED",
    subStatus: "Call Done",
  };

  const timeline = [
    {
      id: 1,
      title: "Lead Created",
      time: "10 Jan 2026, 10:30 AM",
    },
    {
      id: 2,
      title: "Call Logged",
      time: "10 Jan 2026, 11:00 AM",
      description: "Customer interested in full home painting",
    },
    {
      id: 3,
      title: "Follow-up Created",
      time: "12 Jan 2026, 4:00 PM",
      description: "Send quotation after inspection",
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      {/* HEADER */}
      <div
        style={{
          padding: 16,
          background: "#f8fafc",
          borderRadius: 8,
        }}
      >
        <h2>{lead.customerName}</h2>
        <p>📞 {lead.phone}</p>
        <p>
          <strong>Status:</strong> {lead.status} |{" "}
          <strong>Sub-status:</strong> {lead.subStatus}
        </p>
      </div>

      {/* ACTION BUTTONS */}
      <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
        <button onClick={() => setShowCallLog(true)}>📞 Log Call</button>
        <button onClick={() => setShowFollowUp(true)}>⏰ Follow-up</button>
        <button onClick={() => setShowVisit(true)}>📍 Inspection</button>
      </div>

      {/* TIMELINE */}
      <LeadTimeline events={timeline} />

      {/* MODALS */}
      {showCallLog && <CallLogModal onClose={() => setShowCallLog(false)} />}
      {showFollowUp && (
        <FollowUpModal onClose={() => setShowFollowUp(false)} />
      )}
      {showVisit && <SiteVisitModal onClose={() => setShowVisit(false)} />}
    </div>
  );
}
