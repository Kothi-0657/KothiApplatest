// admin/src/components/DataTable.tsx
import React, { useState } from "react";

export type Column = {
  title: string;
  dataIndex: string;
  render?: (value: any, record: any) => React.ReactNode;
};

type DataTableProps = {
  data: any[];
  columns: Column[];
  rowsPerPage?: number;
};

const DataTable: React.FC<DataTableProps> = ({ data, columns, rowsPerPage = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);
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
    fontSize: "12px",
  };

  const thTdStyle: React.CSSProperties = {
    border: "1px solid #ccc",
    padding: "6px 8px",
    textAlign: "left",
  };

  return (
    <div>
      <table style={tableStyle}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.dataIndex} style={thTdStyle}>{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentData.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={col.dataIndex} style={thTdStyle}>
                  {col.render ? col.render(row[col.dataIndex], row) : row[col.dataIndex]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div
        style={{
          marginTop: "10px",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          fontSize: "12px",
        }}
      >
        <button onClick={handlePrev} disabled={currentPage === 1}>
          ⬅
        </button>
        <span>
          Page {currentPage} of {totalPages || 1}
        </span>
        <button onClick={handleNext} disabled={currentPage === totalPages || totalPages === 0}>
          ➡
        </button>
      </div>
    </div>
  );
};

export default DataTable;
