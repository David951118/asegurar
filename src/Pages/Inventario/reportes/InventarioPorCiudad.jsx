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

  // El backend devuelve `tabla` como filas por ciudad con `modelos[]` anidado.
  // Lo aplanamos a una fila por (ciudad, modelo) para la tabla de detalle.
  const ciudadesData = data?.tabla || data?.items || (Array.isArray(data) ? data : []);
  const filas = [];
  for (const c of ciudadesData) {
    const ciudadNombre = c.ciudad?.nombre || c.ciudad || "—";
    const modelos = c.modelos || [];
    if (modelos.length === 0) {
      filas.push({
        ciudad: ciudadNombre, esCentral: c.esCentral,
        marca: "—", modelo: "—", nuevos: 0, segunda: 0,
        porEstado: c.porEstado || {}, total: c.totalEquipos ?? 0,
      });
    } else {
      for (const m of modelos) {
        filas.push({
          ciudad: ciudadNombre, esCentral: c.esCentral,
          marca: m.marca, modelo: m.modelo,
          nuevos: m.nuevos ?? 0, segunda: m.segunda ?? 0,
          porEstado: m.porEstado || {}, total: m.total ?? 0,
        });
      }
    }
  }
  const instalados = data?.instalados || null;

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

      <div className="inv-card">
        <div className="inv-card-body">
          <h3>Detalle ciudad → modelo</h3>
          <p style={{ margin: "0 0 12px", color: "var(--text-muted)", fontSize: "0.82rem" }}>
            Los equipos instalados no se cuentan dentro de ninguna ciudad; se listan aparte abajo.
          </p>
          <InvTable
            loading={loading}
            data={filas}
            rowsPerPage={30}
            emptyMessage="Sin datos"
            columns={[
              { key: "ciudad", header: "Ciudad",
                render: (r) => (
                  <span>
                    <strong>{r.ciudad || "—"}</strong>
                    {r.esCentral && <InvTag value="Central" severity="info" />}
                  </span>
                ) },
              { key: "marca", header: "Marca", render: (r) => r.marca || "—" },
              { key: "modelo", header: "Modelo", render: (r) => r.modelo || "—" },
              { key: "nuevos", header: "Nuevos", align: "right", render: (r) => r.nuevos ?? 0 },
              { key: "segunda", header: "Segunda", align: "right", render: (r) => r.segunda ?? 0 },
              { key: "disp", header: "Disp", align: "right",
                render: (r) => r.porEstado?.DISPONIBLE ?? 0 },
              { key: "trans", header: "Tránsito", align: "right",
                render: (r) => (r.porEstado?.EN_TRANSITO ?? 0) + (r.porEstado?.EN_POSESION_TECNICO ?? 0) },
              { key: "rev", header: "Revisión", align: "right",
                render: (r) => r.porEstado?.EN_REVISION ?? 0 },
              { key: "total", header: "Total", align: "right",
                render: (r) => <strong>{r.total ?? 0}</strong> },
            ]}
          />
        </div>
      </div>

      {filters.incluirInstalados && instalados && (
        <div className="inv-card" style={{ marginTop: 18 }}>
          <div className="inv-card-body">
            <h3>Instalados (fuera de ciudad) · {instalados.totalEquipos ?? 0}</h3>
            <p style={{ margin: "0 0 12px", color: "var(--text-muted)", fontSize: "0.82rem" }}>
              Equipos actualmente instalados en vehículos. No pertenecen al inventario de ninguna ciudad.
            </p>
            <InvTable
              loading={loading}
              data={instalados.modelos || []}
              rowsPerPage={30}
              emptyMessage="Sin equipos instalados"
              columns={[
                { key: "marca", header: "Marca", render: (r) => r.marca || "—" },
                { key: "modelo", header: "Modelo", render: (r) => r.modelo || "—" },
                { key: "nuevos", header: "Nuevos", align: "right", render: (r) => r.nuevos ?? 0 },
                { key: "segunda", header: "Segunda", align: "right", render: (r) => r.segunda ?? 0 },
                { key: "total", header: "Total", align: "right",
                  render: (r) => <strong>{r.total ?? 0}</strong> },
              ]}
            />
          </div>
        </div>
      )}
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
