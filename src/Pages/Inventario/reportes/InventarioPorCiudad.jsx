import React, { useEffect, useState } from "react";
import InventarioLayout from "../Layout";
import { ReportesService } from "../../../Services/gpsApi";
import { Icon, InvTable, InvTag, useToast } from "../components";

export default function InventarioPorCiudad() {
  return (
    <InventarioLayout
      title="Inventario por ciudad"
      subtitle="Vista pivote ciudad → modelo con desglose por estado"
    >
      <Content />
    </InventarioLayout>
  );
}

function Content() {
  const toast = useToast();
  const [filters, setFilters] = useState({
    incluirInstalados: true,
    incluirEnTransito: true,
    incluirEnRevision: true,
  });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const cargar = async () => {
    setLoading(true);
    try {
      const res = await ReportesService.inventarioPorCiudad(filters);
      setData(res);
    } catch (err) {
      toast.error("Error", err.response?.data?.message || "No se pudo cargar el reporte");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabla = data?.tabla || data?.items || (Array.isArray(data) ? data : []);
  const resumenTexto = data?.resumenTexto || data?.resumen || "";

  return (
    <>
      <div className="inv-filters">
        <Toggle
          label="Incluir instalados"
          checked={filters.incluirInstalados}
          onChange={(v) => setFilters((f) => ({ ...f, incluirInstalados: v }))}
        />
        <Toggle
          label="Incluir en tránsito"
          checked={filters.incluirEnTransito}
          onChange={(v) => setFilters((f) => ({ ...f, incluirEnTransito: v }))}
        />
        <Toggle
          label="Incluir en revisión"
          checked={filters.incluirEnRevision}
          onChange={(v) => setFilters((f) => ({ ...f, incluirEnRevision: v }))}
        />
        <button className="inv-btn" onClick={cargar}>
          {Icon.search} Aplicar
        </button>
        <div className="spacer" />
        <button className="inv-btn inv-btn-outline" onClick={cargar} disabled={loading}>
          {loading ? <span className="inv-spinner" /> : Icon.refresh}
          Actualizar
        </button>
      </div>

      {resumenTexto && (
        <div className="inv-card" style={{ marginBottom: 18 }}>
          <div className="inv-card-body">
            <h3>Resumen rápido</h3>
            <p style={{
              margin: 0,
              color: "var(--text-secondary)",
              fontSize: "0.9rem",
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
              fontFamily: "ui-monospace, Menlo, Consolas, monospace",
              background: "var(--bg-tertiary)",
              padding: "12px 14px",
              borderRadius: 8,
              border: "1px solid var(--card-border)",
            }}>
              {resumenTexto}
            </p>
          </div>
        </div>
      )}

      <div className="inv-card">
        <div className="inv-card-body">
          <h3>Detalle ciudad → modelo</h3>
          <InvTable
            loading={loading}
            data={tabla}
            rowsPerPage={30}
            emptyMessage="Sin datos"
            columns={[
              { key: "ciudad", header: "Ciudad",
                render: (r) => (
                  <span>
                    <strong>{r.ciudad?.nombre || r.ciudad || "—"}</strong>
                    {(r.ciudad?.esCentral || r.esCentral) && (
                      <InvTag value="Central" severity="info" />
                    )}
                  </span>
                ) },
              { key: "marca", header: "Marca", render: (r) => r.marca?.nombre || r.marca || "—" },
              { key: "modelo", header: "Modelo", render: (r) => r.modelo?.nombre || r.modelo || "—" },
              { key: "nuevos", header: "Nuevos", align: "right", render: (r) => r.nuevos ?? 0 },
              { key: "segunda", header: "Segunda", align: "right", render: (r) => r.segunda ?? 0 },
              { key: "disp", header: "Disp", align: "right",
                render: (r) => r.porEstado?.DISPONIBLE ?? 0 },
              { key: "trans", header: "Tránsito", align: "right",
                render: (r) => r.porEstado?.EN_TRANSITO ?? 0 },
              { key: "inst", header: "Instalados", align: "right",
                render: (r) => r.porEstado?.INSTALADO ?? 0 },
              { key: "rev", header: "Revisión", align: "right",
                render: (r) => r.porEstado?.EN_REVISION ?? 0 },
              { key: "total", header: "Total", align: "right",
                render: (r) => <strong>{r.total ?? 0}</strong> },
            ]}
          />
        </div>
      </div>
    </>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      cursor: "pointer",
      padding: "8px 12px",
      border: "1px solid var(--card-border)",
      borderRadius: 8,
      background: checked ? "var(--accent-bg)" : "var(--bg-tertiary)",
      color: checked ? "var(--accent)" : "var(--text-secondary)",
      fontSize: "0.85rem",
      fontWeight: 500,
      userSelect: "none",
    }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: 14, height: 14, accentColor: "var(--accent)" }}
      />
      {label}
    </label>
  );
}
