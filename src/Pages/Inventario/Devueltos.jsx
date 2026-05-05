import React, { useEffect, useMemo, useState } from "react";
import InventarioLayout from "./Layout";
import GpsService from "../../Services/gpsApi";
import { Icon, InvTable, InvTag, useToast } from "./components";

export default function Devueltos() {
  return (
    <InventarioLayout
      title="Equipos devueltos al cliente"
      subtitle="Histórico de equipos retirados y entregados al propietario"
    >
      <Content />
    </InventarioLayout>
  );
}

function Content() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    setLoading(true);
    try {
      const res = await GpsService.reporteDevueltos();
      const list = Array.isArray(res) ? res : res?.equipos || res?.items || [];
      setItems(list);
    } catch (err) {
      toast.error("Error", err.response?.data?.message || "No se pudo cargar el reporte");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter((r) => {
      const text = [
        r.imei,
        r.propietarioNombre,
        r.marca?.nombre,
        r.modelo?.nombre,
        r.actividadDevolucion?.placaInstalada,
        r.actividadDevolucion?.tecnico?.nombres,
        r.actividadDevolucion?.tecnico?.apellidos,
      ].filter(Boolean).join(" ").toLowerCase();
      return text.includes(q);
    });
  }, [items, search]);

  return (
    <div className="inv-card">
      <div className="inv-card-body">
        <div className="inv-filters">
          <div>
            <strong style={{ color: "var(--text-primary)", fontSize: "1rem" }}>{items.length}</strong>{" "}
            <span style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
              equipos en estado DEVUELTO_CLIENTE
            </span>
          </div>
          <div className="spacer" />
          <div className="inv-field" style={{ minWidth: 280 }}>
            <input
              className="inv-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por IMEI, propietario, placa..."
            />
          </div>
          <button className="inv-btn inv-btn-outline" onClick={cargar} disabled={loading}>
            {loading ? <span className="inv-spinner" /> : Icon.refresh}
            Actualizar
          </button>
        </div>

        <InvTable
          loading={loading}
          data={filtered}
          rowsPerPage={20}
          emptyMessage="No hay equipos devueltos al cliente"
          columns={[
            { key: "imei", header: "IMEI", sortable: true },
            {
              key: "marca",
              header: "Marca / Modelo",
              render: (r) => `${r.marca?.nombre || ""} ${r.modelo?.nombre || ""}`.trim() || "—",
            },
            {
              key: "propiedad",
              header: "Propiedad",
              render: (r) => (
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <InvTag value={r.tipoPropiedad} severity="info" />
                  <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                    {r.propietarioNombre || "—"}
                  </span>
                </div>
              ),
            },
            {
              key: "fecha",
              header: "Fecha devolución",
              sortable: true,
              sortAccessor: (r) => r.actividadDevolucion?.fechaActividad,
              render: (r) => formatFecha(r.actividadDevolucion?.fechaActividad),
            },
            {
              key: "placa",
              header: "Placa origen",
              render: (r) => r.actividadDevolucion?.placaInstalada || "—",
            },
            {
              key: "tecnico",
              header: "Técnico",
              render: (r) => {
                const t = r.actividadDevolucion?.tecnico;
                return t ? `${t.nombres || ""} ${t.apellidos || ""}`.trim() : "—";
              },
            },
          ]}
        />
      </div>
    </div>
  );
}

function formatFecha(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("es-CO", {
      day: "2-digit", month: "2-digit", year: "numeric",
    });
  } catch { return iso; }
}
