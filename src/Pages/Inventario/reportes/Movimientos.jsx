import React, { useEffect, useState } from "react";
import InventarioLayout from "../Layout";
import { ReportesService } from "../../../Services/gpsApi";
import { Icon, InvSelect, InvTable, useToast } from "../components";

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

const TIPO_LABEL = {
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

export default function Movimientos() {
  return (
    <InventarioLayout
      title="Reporte de movimientos"
      subtitle="Resumen agregado de entradas, salidas y cambios de estado"
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
      const res = await ReportesService.movimientos(params);
      setData(res);
    } catch (err) {
      toast.error("Error", err.response?.data?.message || "No se pudo cargar el reporte");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (periodo !== "personalizado") cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodo]);

  const num = (v) => v ?? 0;
  // El backend agrupa los totales bajo `data.resumen`.
  const resumen = data?.resumen || {};
  const enviadosASede = resumen.enviadosASede || {};
  const usadosInstalados = resumen.usadosInstalados || {};
  const porTipo = data?.actividades?.porTipo || data?.actividadesPorTipo || {};
  // `detallePorModelo` llega como filas {accion, condicion, marca, modelo, total};
  // se pivota a una fila por marca/modelo con columnas por tipo de movimiento.
  const detallePorModelo = pivotDetalle(data?.detallePorModelo || []);

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
        <button className="inv-btn inv-btn-outline" onClick={cargar} disabled={loading}>
          {loading ? <span className="inv-spinner" /> : Icon.refresh}
          Actualizar
        </button>
      </div>

      {/* KPIs */}
      <div className="inv-kpi-grid">
        <Kpi label="Recibidos NUEVOS" value={num(resumen.recibidosNuevos)} variant="success" />
        <Kpi label="Recibidos SEGUNDA" value={num(resumen.recibidosSegunda)} />
        <Kpi label="Enviados a sede" value={num(enviadosASede.total)}
          hint={`${num(enviadosASede.nuevos)} nuevos · ${num(enviadosASede.segunda)} segunda`} variant="info" />
        <Kpi label="Instalados" value={num(usadosInstalados.total)}
          hint={usadosInstalados.nuevos != null ? `${num(usadosInstalados.nuevos)} nuevos · ${num(usadosInstalados.segunda)} segunda` : ""} variant="info" />
        <Kpi label="Retirados" value={num(resumen.retirados)} variant="warning" />
        <Kpi label="Restaurados" value={num(resumen.restaurados)} />
        <Kpi label="Enviados a garantía" value={num(resumen.enviadosGarantia)} variant="warning" />
        <Kpi label="Recibidos de garantía" value={num(resumen.recibidosGarantia)} />
        <Kpi label="Descartados" value={num(resumen.descartados)} variant="danger" />
      </div>

      {/* Actividades por tipo */}
      <div className="inv-card" style={{ marginBottom: 18 }}>
        <div className="inv-card-body">
          <h3>Actividades por tipo</h3>
          {Object.keys(porTipo).length > 0 ? (
            <div className="inv-form-grid inv-form-grid-3">
              {Object.entries(porTipo).map(([tipo, count]) => (
                <div key={tipo} style={{
                  background: "var(--bg-tertiary)",
                  padding: "10px 14px",
                  borderRadius: 8,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    {TIPO_LABEL[tipo] || tipo}
                  </span>
                  <strong style={{ color: "var(--text-primary)", fontSize: "1.05rem" }}>{count}</strong>
                </div>
              ))}
            </div>
          ) : (
            <div className="inv-loading">Sin actividades en el período</div>
          )}
        </div>
      </div>

      {/* Detalle por modelo */}
      <div className="inv-card">
        <div className="inv-card-body">
          <h3>Detalle por modelo</h3>
          <InvTable
            loading={loading}
            data={detallePorModelo}
            rowsPerPage={20}
            emptyMessage="Sin movimientos por modelo"
            columns={[
              { key: "marca", header: "Marca", render: (r) => r.marca?.nombre || r.marca || "—" },
              { key: "modelo", header: "Modelo", render: (r) => r.modelo?.nombre || r.modelo || "—" },
              { key: "recibidos", header: "Recibidos", align: "right",
                render: (r) => num(r.recibidos ?? (r.recibidosNuevos || 0) + (r.recibidosSegunda || 0)) },
              { key: "enviados", header: "Enviados", align: "right", render: (r) => num(r.enviados) },
              { key: "instalados", header: "Instalados", align: "right", render: (r) => num(r.instalados) },
              { key: "retirados", header: "Retirados", align: "right", render: (r) => num(r.retirados) },
            ]}
          />
        </div>
      </div>
    </>
  );
}

// Pivota filas {accion, condicion, marca, modelo, total} a una fila por
// marca/modelo con columnas agregadas por tipo de movimiento.
function pivotDetalle(filas) {
  const map = {};
  for (const f of filas) {
    const marca = f.marca || "—";
    const modelo = f.modelo || "—";
    const key = `${marca} / ${modelo}`;
    if (!map[key]) {
      map[key] = { marca, modelo, recibidos: 0, enviados: 0, instalados: 0, retirados: 0 };
    }
    const r = map[key];
    const t = Number(f.total) || 0;
    switch (f.accion) {
      case "CREADO":
      case "RECIBIDO_SEGUNDA":
      case "RECIBIDO_GARANTIA":
        r.recibidos += t;
        break;
      case "ENVIADO":
        r.enviados += t;
        break;
      case "INSTALADO":
        r.instalados += t;
        break;
      case "RETIRADO":
      case "DESCARTADO":
        r.retirados += t;
        break;
      default:
        break;
    }
  }
  return Object.values(map).sort((a, b) =>
    `${a.marca} ${a.modelo}`.localeCompare(`${b.marca} ${b.modelo}`),
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
