import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InventarioLayout from "./Layout";
import GpsService from "../../Services/gpsApi";
import { Icon, InvTable, InvTag, useToast } from "./components";

const PERIODOS = [
  { value: "hoy", label: "Hoy" },
  { value: "semanal", label: "Última semana" },
  { value: "quincenal", label: "Últimos 15 días" },
  { value: "mes", label: "Mensual (mes completo)" },
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

export default function InventarioDashboard() {
  return (
    <InventarioLayout
      title="Dashboard"
      subtitle="Resumen ejecutivo del inventario GPS"
    >
      <DashboardContent />
    </InventarioLayout>
  );
}

function DashboardContent() {
  const navigate = useNavigate();
  const toast = useToast();

  const [periodo, setPeriodo] = useState("mes");
  const [mes, setMes] = useState(mesActual());
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (periodo === "personalizado") {
        if (desde) params.desde = desde;
        if (hasta) params.hasta = hasta;
      } else if (periodo === "mes") {
        params.mes = mes;
      } else {
        params.periodo = periodo;
      }
      const res = await GpsService.dashboard(params);
      setData(res);
    } catch (err) {
      console.error("Error dashboard:", err);
      toast.error("Error", err.response?.data?.message || "No se pudo cargar el dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (periodo !== "personalizado") fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodo, mes]);

  const kpis = data?.kpis || {};
  const actividades = data?.actividadesPeriodo || {};
  const alertas = data?.alertas || [];
  const tecnicos = data?.tecnicosTopActividades || [];
  const ciudades = data?.ciudadesConMasInventario || [];
  const modelos = data?.modelosMasUsados || [];

  const maxAct = Math.max(
    1,
    ...Object.values(actividades.porTipo || {}).map((n) => Number(n) || 0)
  );

  return (
    <>
      {/* Filtros */}
      <div className="inv-filters">
        <div className="inv-field">
          <label>Período</label>
          <select
            className="inv-select-native"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
          >
            {PERIODOS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
        {periodo === "mes" && (
          <div className="inv-field">
            <label>Mes</label>
            <input type="month" className="inv-input" value={mes} max={mesActual()} onChange={(e) => e.target.value && setMes(e.target.value)} />
          </div>
        )}
        {periodo === "personalizado" && (
          <>
            <div className="inv-field">
              <label>Desde</label>
              <input
                type="date"
                className="inv-input"
                value={desde}
                onChange={(e) => setDesde(e.target.value)}
              />
            </div>
            <div className="inv-field">
              <label>Hasta</label>
              <input
                type="date"
                className="inv-input"
                value={hasta}
                onChange={(e) => setHasta(e.target.value)}
              />
            </div>
            <button
              className="inv-btn"
              onClick={fetchData}
              disabled={!desde || !hasta}
            >
              {Icon.search} Aplicar
            </button>
          </>
        )}
        <div className="spacer" />
        <button
          className="inv-btn inv-btn-outline"
          onClick={fetchData}
          disabled={loading}
        >
          {loading ? <span className="inv-spinner" /> : Icon.refresh}
          Actualizar
        </button>
      </div>

      {/* KPIs */}
      <div className="inv-kpi-grid">
        <Kpi label="Activos (Instalados)" value={kpis.totalActivos} hint={`${kpis.totalEquipos ?? 0} equipos en total`} variant="success" />
        <Kpi label="Disponibles en central" value={kpis.stockCentral} hint={`Mínimo sugerido: ${kpis.stockMinimoSugerido ?? "—"}`} />
        <Kpi label="% Utilización" value={kpis.porcentajeUtilizacion != null ? `${kpis.porcentajeUtilizacion}%` : "—"} hint="Instalado / Total" variant="info">
          {kpis.porcentajeUtilizacion != null && (
            <div className="inv-bar" style={{ marginTop: 6 }}>
              <span style={{ width: `${Math.min(100, Number(kpis.porcentajeUtilizacion))}%` }} />
            </div>
          )}
        </Kpi>
        <Kpi label="En tránsito" value={kpis.totalEnTransito} hint="Hacia sedes / técnicos" variant="warning" />
        <Kpi label="En revisión" value={kpis.totalEnRevision} hint="Equipos en taller" />
        <Kpi label="En garantía" value={kpis.totalEnGarantia} variant="warning" />
        <Kpi label="Devueltos al cliente" value={kpis.totalDevueltosCliente} variant="danger" />
        <Kpi label="Retirados" value={kpis.totalRetirados} hint="Fuera de inventario" variant="danger" />
      </div>

      {/* Alertas */}
      {alertas.length > 0 && (
        <div className="inv-card" style={{ marginBottom: 18 }}>
          <div className="inv-card-body">
            <h3>Alertas</h3>
            {alertas.map((a, i) => (
              <div key={i} className={`inv-alert ${a.severidad || "baja"}`}>
                <span style={{ marginTop: 1 }}>{Icon.alert}</span>
                <div>
                  <b>{a.tipo}</b> — {a.mensaje}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="inv-two-col">
        {/* Actividades por tipo */}
        <div className="inv-card">
          <div className="inv-card-body">
            <h3>Actividades del período ({actividades.total || 0})</h3>
            {actividades.porTipo && Object.keys(actividades.porTipo).length > 0 ? (
              Object.entries(actividades.porTipo).map(([tipo, count]) => (
                <div className="inv-bar-row" key={tipo}>
                  <div className="lbl">{TIPO_LABEL[tipo] || tipo}</div>
                  <div className="bar-wrap">
                    <div className="inv-bar">
                      <span style={{ width: `${(Number(count) / maxAct) * 100}%` }} />
                    </div>
                  </div>
                  <div className="num">{count}</div>
                </div>
              ))
            ) : (
              <div className="inv-loading">Sin actividades en el período</div>
            )}
          </div>
        </div>

        {/* Top técnicos */}
        <div className="inv-card">
          <div className="inv-card-body">
            <h3>Top técnicos</h3>
            <InvTable
              loading={loading}
              data={tecnicos}
              rowsPerPage={10}
              emptyMessage="Sin datos de técnicos"
              columns={[
                {
                  key: "nombre",
                  header: "Técnico",
                  render: (r) => `${r.tecnico?.nombres || ""} ${r.tecnico?.apellidos || ""}`.trim() || "—",
                },
                {
                  key: "ciudad",
                  header: "Ciudad",
                  render: (r) => r.tecnico?.ciudad || "—",
                },
                {
                  key: "totalActividades",
                  header: "Actividades",
                  width: 110,
                  align: "right",
                  render: (r) => <strong>{r.totalActividades}</strong>,
                },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="inv-two-col">
        {/* Inventario por ciudad */}
        <div className="inv-card">
          <div className="inv-card-body">
            <h3>Inventario por ciudad</h3>
            <InvTable
              loading={loading}
              data={ciudades}
              rowsPerPage={10}
              emptyMessage="Sin datos"
              columns={[
                {
                  key: "ciudad",
                  header: "Ciudad",
                  render: (r) => (
                    <span>
                      {r.ciudad}
                      {r.esCentral && <InvTag value="Central" severity="info" />}
                    </span>
                  ),
                },
                { key: "totalEquipos", header: "Total", align: "right" },
                { key: "disp", header: "Disponibles", align: "right", render: (r) => r.porEstado?.DISPONIBLE ?? 0 },
                { key: "inst", header: "Instalados", align: "right", render: (r) => r.porEstado?.INSTALADO ?? 0 },
                { key: "rev", header: "Revisión", align: "right", render: (r) => r.porEstado?.EN_REVISION ?? 0 },
              ]}
            />
          </div>
        </div>

        {/* Modelos más usados */}
        <div className="inv-card">
          <div className="inv-card-body">
            <h3>Modelos más usados</h3>
            <InvTable
              loading={loading}
              data={modelos}
              rowsPerPage={10}
              emptyMessage="Sin datos"
              columns={[
                { key: "marca", header: "Marca" },
                { key: "modelo", header: "Modelo" },
                { key: "totalInstalados", header: "Instalados", align: "right" },
                { key: "totalDisponibles", header: "Disponibles", align: "right" },
                { key: "total", header: "Total", align: "right", render: (r) => <strong>{r.total}</strong> },
              ]}
            />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button className="inv-btn inv-btn-outline" onClick={() => navigate("/inventario/actividades")}>
          {Icon.list} Ver actividades
        </button>
        <button className="inv-btn" onClick={() => navigate("/inventario/actividades/nueva")}>
          {Icon.plus} Nueva actividad
        </button>
      </div>
    </>
  );
}

function Kpi({ label, value, hint, variant, children }) {
  return (
    <div className={`inv-kpi ${variant || ""}`}>
      <span className="label">{label}</span>
      <span className="value">{value ?? "—"}</span>
      {hint && <span className="hint">{hint}</span>}
      {children}
    </div>
  );
}

function mesActual() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
