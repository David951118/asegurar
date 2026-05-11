import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InventarioLayout from "./Layout";
import { EquiposService } from "../../Services/gpsApi";
import { ConfirmModal, Icon, InvTag, useToast } from "./components";
import { ESTADO_SEVERITY } from "./Equipos";
import {
  EnviarModal,
  InstalarModal,
  RetirarModal,
  RevisarModal,
  EnviarGarantiaModal,
  RecibirGarantiaModal,
  ConfirmarRecepcionModal,
} from "./EquipoActions";

export default function EquipoDetalle() {
  const { id } = useParams();
  return (
    <InventarioLayout title="Detalle de equipo" subtitle={id}>
      <Content id={id} />
    </InventarioLayout>
  );
}

function Content({ id }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [eq, setEq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDel, setConfirmDel] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchEq(); }, [id]);

  const fetchEq = async () => {
    setLoading(true);
    try {
      const res = await EquiposService.get(id);
      setEq(res?.equipo || res);
    } catch (err) {
      toast.error("Error", err.response?.data?.message || "No se pudo cargar el equipo");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    setConfirmDel(false);
    try {
      await EquiposService.remove(id);
      toast.success("Eliminado", "Equipo removido del inventario");
      setTimeout(() => navigate("/inventario/equipos"), 500);
    } catch (err) {
      toast.error("Error", err.response?.data?.message || "No se pudo eliminar");
    }
  };

  if (loading) {
    return <div className="inv-card"><div className="inv-card-body"><div className="inv-loading"><span className="inv-spinner" /> Cargando...</div></div></div>;
  }
  if (!eq) {
    return <div className="inv-card"><div className="inv-card-body"><div className="inv-loading">Equipo no encontrado</div></div></div>;
  }

  const estado = eq.estado;
  const acciones = transicionesValidas(estado);

  return (
    <>
      <div className="inv-card" style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div className="inv-card-body">
          {/* Header */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "flex-start",
            flexWrap: "wrap", gap: 12, paddingBottom: 16,
            borderBottom: "1px solid var(--card-border)", marginBottom: 18,
          }}>
            <div>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                <InvTag value={eq.estado} severity={ESTADO_SEVERITY[eq.estado] || "neutral"} />
                <InvTag value={eq.condicion} severity={eq.condicion === "NUEVO" ? "info" : "neutral"} />
                {eq.yaUsado && <InvTag value="Ya usado" severity="warning" />}
              </div>
              <h2 style={{ margin: "0 0 4px", fontSize: "1.05rem", color: "var(--text-primary)" }}>
                {eq.marca?.nombre || ""} {eq.modelo?.nombre || ""}
              </h2>
              <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.85rem" }}>
                IMEI: <b style={{ color: "var(--text-secondary)" }}>{eq.imei}</b>
                {eq.serial && <> · Serial: {eq.serial}</>}
                {eq.idEquipo && <> · ID: {eq.idEquipo}</>}
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="inv-btn inv-btn-outline" onClick={() => navigate("/inventario/equipos")}>
                {Icon.arrowLeft} Volver
              </button>
              <button className="inv-btn inv-btn-secondary" onClick={() => navigate(`/inventario/equipos/${id}/editar`)}>
                Editar
              </button>
              <button className="inv-btn inv-btn-danger-outline" onClick={() => setConfirmDel(true)}>
                {Icon.trash} Eliminar
              </button>
            </div>
          </div>

          {/* Acciones de transición */}
          {acciones.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <h4 style={{
                margin: "0 0 10px 0", fontSize: "0.78rem", fontWeight: 700,
                color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: 0.5,
              }}>
                Acciones disponibles
              </h4>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {acciones.map((a) => (
                  <button
                    key={a.key}
                    className={`inv-btn ${a.danger ? "inv-btn-danger-outline" : "inv-btn-secondary"}`}
                    onClick={() => setActiveModal(a.key)}
                  >
                    {a.icon} {a.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Información */}
          <Section title="Ubicación actual">
            <div className="inv-kv-grid">
              <KV label="Ciudad" value={
                <>
                  {eq.ciudad?.nombre || "—"}
                  {eq.ciudad?.esCentral && <InvTag value="Central" severity="info" />}
                </>
              } />
              <KV label="Técnico actual" value={
                eq.tecnico
                  ? `${eq.tecnico.nombres || ""} ${eq.tecnico.apellidos || ""}`.trim() ||
                    eq.tecnico.identificacion
                  : "—"
              } />
              {eq.estado === "INSTALADO" && (
                <>
                  <KV label="Placa instalada" value={eq.placaInstalada || "—"} />
                  <KV label="Vehículo plataforma" value={eq.vehiculo?.placa || "—"} />
                  <KV label="Línea / Número SIM" value={
                    [eq.lineaSim, eq.numeroSim].filter(Boolean).join(" · ") || "—"
                  } />
                </>
              )}
            </div>
          </Section>

          <Section title="Propiedad">
            <div className="inv-kv-grid">
              <KV label="Tipo de propiedad" value={eq.tipoPropiedad || "—"} />
              <KV label="Propietario" value={eq.propietarioNombre || "—"} />
            </div>
          </Section>

          {eq.estado === "EN_GARANTIA" && (
            <Section title="Garantía">
              <div className="inv-kv-grid">
                <KV label="Motivo" value={eq.garantiaMotivo || "—"} />
                <KV label="Proveedor" value={eq.garantiaProveedor || "—"} />
                <KV label="Fecha envío" value={formatFecha(eq.fechaEnvioGarantia)} />
              </div>
            </Section>
          )}

          {eq.observaciones && (
            <Section title="Observaciones">
              <p style={{ margin: 0, color: "var(--text-secondary)", whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                {eq.observaciones}
              </p>
            </Section>
          )}

          {/* Historial */}
          {Array.isArray(eq.historial) && eq.historial.length > 0 && (
            <Section title="Historial de movimientos">
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {eq.historial.slice().reverse().map((h, i) => (
                  <li key={i} style={{
                    padding: "10px 12px",
                    borderBottom: "1px solid var(--card-border)",
                    fontSize: "0.85rem",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                      <div>
                        <InvTag value={h.estadoNuevo || h.accion} severity="info" />
                        <span style={{ marginLeft: 8, color: "var(--text-secondary)" }}>
                          {h.observaciones || h.descripcion || ""}
                        </span>
                      </div>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
                        {formatFecha(h.fecha || h.createdAt)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      </div>

      {/* Modales */}
      <EnviarModal open={activeModal === "enviar"} equipo={eq}
        onClose={() => setActiveModal(null)}
        onSuccess={() => { setActiveModal(null); fetchEq(); }} />
      <InstalarModal open={activeModal === "instalar"} equipo={eq}
        onClose={() => setActiveModal(null)}
        onSuccess={() => { setActiveModal(null); fetchEq(); }} />
      <RetirarModal open={activeModal === "retirar"} equipo={eq}
        onClose={() => setActiveModal(null)}
        onSuccess={() => { setActiveModal(null); fetchEq(); }} />
      <RevisarModal open={activeModal === "revisar"} equipo={eq}
        onClose={() => setActiveModal(null)}
        onSuccess={() => { setActiveModal(null); fetchEq(); }} />
      <EnviarGarantiaModal open={activeModal === "enviarGarantia"} equipo={eq}
        onClose={() => setActiveModal(null)}
        onSuccess={() => { setActiveModal(null); fetchEq(); }} />
      <RecibirGarantiaModal open={activeModal === "recibirGarantia"} equipo={eq}
        onClose={() => setActiveModal(null)}
        onSuccess={() => { setActiveModal(null); fetchEq(); }} />
      <ConfirmarRecepcionModal open={activeModal === "confirmarRecepcion"} equipo={eq}
        onClose={() => setActiveModal(null)}
        onSuccess={() => { setActiveModal(null); fetchEq(); }} />

      <ConfirmModal
        open={confirmDel}
        title="Eliminar equipo"
        message={`¿Enviar a la papelera el equipo IMEI ${eq.imei}? Quedará desasignado de su técnico y vehículo. Podrás restaurarlo desde la Papelera.`}
        confirmLabel="Eliminar"
        danger
        onCancel={() => setConfirmDel(false)}
        onConfirm={onDelete}
      />
    </>
  );
}

function transicionesValidas(estado) {
  const todas = {
    enviar: { key: "enviar", label: "Enviar / asignar técnico", icon: "→", danger: false, validIf: ["DISPONIBLE"] },
    confirmarRecepcion: { key: "confirmarRecepcion", label: "Confirmar recepción", icon: "✓", danger: false, validIf: ["EN_TRANSITO"] },
    instalar: { key: "instalar", label: "Instalar", icon: "✓", danger: false, validIf: ["EN_TRANSITO", "EN_POSESION_TECNICO"] },
    retirar: { key: "retirar", label: "Retirar a revisión", icon: "↩", danger: false, validIf: ["INSTALADO"] },
    revisar: { key: "revisar", label: "Procesar revisión", icon: "🔍", danger: false, validIf: ["EN_REVISION"] },
    enviarGarantia: { key: "enviarGarantia", label: "Enviar a garantía", icon: "⚠", danger: false, validIf: ["DISPONIBLE", "EN_REVISION"] },
    recibirGarantia: { key: "recibirGarantia", label: "Recibir de garantía", icon: "✓", danger: false, validIf: ["EN_GARANTIA"] },
  };
  return Object.values(todas).filter((a) => a.validIf.includes(estado));
}

function Section({ title, children }) {
  return (
    <div style={{ padding: "14px 0", borderBottom: "1px solid var(--card-border)" }}>
      <h4 style={{
        margin: "0 0 12px 0", fontSize: "0.78rem", fontWeight: 700,
        color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: 0.5,
        display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap",
      }}>{title}</h4>
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
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
}
