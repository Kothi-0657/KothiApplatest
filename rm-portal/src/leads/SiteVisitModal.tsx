import React from "react";

export default function SiteVisitModal({ onClose }: { onClose: () => void }) {
  return (
    <div style={modalStyle}>
      <h3>Schedule Inspection</h3>

      <input type="datetime-local" />
      <input placeholder="Location" />

      <div style={{ marginTop: 10 }}>
        <button>Assign FRM</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

const modalStyle: React.CSSProperties = {
  position: "fixed",
  top: "20%",
  left: "50%",
  transform: "translateX(-50%)",
  background: "#fff",
  padding: 20,
  borderRadius: 8,
  width: 300,
};
