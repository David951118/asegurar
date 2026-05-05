import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InventarioLayout from "./Layout";
import { EquiposService } from "../../Services/gpsApi";
import { Icon, InvTable, InvTag, useToast } from "./components";

export default function InventarioCentral() {
  return (
    <InventarioLayout
      title="Inventario central"
      subtitle="Equipos disponibles en Pasto + resumen por marca/modelo"
    >
      <Content />
    </InventarioLayout>
  );
}

function Content() {
  const navigate = useNavigate();
  const toast = useToast();
  const [data, setData] = useState({ equipos: [], resumen: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    setLoading(true);
    try {
      const res = await EquiposService.inventarioCentral();
      console.log("[InventarioCentral] Respuesta:", res);

      let equipos = [];
      let resumen = [];

      if (Array.isArray(res)) {
        equipos = res;
      } else if (res && typeof res === "object") {
        equipos = asArray(res.equipos) || asArray(res.items) || asArray(res.data) || [];
        resumen = asArray(res.resumen) || asArray(res.resumenPorModelo) || asArray(res.porModelo) || [];
      }

      setData({ equipos, resumen });
    } catch (err) {
      console.error("[InventarioCentral] Error:", err);
      toast.error("Error", err.response?.data?.message || "No se pudo cargar el inventario central");
      setData({ equipos: [], resumen: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <button className="inv-btn inv-btn-outline" onClick={cargar} disabled={loading}>
          {loading ? <span className="inv-spinner" /> : Icon.refresh}
          Actualizar
        </button>
      </div>

      {/* Resumen */}
      <div className="inv-card" style={{ marginBottom: 18 }}>
        <div className="inv-card-body">
          <h3>Resumen por marca / modelo</h3>
          <InvTable
            loading={loading}
            data={data.resumen}
            rowsPerPage={20}
            emptyMessage="Sin datos de resumen"
            columns={[
              { key: "marca", header: "Marca",
                render: (r) =>
                  r.marca?.nombre || r.marcaNombre || r._id?.marca?.nombre || r._id?.marca ||
                  (typeof r.marca === "string" ? r.marca : null) || "—" },
              { key: "modelo", header: "Modelo",
                render: (r) =>
                  r.modelo?.nombre || r.modeloNombre || r._id?.modelo?.nombre || r._id?.modelo ||
                  (typeof r.modelo === "string" ? r.modelo : null) || "—" },
              { key: "nuevos", header: "Nuevos", align: "right",
                render: (r) => r.nuevos ?? r.totalNuevos ?? 0 },
              { key: "segunda", header: "Segunda", align: "right",
                render: (r) => r.segunda ?? r.totalSegunda ?? 0 },
              { key: "total", header: "Total", align: "right",
                render: (r) => <strong>{r.total ?? r.count ?? ((r.nuevos || 0) + (r.segunda || 0))}</strong> },
            ]}
          />
        </div>
      </div>

      {/* Listado de equipos disponibles */}
      <div className="inv-card">
        <div className="inv-card-body">
          <h3>Equipos disponibles ({data.equipos.length})</h3>
          <InvTable
            loading={loading}
            data={data.equipos}
            rowsPerPage={25}
            emptyMessage="Sin equipos disponibles en la central"
            defaultSort={{ key: "imei", dir: "asc" }}
            columns={[
              { key: "imei", header: "IMEI", sortable: true,
                render: (r) => <strong style={{ fontSize: "0.86rem" }}>{r.imei}</strong> },
              { key: "serial", header: "Serial", render: (r) => r.serial || "—" },
              { key: "marca", header: "Marca / Modelo",
                render: (r) => `${r.marca?.nombre || ""} ${r.modelo?.nombre || ""}`.trim() || "—" },
              { key: "condicion", header: "Condición",
                render: (r) => <InvTag value={r.condicion} severity={r.condicion === "NUEVO" ? "info" : "neutral"} /> },
              { key: "yaUsado", header: "Ya usado",
                render: (r) => r.yaUsado ? <InvTag value="Sí" severity="warning" /> : <span style={{ color: "var(--text-muted)" }}>No</span> },
              { key: "acciones", header: "", width: 70,
                render: (r) => (
                  <button
                    className="inv-btn inv-btn-outline inv-btn-icon"
                    title="Ver detalle"
                    onClick={() => navigate(`/inventario/equipos/${r._id}`)}
                  >{Icon.eye}</button>
                ) },
            ]}
          />
        </div>
      </div>
    </>
  );
}

function asArray(v) {
  return Array.isArray(v) ? v : null;
}
