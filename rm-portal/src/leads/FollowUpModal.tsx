import React from "react";

export default function FollowUpModal({ onClose }: { onClose: () => void }) {
  return (
    <div style={modalStyle}>
      <h3>Create Follow-up</h3>

      <input type="date" />
      <textarea placeholder="Follow-up note" rows={3} />

      <div style={{ marginTop: 10 }}>
        <button>Save</button>
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
