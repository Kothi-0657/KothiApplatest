import React from "react";

type TimelineItem = {
  id: number;
  title: string;
  time: string;
  description?: string;
};

export default function LeadTimeline({ events }: { events: TimelineItem[] }) {
  return (
    <div style={{ marginTop: 20 }}>
      <h3>Lead Timeline</h3>

      <div style={{ borderLeft: "2px solid #ddd", paddingLeft: 16 }}>
        {events.map((event) => (
          <div key={event.id} style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: "bold",
                color: "#0f172a",
              }}
            >
              {event.title}
            </div>

            <div style={{ fontSize: 12, color: "#6b7280" }}>
              {event.time}
            </div>

            {event.description && (
              <div style={{ marginTop: 4, fontSize: 13 }}>
                {event.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
