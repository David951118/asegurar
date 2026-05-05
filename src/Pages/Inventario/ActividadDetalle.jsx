import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InventarioLayout from "./Layout";
import GpsService from "../../Services/gpsApi";
import { ConfirmModal, Icon, InvTag, useToast } from "./components";

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

const DESTINO = {
  AL_CENTRO: { label: "Devuelto al centro", severity: "info" },
  AL_CLIENTE: { label: "Devuelto al cliente", severity: "warning" },
  DESCARTADO: { label: "Descartado", severity: "danger" },
};

export default function ActividadDetalle() {
  const { id } = useParams();
  return (
    <InventarioLayout title="Detalle de actividad" subtitle={id}>
      <DetalleContent id={id} />
    </InventarioLayout>
  );
}

function DetalleContent({ id }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDel, setConfirmDel] = useState(false);

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await GpsService.detalleActividad(id);
      setData(res?.actividad || res);
    } catch (err) {
      toast.error("Error", err.response?.data?.message || "No se pudo cargar el detalle");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    setConfirmDel(false);
    try {
      await GpsService.eliminarActividad(id);
      toast.success("Eliminada", "Actividad removida");
      setTimeout(() => navigate("/inventario/actividades"), 500);
    } catch (err) {
      toast.error("Error", err.response?.data?.message || "No se pudo eliminar");
    }
  };

  if (loading) {
    return (
      <div className="inv-card">
        <div className="inv-card-body">
          <div className="inv-loading">
            <span className="inv-spinner" /> Cargando...
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="inv-card">
        <div className="inv-card-body">
          <div className="inv-loading">
            No se encontró la actividad.
            <div style={{ marginTop: 12 }}>
              <button className="inv-btn" onClick={() => navigate("/inventario/actividades")}>
                Volver al listado
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="inv-card" style={{ maxWidth: 980, margin: "0 auto" }}>
        <div className="inv-card-body">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, paddingBottom: 16, borderBottom: "1px solid var(--card-border)", marginBottom: 18 }}>
            <div>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 4 }}>
                <InvTag value={TIPO_LABEL[data.tipoActividad] || data.tipoActividad} severity="info" />
                <span style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "1rem" }}>
                  {formatFecha(data.fechaActividad)}
                </span>
              </div>
              <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.85rem" }}>
                Registrada por {data.registradoPor?.username || "—"} · {data.ciudad?.nombre || "—"}
              </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="inv-btn inv-btn-outline" onClick={() => navigate("/inventario/actividades")}>
                {Icon.arrowLeft} Volver
              </button>
              <button className="inv-btn inv-btn-danger-outline" onClick={() => setConfirmDel(true)}>
                {Icon.trash} Eliminar
              </button>
            </div>
          </div>

          {/* Operación */}
          <Section title="Operación">
            <div className="inv-kv-grid">
              <KV label="Técnico" value={`${data.tecnico?.nombres || ""} ${data.tecnico?.apellidos || ""}`.trim() || "—"} />
              <KV label="Identificación técnico" value={data.tecnico?.identificacion || "—"} />
              <KV label="Ciudad" value={
                <>
                  {data.ciudad?.nombre || "—"}
                  {data.ciudad?.esCentral && <InvTag value="Central" severity="info" />}
                </>
              } />
              <KV label="Placa" value={data.placaInstalada || "—"} />
              <KV label="Vehículo en plataforma" value={
                data.vehiculo?.placa
                  ? `${data.vehiculo.placa}${data.vehiculo.numeroInterno ? ` · #${data.vehiculo.numeroInterno}` : ""}`
                  : "—"
              } />
              <KV label="SIM / Línea" value={
                data.lineaSim || data.numeroSim
                  ? `${data.lineaSim || ""}${data.numeroSim ? ` · ${data.numeroSim}` : ""}`
                  : "—"
              } />
              <KV label="Tipo propiedad (instalado)" value={
                data.tipoPropiedad
                  ? `${data.tipoPropiedad}${data.propietarioNombre ? ` · ${data.propietarioNombre}` : ""}`
                  : "—"
              } />
            </div>
          </Section>

          {/* Equipo instalado */}
          {data.equipoInstalado && (
            <Section title="Equipo instalado">
              <div className="inv-kv-grid">
                <KV label="IMEI" value={data.equipoInstalado.imei || "—"} />
                <KV label="Marca / Modelo" value={`${data.equipoInstalado.marca?.nombre || ""} ${data.equipoInstalado.modelo?.nombre || ""}`.trim() || "—"} />
                <KV label="Estado" value={<InvTag value={data.equipoInstalado.estado} severity="success" />} />
                <KV label="Propiedad" value={
                  `${data.equipoInstalado.tipoPropiedad}${data.equipoInstalado.propietarioNombre ? ` · ${data.equipoInstalado.propietarioNombre}` : ""}`
                } />
              </div>
            </Section>
          )}

          {/* Equipo retirado */}
          {data.equipoRetirado && (
            <Section
              title={
                <>
                  Equipo retirado
                  {data.equipoRetiradoExistia === false && <InvTag value="Auto-creado" severity="warning" />}
                  {data.destinoEquipoRetirado && DESTINO[data.destinoEquipoRetirado] && (
                    <InvTag
                      value={DESTINO[data.destinoEquipoRetirado].label}
                      severity={DESTINO[data.destinoEquipoRetirado].severity}
                    />
                  )}
                </>
              }
            >
              <div className="inv-kv-grid">
                <KV label="IMEI" value={data.equipoRetirado.imei || "—"} />
                <KV label="Estado actual" value={
                  <InvTag
                    value={data.equipoRetirado.estado}
                    severity={
                      data.equipoRetirado.estado === "RETIRADO" ? "danger"
                      : data.equipoRetirado.estado === "DEVUELTO_CLIENTE" ? "warning"
                      : "info"
                    }
                  />
                } />
                <KV label="Propiedad" value={
                  `${data.equipoRetirado.tipoPropiedad}${data.equipoRetirado.propietarioNombre ? ` · ${data.equipoRetirado.propietarioNombre}` : ""}`
                } />
              </div>
            </Section>
          )}

          {/* Observaciones */}
          {data.observaciones && (
            <Section title="Observaciones">
              <p style={{ margin: 0, color: "var(--text-secondary)", whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                {data.observaciones}
              </p>
            </Section>
          )}
        </div>
      </div>

      <ConfirmModal
        open={confirmDel}
        title="Eliminar actividad"
        message="¿Eliminar esta actividad? Esto puede afectar el estado del inventario."
        confirmLabel="Eliminar"
        danger
        onCancel={() => setConfirmDel(false)}
        onConfirm={onDelete}
      />
    </>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ padding: "14px 0", borderBottom: "1px solid var(--card-border)" }}>
      <h4 style={{
        margin: "0 0 12px 0",
        fontSize: "0.78rem",
        fontWeight: 700,
        color: "var(--text-primary)",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        display: "flex",
        gap: 8,
        alignItems: "center",
        flexWrap: "wrap",
      }}>
        {title}
      </h4>
      {children}
    </div>
  );
}

function KV({ label, value }) {
  return (
    <div className="inv-kv">
      <label>{label}</label>
      <b>{value}</b>
    </div>
  );
}

function formatFecha(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("es-CO", {
      day: "2-digit", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
}
