import React, { useState } from "react";

interface DataRow {
  id: string;
  name: string;
  amount: number;
}

const TableWithPagination = ({ data }: { data: DataRow[] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = data.slice(startIndex, startIndex + rowsPerPage);

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "12px", // smaller text
  };

  const thTdStyle: React.CSSProperties = {
    border: "1px solid #ccc", // table lines
    padding: "6px 8px",
    textAlign: "left",
  };

  return (
    <div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thTdStyle}>ID</th>
            <th style={thTdStyle}>Name</th>
            <th style={thTdStyle}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((row) => (
            <tr key={row.id}>
              <td style={thTdStyle}>{row.id}</td>
              <td style={thTdStyle}>{row.name}</td>
              <td style={thTdStyle}>{row.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div style={{ marginTop: "10px", display: "flex", justifyContent: "center", gap: "10px" }}>
        <button onClick={handlePrev} disabled={currentPage === 1}>⬅</button>
        <span style={{ fontSize: "12px" }}>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNext} disabled={currentPage === totalPages}>➡</button>
      </div>
    </div>
  );
};

export default TableWithPagination;
