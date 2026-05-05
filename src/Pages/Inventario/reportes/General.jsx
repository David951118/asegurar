import React, { useEffect, useMemo, useState } from "react";
import InventarioLayout from "../Layout";
import { ReportesService } from "../../../Services/gpsApi";
import { Icon, InvSelect, InvTable, InvTag, useToast } from "../components";
import { generarPdfReporte } from "./generarPdf";
import { generarExcelReporte } from "./generarExcel";

const PERIODOS = [
  { value: "hoy", label: "Hoy" },
  { value: "semanal", label: "Última semana" },
  { value: "quincenal", label: "Últimos 15 días" },
  { value: "mensual", label: "Último mes" },
  { value: "trimestral", label: "Último trimestre" },
  { value: "semestral", label: "Último semestre" },
  { value: "anual", label: "Último año" },
  { value: "personalizado", label: "Personalizado" },
];

const ESTADO_SEVERITY = {
  DISPONIBLE: "success",
  EN_TRANSITO: "neutral",
  EN_POSESION_TECNICO: "info",
  INSTALADO: "info",
  EN_REVISION: "warning",
  EN_GARANTIA: "warning",
  RETIRADO: "danger",
  DEVUELTO_CLIENTE: "warning",
};

const ESTADO_LABEL = {
  DISPONIBLE: "Disponibles",
  EN_TRANSITO: "En tránsito",
  EN_POSESION_TECNICO: "En posesión técnico",
  INSTALADO: "Instalados",
  EN_REVISION: "En revisión",
  EN_GARANTIA: "En garantía",
  DEVUELTO_CLIENTE: "Devueltos cliente",
  RETIRADO: "Retirados",
};

const KPI_VARIANT = {
  DISPONIBLE: "success",
  EN_TRANSITO: "",
  EN_POSESION_TECNICO: "info",
  INSTALADO: "info",
  EN_REVISION: "warning",
  EN_GARANTIA: "warning",
  DEVUELTO_CLIENTE: "danger",
  RETIRADO: "danger",
};

const TIPO_ACT_LABEL = {
  INSTALACION_NUEVA: "Instalación nueva",
  HOMOLOGACION: "Homologación",
  CAMBIO_2G_4G: "Cambio 2G→4G",
  CAMBIO_CON_COSTO: "Cambio con costo",
  CAMBIO_SIN_COSTO: "Cambio sin costo",
  CAMBIO_COMODATO: "Cambio comodato",
  PRUEBAS: "Pruebas",
  GARANTIA: "Garantía",
  EQUIPO_DANADO: "Equipo dañado",
};

const ACCION_LABEL = {
  CREADO: "Creado",
  RECIBIDO_SEGUNDA: "Recibido segunda",
  ENVIADO: "Enviado",
  RECIBIDO_TECNICO: "Recibido por técnico",
  INSTALADO: "Instalado",
  RETIRADO: "Retirado",
  REVISADO_REUSAR: "Revisado · reusar",
  REVISADO_DEVOLVER: "Revisado · devolver",
  ENVIADO_GARANTIA: "Enviado a garantía",
  RECIBIDO_GARANTIA: "Recibido de garantía",
  DEVUELTO_AL_CLIENTE: "Devuelto al cliente",
  DESCARTADO: "Descartado",
};

export default function ReporteGeneral() {
  return (
    <InventarioLayout
      title="Reporte general"
      subtitle="Resumen completo del período: KPIs, actividades, movimientos, asignaciones e inventario por ciudad"
    >
      <Content />
    </InventarioLayout>
  );
}

function Content() {
  const toast = useToast();
  const [periodo, setPeriodo] = useState("mensual");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openTecnicos, setOpenTecnicos] = useState({}); // accordion expand state

  const cargar = async () => {
    setLoading(true);
    try {
      const params = {};
      if (periodo === "personalizado") {
        if (desde) params.desde = desde;
        if (hasta) params.hasta = hasta;
      } else {
        params.periodo = periodo;
      }
      const res = await ReportesService.general(params);
      setData(res);
    } catch (err) {
      console.error(err);
      toast.error("Error", err.response?.data?.message || "No se pudo cargar el reporte");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (periodo !== "personalizado") cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodo]);

  const obtenerUsuario = () => {
    try {
      const u = JSON.parse(localStorage.getItem("inv_user") || "{}");
      return u.persona || u.username || "Admin";
    } catch (_) {
      return "Admin";
    }
  };

  const exportPDF = () => {
    if (!data) return;
    try {
      generarPdfReporte(data, { usuarioGenerador: obtenerUsuario() });
    } catch (err) {
      console.error("Error generando PDF:", err);
      toast.error("Error", "No se pudo generar el PDF");
    }
  };

  const exportExcel = () => {
    if (!data) return;
    try {
      generarExcelReporte(data, { usuarioGenerador: obtenerUsuario() });
    } catch (err) {
      console.error("Error generando Excel:", err);
      toast.error("Error", "No se pudo generar el Excel");
    }
  };

  const kpis = data?.kpis || {};
  const porEstado = kpis.porEstado || {};
  const actividades = data?.actividadesPeriodo || {};
  const movimientos = data?.movimientosPeriodo || {};
  const asignaciones = data?.asignacionesTecnicoEquipo || {};
  const tablaCiudad = data?.tablaPorCiudad || {};
  const rango = data?.rango || {};

  const stockBajo = (kpis.stockCentral ?? 999) < 10;

  return (
    <>
      {/* Filtros */}
      <div className="inv-filters">
        <div className="inv-field" style={{ minWidth: 180 }}>
          <label>Período</label>
          <InvSelect value={periodo} options={PERIODOS} onChange={setPeriodo} isClearable={false} />
        </div>
        {periodo === "personalizado" && (
          <>
            <div className="inv-field">
              <label>Desde</label>
              <input type="date" className="inv-input" value={desde} onChange={(e) => setDesde(e.target.value)} />
            </div>
            <div className="inv-field">
              <label>Hasta</label>
              <input type="date" className="inv-input" value={hasta} onChange={(e) => setHasta(e.target.value)} />
            </div>
            <button className="inv-btn" onClick={cargar} disabled={!desde || !hasta}>
              {Icon.search} Aplicar
            </button>
          </>
        )}
        <div className="spacer" />
        {data && (
          <>
            <button
              className="inv-btn"
              onClick={exportExcel}
              style={{ background: "#0a7c3a", color: "#fff", fontWeight: 700 }}
              title="Descargar reporte completo en Excel (.xlsx)"
            >
              ↓ Excel
            </button>
            <button
              className="inv-btn"
              onClick={exportPDF}
              style={{ background: "#ffd54f", color: "#0a2d6e", fontWeight: 700 }}
              title="Descargar reporte ejecutivo en PDF"
            >
              ↓ PDF
            </button>
          </>
        )}
        <button className="inv-btn inv-btn-outline" onClick={cargar} disabled={loading}>
          {loading ? <span className="inv-spinner" /> : Icon.refresh}
          Actualizar
        </button>
      </div>

      {rango.desde && rango.hasta && (
        <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 14 }}>
          Período: <strong style={{ color: "var(--text-secondary)" }}>
            {fmtFecha(rango.desde)} → {fmtFecha(rango.hasta)} ({rango.etiqueta || "—"})
          </strong>
        </div>
      )}

      {/* KPIs por estado */}
      <div className="inv-kpi-grid">
        <Kpi label="Total equipos" value={kpis.totalEquipos ?? "—"} hint="Snapshot actual" />
        {["DISPONIBLE", "EN_TRANSITO", "EN_POSESION_TECNICO", "INSTALADO",
          "EN_REVISION", "EN_GARANTIA", "DEVUELTO_CLIENTE", "RETIRADO"].map((est) => (
          <Kpi
            key={est}
            label={ESTADO_LABEL[est]}
            value={porEstado[est] ?? 0}
            variant={KPI_VARIANT[est]}
          />
        ))}
      </div>

      {/* Stock central + alerta */}
      {kpis.stockCentral != null && (
        <div className="inv-card" style={{ marginBottom: 18 }}>
          <div className="inv-card-body" style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>
                Stock central (Pasto)
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: stockBajo ? "var(--inv-danger)" : "var(--text-primary)" }}>
                {kpis.stockCentral} equipos disponibles
              </div>
            </div>
            <div className="spacer" />
            {stockBajo && (
              <div className="inv-alert alta" style={{ margin: 0 }}>
                <span>⚠</span>
                <div><b>Stock bajo</b> — la central tiene menos de 10 equipos disponibles</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actividades del período */}
      <div className="inv-card" style={{ marginBottom: 18 }}>
        <div className="inv-card-body">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
            <h3 style={{ margin: 0 }}>Actividades del período</h3>
            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
              {actividades.total ?? 0} en total
            </span>
          </div>

          {actividades.porTipo && Object.keys(actividades.porTipo).length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
              {Object.entries(actividades.porTipo).map(([tipo, count]) => (
                <span key={tipo} className="inv-tag info">
                  {TIPO_ACT_LABEL[tipo] || tipo}: {count}
                </span>
              ))}
            </div>
          )}

          <InvTable
            loading={loading}
            data={actividades.detalle || []}
            rowsPerPage={15}
            emptyMessage="Sin actividades en el período"
            defaultSort={{ key: "fechaActividad", dir: "desc" }}
            columns={[
              { key: "fechaActividad", header: "Fecha", sortable: true, width: 110,
                render: (r) => fmtFecha(r.fechaActividad) },
              { key: "tipoActividad", header: "Tipo", sortable: true,
                render: (r) => <InvTag value={TIPO_ACT_LABEL[r.tipoActividad] || r.tipoActividad} severity="info" /> },
              { key: "tecnico", header: "Técnico",
                render: (r) => r.tecnico ? `${r.tecnico.nombres || ""} ${r.tecnico.apellidos || ""}`.trim() : "—" },
              { key: "ciudad", header: "Ciudad", render: (r) => r.ciudad?.nombre || "—" },
              { key: "placa", header: "Placa", render: (r) => r.placaInstalada || "—" },
              { key: "equipo", header: "Equipo instalado",
                render: (r) => r.equipoInstalado ? (
                  <div style={{ fontSize: "0.82rem", lineHeight: 1.3 }}>
                    <div><strong>{r.equipoInstalado.imei}</strong></div>
                    <div style={{ color: "var(--text-muted)" }}>
                      {r.equipoInstalado.marca?.nombre || ""} {r.equipoInstalado.modelo?.nombre || ""}
                    </div>
                  </div>
                ) : "—" },
              { key: "retirado", header: "Retirado / destino",
                render: (r) => r.equipoRetirado ? (
                  <div style={{ fontSize: "0.82rem", lineHeight: 1.3 }}>
                    <div>{r.equipoRetirado.imei}</div>
                    {r.destinoEquipoRetirado && (
                      <InvTag value={r.destinoEquipoRetirado} severity={
                        r.destinoEquipoRetirado === "DESCARTADO" ? "danger"
                        : r.destinoEquipoRetirado === "AL_CLIENTE" ? "warning" : "info"
                      } />
                    )}
                  </div>
                ) : "—" },
              { key: "obs", header: "Observaciones",
                render: (r) => r.observaciones
                  ? <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{r.observaciones}</span>
                  : "—" },
            ]}
          />
        </div>
      </div>

      {/* Movimientos del período */}
      <div className="inv-card" style={{ marginBottom: 18 }}>
        <div className="inv-card-body">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
            <h3 style={{ margin: 0 }}>Movimientos del período</h3>
            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
              {movimientos.total ?? 0} eventos
            </span>
          </div>

          {movimientos.porAccion && Object.keys(movimientos.porAccion).length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
              {Object.entries(movimientos.porAccion).map(([accion, count]) => (
                <span key={accion} className="inv-tag neutral">
                  {ACCION_LABEL[accion] || accion}: {count}
                </span>
              ))}
            </div>
          )}

          <InvTable
            loading={loading}
            data={movimientos.detalle || []}
            rowsPerPage={20}
            emptyMessage="Sin movimientos en el período"
            defaultSort={{ key: "fecha", dir: "desc" }}
            columns={[
              { key: "fecha", header: "Fecha", sortable: true, width: 130,
                render: (r) => fmtFechaHora(r.fecha) },
              { key: "accion", header: "Acción",
                render: (r) => <InvTag value={ACCION_LABEL[r.accion] || r.accion} severity="info" /> },
              { key: "equipo", header: "Equipo",
                render: (r) => (
                  <div style={{ fontSize: "0.82rem", lineHeight: 1.3 }}>
                    <div><strong>{r.imei}</strong></div>
                    <div style={{ color: "var(--text-muted)" }}>
                      {r.marca || ""} {r.modelo || ""}
                      {r.condicion && ` · ${r.condicion}`}
                    </div>
                  </div>
                ) },
              { key: "transicion", header: "Transición",
                render: (r) => (r.estadoAnterior || r.estadoNuevo) ? (
                  <span style={{ fontSize: "0.82rem", whiteSpace: "nowrap" }}>
                    <InvTag value={r.estadoAnterior || "—"} severity={ESTADO_SEVERITY[r.estadoAnterior] || "neutral"} />
                    <span style={{ margin: "0 4px", color: "var(--text-muted)" }}>→</span>
                    <InvTag value={r.estadoNuevo || "—"} severity={ESTADO_SEVERITY[r.estadoNuevo] || "neutral"} />
                  </span>
                ) : "—" },
              { key: "ciudad", header: "Ciudad destino",
                render: (r) => r.ciudadDestino || "—" },
              { key: "tecnico", header: "Técnico",
                render: (r) => r.tecnico ? `${r.tecnico.nombres || ""} ${r.tecnico.apellidos || ""}`.trim() : "—" },
              { key: "obs", header: "Observaciones",
                render: (r) => r.observaciones
                  ? <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{r.observaciones}</span>
                  : "—" },
            ]}
          />
        </div>
      </div>

      {/* Asignaciones técnico → equipos (accordion) */}
      <div className="inv-card" style={{ marginBottom: 18 }}>
        <div className="inv-card-body">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
            <h3 style={{ margin: 0 }}>Quién tiene qué</h3>
            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
              {asignaciones.totalTecnicos ?? 0} técnicos · {asignaciones.totalEquipos ?? 0} equipos
            </span>
          </div>

          {(asignaciones.tecnicos || []).length === 0 ? (
            <div className="inv-loading">Sin asignaciones</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(asignaciones.tecnicos || []).map((row) => {
                const t = row.tecnico || {};
                const tid = t._id || t.identificacion;
                const expanded = !!openTecnicos[tid];
                return (
                  <div key={tid} style={{
                    border: "1px solid var(--card-border)",
                    borderRadius: 10,
                    overflow: "hidden",
                  }}>
                    <button
                      type="button"
                      onClick={() => setOpenTecnicos((s) => ({ ...s, [tid]: !s[tid] }))}
                      style={{
                        width: "100%",
                        background: "var(--bg-tertiary)",
                        border: "none",
                        padding: "12px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        textAlign: "left",
                      }}
                    >
                      <span style={{
                        display: "inline-block",
                        transform: expanded ? "rotate(90deg)" : "rotate(0)",
                        transition: "transform 0.15s",
                        color: "var(--text-muted)",
                      }}>▶</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "0.92rem" }}>
                          {`${t.nombres || ""} ${t.apellidos || ""}`.trim() || t.identificacion}
                          <span style={{ color: "var(--text-muted)", fontWeight: 400, marginLeft: 8, fontSize: "0.82rem" }}>
                            {t.identificacion} · {t.ciudad || "—"}
                          </span>
                        </div>
                      </div>
                      <span className="inv-tag info">{row.totalEquipos} equipos</span>
                      {row.porEstado && Object.entries(row.porEstado).map(([est, c]) => (
                        <span key={est} className={`inv-tag ${ESTADO_SEVERITY[est] || "neutral"}`}>
                          {ESTADO_LABEL[est] || est}: {c}
                        </span>
                      ))}
                    </button>

                    {expanded && (
                      <div style={{ padding: 12, background: "var(--card-bg)" }}>
                        <InvTable
                          data={row.equipos || []}
                          rowsPerPage={10}
                          emptyMessage="Este técnico no tiene equipos"
                          columns={[
                            { key: "imei", header: "IMEI",
                              render: (r) => <strong style={{ fontSize: "0.85rem" }}>{r.imei}</strong> },
                            { key: "serial", header: "Serial", render: (r) => r.serial || "—" },
                            { key: "marca", header: "Marca / Modelo",
                              render: (r) => `${r.marca || ""} ${r.modelo || ""}`.trim() || "—" },
                            { key: "estado", header: "Estado",
                              render: (r) => <InvTag value={r.estado} severity={ESTADO_SEVERITY[r.estado] || "neutral"} /> },
                            { key: "condicion", header: "Condición",
                              render: (r) => <InvTag value={r.condicion} severity={r.condicion === "NUEVO" ? "info" : "neutral"} /> },
                            { key: "placa", header: "Placa", render: (r) => r.placaInstalada || "—" },
                          ]}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Inventario por ciudad */}
      <div className="inv-card">
        <div className="inv-card-body">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
            <h3 style={{ margin: 0 }}>Inventario por ciudad</h3>
            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
              {tablaCiudad.totalCiudades ?? 0} ciudades · {tablaCiudad.totalEquipos ?? 0} equipos
            </span>
          </div>

          {tablaCiudad.resumenTexto && (
            <div style={{
              background: "var(--bg-tertiary)",
              border: "1px solid var(--card-border)",
              borderRadius: 8,
              padding: "12px 14px",
              fontFamily: "ui-monospace, Menlo, Consolas, monospace",
              fontSize: "0.84rem",
              color: "var(--text-secondary)",
              whiteSpace: "pre-wrap",
              marginBottom: 14,
            }}>
              {tablaCiudad.resumenTexto}
            </div>
          )}

          {(tablaCiudad.ciudades || []).map((c, i) => (
            <div key={c.ciudad || i} style={{ marginBottom: 14 }}>
              <h4 style={{
                margin: "0 0 8px",
                fontSize: "0.92rem",
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}>
                {c.ciudad}
                {c.esCentral && <InvTag value="Central" severity="info" />}
                <span style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: "0.82rem" }}>
                  · {c.totalEquipos} equipos
                </span>
              </h4>
              {c.porEstado && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                  {Object.entries(c.porEstado).map(([est, n]) => (
                    <span key={est} className={`inv-tag ${ESTADO_SEVERITY[est] || "neutral"}`}>
                      {ESTADO_LABEL[est] || est}: {n}
                    </span>
                  ))}
                </div>
              )}
              <InvTable
                data={c.modelos || []}
                rowsPerPage={20}
                emptyMessage="Sin modelos"
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
          ))}
        </div>
      </div>
    </>
  );
}

function Kpi({ label, value, hint, variant }) {
  return (
    <div className={`inv-kpi ${variant || ""}`}>
      <span className="label">{label}</span>
      <span className="value">{value}</span>
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}

function fmtFecha(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("es-CO", {
      day: "2-digit", month: "2-digit", year: "numeric",
    });
  } catch { return iso; }
}

function fmtFechaHora(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("es-CO", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
}
