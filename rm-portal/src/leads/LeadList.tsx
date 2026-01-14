import React from "react";
import { Link } from "react-router-dom";

export default function LeadList() {
  return (
    <div>
      <h2>Assigned Leads</h2>

      {/* Replace with API data */}
      <ul>
        <li>
          <Link to="/leads/1">Lead #1 - New</Link>
        </li>
      </ul>
    </div>
  );
}
