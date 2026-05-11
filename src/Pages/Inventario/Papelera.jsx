import React, { useEffect, useState } from "react";
import InventarioLayout from "./Layout";
import {
  MarcasService,
  ModelosService,
  CiudadesService,
  TecnicosService,
  EquiposService,
  ActividadesService,
} from "../../Services/gpsApi";
import { ConfirmModal, Icon, InvTable, InvTag, useToast } from "./components";

/* ──────────────────────────────────────────────
   Configuración de cada entidad de la papelera
   ────────────────────────────────────────────── */
const ENTIDADES = [
  {
    key: "equipos",
    label: "Equipos",
    singular: "equipo",
    fetch: () => EquiposService.list({ includeDeleted: true, limit: 1000 }),
    extractList: (res) => res?.equipos || res?.items || (Array.isArray(res) ? res : []),
    service: EquiposService,
    columns: [
      { key: "imei", header: "IMEI", render: (r) => <strong style={{ fontSize: "0.86rem" }}>{r.imei || "—"}</strong> },
      { key: "serial", header: "Serial", render: (r) => r.serial || "—" },
      { key: "marca", header: "Marca / Modelo", render: (r) => `${r.marca?.nombre || ""} ${r.modelo?.nombre || ""}`.trim() || "—" },
      { key: "estado", header: "Estado al borrar", render: (r) => <InvTag value={r.estado} severity="neutral" /> },
    ],
    nombrePara: (r) => `equipo IMEI ${r.imei}`,
  },
  {
    key: "marcas",
    label: "Marcas",
    singular: "marca",
    fetch: () => MarcasService.list({ includeDeleted: true, limit: 1000 }),
    extractList: (res) => (Array.isArray(res) ? res : res?.marcas || res?.items || []),
    service: MarcasService,
    columns: [
      { key: "nombre", header: "Nombre", render: (r) => <strong>{r.nombre}</strong> },
      { key: "descripcion", header: "Descripción", render: (r) => r.descripcion || "—" },
    ],
    nombrePara: (r) => `marca "${r.nombre}"`,
  },
  {
    key: "modelos",
    label: "Modelos",
    singular: "modelo",
    fetch: () => ModelosService.list({ includeDeleted: true, limit: 1000 }),
    extractList: (res) => (Array.isArray(res) ? res : res?.modelos || res?.items || []),
    service: ModelosService,
    columns: [
      { key: "nombre", header: "Modelo", render: (r) => <strong>{r.nombre}</strong> },
      { key: "marca", header: "Marca", render: (r) => r.marca?.nombre || "—" },
      { key: "descripcion", header: "Descripción", render: (r) => r.descripcion || "—" },
    ],
    nombrePara: (r) => `modelo "${r.nombre}"`,
  },
  {
    key: "ciudades",
    label: "Ciudades",
    singular: "ciudad",
    fetch: () => CiudadesService.list({ includeDeleted: true, limit: 1000 }),
    extractList: (res) => (Array.isArray(res) ? res : res?.ciudades || res?.items || []),
    service: CiudadesService,
    columns: [
      { key: "nombre", header: "Ciudad", render: (r) => <strong>{r.nombre}</strong> },
      { key: "departamento", header: "Departamento", render: (r) => r.departamento || "—" },
    ],
    nombrePara: (r) => `ciudad "${r.nombre}"`,
  },
  {
    key: "tecnicos",
    label: "Técnicos",
    singular: "técnico",
    fetch: () => TecnicosService.list({ includeDeleted: true, limit: 1000 }),
    extractList: (res) => (Array.isArray(res) ? res : res?.tecnicos || res?.items || []),
    service: TecnicosService,
    columns: [
      { key: "nombres", header: "Nombre", render: (r) => <strong>{`${r.nombres || ""} ${r.apellidos || ""}`.trim() || "—"}</strong> },
      { key: "identificacion", header: "Identificación", render: (r) => r.identificacion || "—" },
      { key: "email", header: "Email", render: (r) => r.email || "—" },
    ],
    nombrePara: (r) => `técnico "${`${r.nombres || ""} ${r.apellidos || ""}`.trim()}"`,
  },
  {
    key: "actividades",
    label: "Actividades",
    singular: "actividad",
    fetch: () => ActividadesService.list({ includeDeleted: true, limit: 1000 }),
    extractList: (res) => res?.actividades || res?.items || (Array.isArray(res) ? res : []),
    service: ActividadesService,
    columns: [
      { key: "fecha", header: "Fecha", render: (r) => fmtFecha(r.fechaActividad) },
      { key: "tipo", header: "Tipo", render: (r) => <InvTag value={r.tipoActividad} severity="info" /> },
      { key: "tecnico", header: "Técnico", render: (r) => r.tecnico ? `${r.tecnico.nombres || ""} ${r.tecnico.apellidos || ""}`.trim() : "—" },
      { key: "placa", header: "Placa", render: (r) => r.placaInstalada || "—" },
    ],
    nombrePara: (r) => `actividad del ${fmtFecha(r.fechaActividad)}`,
  },
];

/* ──────────────────────────────────────────────
   Detectar si un registro está soft-deleted
   ────────────────────────────────────────────── */
function estaBorrado(r) {
  return Boolean(
    r?.deletedAt || r?.deleted === true || r?.isDeleted === true || r?.eliminado === true
  );
}

function fechaBorrado(r) {
  return r?.deletedAt || r?.fechaEliminacion || null;
}

export default function Papelera() {
  return (
    <InventarioLayout
      title="Papelera de reciclaje"
      subtitle="Registros eliminados — restaurar o eliminar definitivamente"
    >
      <Content />
    </InventarioLayout>
  );
}

function Content() {
  const toast = useToast();
  const [tab, setTab] = useState("equipos");
  const [data, setData] = useState({});      // { entidadKey: [registros borrados] }
  const [loading, setLoading] = useState(false);
  // confirm: { tipo: 'restore'|'hard', entidad, row }
  const [confirm, setConfirm] = useState(null);

  const entidadActual = ENTIDADES.find((e) => e.key === tab);

  const cargar = async (entidad) => {
    setLoading(true);
    try {
      const res = await entidad.fetch();
      const lista = entidad.extractList(res) || [];
      const borrados = lista.filter(estaBorrado);
      setData((d) => ({ ...d, [entidad.key]: borrados }));
    } catch (err) {
      console.error(`Error cargando papelera de ${entidad.key}:`, err);
      toast.error("Error", err.response?.data?.message || `No se pudo cargar la papelera de ${entidad.label.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (entidadActual && data[entidadActual.key] === undefined) {
      cargar(entidadActual);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const onRestore = async () => {
    const { entidad, row } = confirm;
    setConfirm(null);
    try {
      await entidad.service.restore(row._id);
      toast.success("Restaurado", `Se restauró el ${entidad.singular}`);
      cargar(entidad);
    } catch (err) {
      toast.error("Error", err.response?.data?.message || "No se pudo restaurar");
    }
  };

  const onHardDelete = async () => {
    const { entidad, row } = confirm;
    setConfirm(null);
    try {
      const res = await entidad.service.hardDelete(row._id);
      const desvinc = res?.actividadesDesvinculadas;
      toast.success(
        "Eliminado definitivamente",
        desvinc != null
          ? `Se eliminó el ${entidad.singular}. ${desvinc} actividad(es) desvinculada(s) para preservar el histórico.`
          : `El ${entidad.singular} fue eliminado permanentemente.`
      );
      cargar(entidad);
    } catch (err) {
      toast.error("Error", err.response?.data?.message || "No se pudo eliminar definitivamente");
    }
  };

  const registros = data[entidadActual?.key] ?? null;

  // Columnas: las propias de la entidad + fecha de borrado + acciones
  const columnas = [
    ...(entidadActual?.columns || []),
    {
      key: "_deletedAt",
      header: "Eliminado",
      width: 130,
      render: (r) => {
        const f = fechaBorrado(r);
        return f
          ? <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{fmtFechaHora(f)}</span>
          : <span style={{ color: "var(--text-muted)" }}>—</span>;
      },
    },
    {
      key: "_acciones",
      header: "",
      width: 200,
      render: (r) => (
        <div style={{ display: "flex", gap: 6 }}>
          <button
            className="inv-btn inv-btn-sm"
            style={{ background: "var(--inv-success)", color: "#fff" }}
            onClick={() => setConfirm({ tipo: "restore", entidad: entidadActual, row: r })}
          >
            ↺ Restaurar
          </button>
          <button
            className="inv-btn inv-btn-danger inv-btn-sm"
            onClick={() => setConfirm({ tipo: "hard", entidad: entidadActual, row: r })}
          >
            {Icon.trash} Eliminar definitivo
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Tabs por entidad */}
      <div style={tabsStyle}>
        {ENTIDADES.map((e) => {
          const cant = data[e.key]?.length;
          return (
            <button
              key={e.key}
              onClick={() => setTab(e.key)}
              style={{ ...tabBtnStyle, ...(tab === e.key ? tabActiveStyle : {}) }}
            >
              {e.label}
              {cant != null && cant > 0 && (
                <span style={{
                  marginLeft: 8,
                  background: tab === e.key ? "var(--accent)" : "var(--card-border)",
                  color: tab === e.key ? "#fff" : "var(--text-secondary)",
                  borderRadius: 999,
                  padding: "1px 7px",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                }}>{cant}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="inv-card">
        <div className="inv-card-body">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
            <div style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
              {registros == null
                ? "Cargando..."
                : `${registros.length} ${entidadActual.singular}${registros.length !== 1 ? "s" : ""} en la papelera`}
            </div>
            <button className="inv-btn inv-btn-outline" onClick={() => cargar(entidadActual)} disabled={loading}>
              {loading ? <span className="inv-spinner" /> : Icon.refresh}
              Actualizar
            </button>
          </div>

          <div style={{
            background: "var(--inv-warning-bg)",
            color: "var(--inv-warning)",
            borderRadius: 8,
            padding: "10px 14px",
            fontSize: "0.85rem",
            marginBottom: 14,
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
          }}>
            <span>⚠</span>
            <div>
              <strong>Restaurar</strong> devuelve el registro al inventario activo. <strong>Eliminar definitivo</strong> es irreversible y solo procede si no rompe integridad (ej. una marca con modelos no se puede purgar). Las actividades vinculadas a un equipo no bloquean su borrado: se desvinculan para conservar el histórico.
            </div>
          </div>

          <InvTable
            loading={loading || registros == null}
            data={registros || []}
            rowsPerPage={20}
            emptyMessage={`No hay ${entidadActual?.label.toLowerCase()} en la papelera`}
            columns={columnas}
          />
        </div>
      </div>

      {/* Confirmaciones */}
      <ConfirmModal
        open={confirm?.tipo === "restore"}
        title="Restaurar registro"
        message={confirm ? `¿Restaurar ${confirm.entidad.nombrePara(confirm.row)}? Volverá al inventario activo.` : ""}
        confirmLabel="Restaurar"
        onCancel={() => setConfirm(null)}
        onConfirm={onRestore}
      />
      <ConfirmModal
        open={confirm?.tipo === "hard"}
        title="Eliminar definitivamente"
        message={confirm
          ? `¿Eliminar PERMANENTEMENTE ${confirm.entidad.nombrePara(confirm.row)}? Esta acción no se puede deshacer.`
          : ""}
        confirmLabel="Eliminar definitivo"
        danger
        onCancel={() => setConfirm(null)}
        onConfirm={onHardDelete}
      />
    </>
  );
}

/* ─── estilos de tabs ─── */
const tabsStyle = {
  display: "flex",
  gap: 4,
  marginBottom: 18,
  borderBottom: "1px solid var(--card-border)",
  flexWrap: "wrap",
};
const tabBtnStyle = {
  background: "transparent",
  borderTop: "none",
  borderLeft: "none",
  borderRight: "none",
  borderBottomWidth: 2,
  borderBottomStyle: "solid",
  borderBottomColor: "transparent",
  padding: "10px 16px",
  cursor: "pointer",
  fontSize: "0.88rem",
  fontWeight: 600,
  color: "var(--text-muted)",
  fontFamily: "inherit",
  marginBottom: -1,
  display: "flex",
  alignItems: "center",
};
const tabActiveStyle = {
  color: "var(--accent)",
  borderBottomColor: "var(--accent)",
};

/* ─── helpers ─── */
function fmtFecha(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch { return iso; }
}
function fmtFechaHora(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("es-CO", {
      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
}
