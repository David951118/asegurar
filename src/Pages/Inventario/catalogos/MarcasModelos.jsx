import React, { useState } from "react";
import InventarioLayout from "../Layout";
import Marcas from "./Marcas";
import Modelos from "./Modelos";

const TABS = [
  { key: "marcas", label: "Marcas" },
  { key: "modelos", label: "Modelos" },
];

export default function MarcasModelos() {
  const [tab, setTab] = useState("marcas");

  return (
    <InventarioLayout
      title="Marcas y modelos"
      subtitle="Catálogo de fabricantes y modelos de equipos GPS"
    >
      <div className="inv-tabs" style={tabsStyle}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`inv-tab ${tab === t.key ? "active" : ""}`}
            style={{
              ...tabBtnStyle,
              ...(tab === t.key ? tabActiveStyle : {}),
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Reusamos las páginas; pero como cada una incluye su propio Layout, las renderizamos en modo embebido */}
      {tab === "marcas" ? <Marcas embedded /> : <Modelos embedded />}
    </InventarioLayout>
  );
}

const tabsStyle = {
  display: "flex",
  gap: 4,
  marginBottom: 18,
  borderBottom: "1px solid var(--card-border)",
};

const tabBtnStyle = {
  background: "transparent",
  borderTop: "none",
  borderLeft: "none",
  borderRight: "none",
  borderBottomWidth: 2,
  borderBottomStyle: "solid",
  borderBottomColor: "transparent",
  padding: "10px 18px",
  cursor: "pointer",
  fontSize: "0.9rem",
  fontWeight: 600,
  color: "var(--text-muted)",
  fontFamily: "inherit",
  transition: "color 0.15s, border-color 0.15s",
  marginBottom: -1,
};

const tabActiveStyle = {
  color: "var(--accent)",
  borderBottomColor: "var(--accent)",
};
