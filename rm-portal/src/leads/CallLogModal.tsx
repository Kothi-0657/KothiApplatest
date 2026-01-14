import React from "react";

export default function CallLogModal({ onClose }: { onClose: () => void }) {
  return (
    <div style={modalStyle}>
      <h3>Log Call</h3>

      <textarea placeholder="Call notes" rows={4} />
      <select>
        <option>Interested</option>
        <option>Not Interested</option>
        <option>Call Later</option>
      </select>

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
