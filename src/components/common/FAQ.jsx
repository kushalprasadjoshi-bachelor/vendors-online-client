import { useState } from "react";

const FAQ = ({ items = [] }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex((cur) => (cur === i ? null : i));

  return (
    <div>
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: "1px solid var(--line)" }}>
          <button
            type="button"
            onClick={() => toggle(i)}
            style={{
              width: "100%",
              padding: "12px 16px",
              textAlign: "left",
              background: "transparent",
              border: 0,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontWeight: 700 }}>{item.q}</span>
            <span>{openIndex === i ? "-" : "+"}</span>
          </button>
          {openIndex === i && (
            <div style={{ padding: "12px 16px", color: "var(--muted)" }}>
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQ;
