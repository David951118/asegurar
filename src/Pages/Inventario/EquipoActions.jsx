import React, { useEffect, useState } from "react";
import {
  EquiposService,
  CiudadesService,
  TecnicosService,
} from "../../Services/gpsApi";
import { Icon, InvSelect, useToast } from "./components";

/* ─────────────────────────────────────────────
   Modal genérico de transición de estado
   props: open, equipo, onClose, onSuccess
   ───────────────────────────────────────────── */

function ActionModalBase({ open, title, subtitle, onClose, onSubmit, submitLabel, danger, children, valid = true }) {
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="inv-modal-backdrop" onClick={onClose}>
      <form className="inv-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} style={{ maxWidth: 540 }}>
        <div className="inv-modal-header">
          <h3>{title}</h3>
          {subtitle && <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: "0.82rem" }}>{subtitle}</p>}
        </div>
        <div className="inv-modal-body">{children}</div>
        <div className="inv-modal-footer">
          <button type="button" className="inv-btn inv-btn-outline" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className={`inv-btn ${danger ? "inv-btn-danger" : ""}`} disabled={!valid || submitting}>
            {submitting ? <span className="inv-spinner" /> : Icon.check}
            {submitting ? "Procesando..." : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ─── Enviar / Asignar (DISPONIBLE → EN_TRANSITO) ─── */
export function EnviarModal({ open, equipo, onClose, onSuccess }) {
  const toast = useToast();
  const [ciudad, setCiudad] = useState("");
  const [tecnico, setTecnico] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [ciudades, setCiudades] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);

  useEffect(() => {
    if (!open) return;
    setCiudad(""); setTecnico(""); setObservaciones("");
    Promise.all([
      CiudadesService.list({ limit: 1000 }).catch(() => []),
      TecnicosService.list({ limit: 1000 }).catch(() => []),
    ]).then(([c, t]) => {
      setCiudades(asArr(c).map((x) => ({ value: x._id, label: x.nombre, esCentral: x.esCentral })));
      setTecnicos(asArr(t).map((x) => ({
        value: x._id,
        label: `${x.nombres || ""} ${x.apellidos || ""}`.trim(),
        ciudadId: x.ciudad?._id || x.ciudad,
      })));
    });
  }, [open]);

  // Filtrar técnicos por ciudad seleccionada
  const tecnicosFiltrados = ciudad ? tecnicos.filter((t) => t.ciudadId === ciudad) : tecnicos;

  // Determinar el caso (para el hint visual)
  const ciudadOrigen = equipo?.ciudad?._id || equipo?.ciudad;
  const ciudadOrigenObj = ciudades.find((c) => c.value === ciudadOrigen);
  const ciudadDestinoObj = ciudades.find((c) => c.value === ciudad);
  let escenario = null;
  if (ciudad && ciudadOrigen) {
    if (ciudad === ciudadOrigen) {
      escenario = { tipo: "local", texto: "Asignación a técnico local — el equipo no se mueve de ciudad" };
    } else if (ciudadOrigenObj?.esCentral) {
      escenario = { tipo: "distribucion", texto: "Distribución desde la central → sede" };
    } else {
      escenario = { tipo: "transferencia", texto: `Transferencia entre ciudades: ${ciudadOrigenObj?.label || "—"} → ${ciudadDestinoObj?.label || "—"}` };
    }
  }

  const handle = async () => {
    try {
      await EquiposService.enviar(equipo._id, { ciudad, tecnico, observaciones });
      toast.success("Equipo asignado", "Estado: EN_TRANSITO");
      onSuccess?.();
    } catch (err) {
      toast.error("Error", err.response?.data?.message || "No se pudo enviar");
    }
  };

  return (
    <ActionModalBase
      open={open}
      title="Enviar / asignar equipo"
      subtitle="DISPONIBLE → EN_TRANSITO"
      onClose={onClose}
      onSubmit={handle}
      submitLabel="Confirmar envío"
      valid={!!ciudad && !!tecnico}
    >
      <div className="inv-form-grid">
        <div className="inv-field full">
          <small style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
            Ciudad actual del equipo: <strong style={{ color: "var(--text-secondary)" }}>
              {ciudadOrigenObj?.label || equipo?.ciudad?.nombre || "—"}
              {ciudadOrigenObj?.esCentral && " (Central)"}
            </strong>
          </small>
        </div>

        <div className="inv-field full">
          <label>Ciudad destino <span className="req">*</span></label>
          <InvSelect
            value={ciudad}
            options={ciudades}
            onChange={(v) => { setCiudad(v); setTecnico(""); }}
            placeholder="Seleccione ciudad"
          />
        </div>

        <div className="inv-field full">
          <label>Técnico <span className="req">*</span></label>
          <InvSelect
            value={tecnico}
            options={tecnicosFiltrados}
            onChange={setTecnico}
            placeholder={ciudad ? "Seleccione técnico" : "Primero seleccione ciudad"}
            isDisabled={!ciudad}
          />
          {ciudad && tecnicosFiltrados.length === 0 && (
            <small className="err">No hay técnicos asignados a esta ciudad</small>
          )}
        </div>

        {escenario && (
          <div className="inv-field full">
            <div className={`inv-alert ${escenario.tipo === "local" ? "info" : "baja"}`}>
              <span style={{ marginTop: 1 }}>ℹ</span>
              <div>{escenario.texto}</div>
            </div>
          </div>
        )}

        <div className="inv-field full">
          <label>Observaciones</label>
          <textarea
            className="inv-textarea"
            rows={2}
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          />
        </div>
      </div>
    </ActionModalBase>
  );
}

/* ─── Instalar (EN_TRANSITO → INSTALADO) ─── */
export function InstalarModal({ open, equipo, onClose, onSuccess }) {
  const toast = useToast();
  const [vehiculo, setVehiculo] = useState("");
  const [observaciones, setObservaciones] = useState("");

  useEffect(() => {
    if (!open) return;
    setVehiculo(""); setObservaciones("");
  }, [open]);

  const handle = async () => {
    try {
      const body = { observaciones };
      if (vehiculo) body.vehiculo = vehiculo;
      await EquiposService.instalar(equipo._id, body);
      toast.success("Equipo instalado", "Estado: INSTALADO");
      onSuccess?.();
    } catch (err) {
      toast.error("Error", err.response?.data?.message || "No se pudo instalar");
    }
  };

  return (
    <ActionModalBase
      open={open}
      title="Instalar equipo"
      subtitle="EN_TRANSITO → INSTALADO"
      onClose={onClose}
      onSubmit={handle}
      submitLabel="Marcar como instalado"
    >
      <div className="inv-form-grid">
        <div className="inv-field full">
          <label>Vehículo (ObjectId, opcional)</label>
          <input
            className="inv-input"
            value={vehiculo}
            onChange={(e) => setVehiculo(e.target.value.trim())}
            placeholder="Ej: 65f1a8b9..."
          />
          <small style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
            Si se especifica, vincula el equipo a un vehículo registrado en plataforma.
          </small>
        </div>
        <div className="inv-field full">
          <label>Observaciones</label>
          <textarea
            className="inv-textarea"
            rows={2}
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          />
        </div>
      </div>
    </ActionModalBase>
  );
}

/* ─── Retirar (INSTALADO → EN_REVISION) ─── */
export function RetirarModal({ open, equipo, onClose, onSuccess }) {
  const toast = useToast();
  const [observaciones, setObservaciones] = useState("");

  useEffect(() => { if (open) setObservaciones(""); }, [open]);

  const handle = async () => {
    try {
      await EquiposService.retirar(equipo._id, { observaciones });
      toast.success("Equipo retirado", "Estado: EN_REVISION");
      onSuccess?.();
    } catch (err) {
      toast.error("Error", err.response?.data?.message || "No se pudo retirar");
    }
  };

  return (
    <ActionModalBase
      open={open}
      title="Retirar equipo"
      subtitle="INSTALADO → EN_REVISION"
      onClose={onClose}
      onSubmit={handle}
      submitLabel="Retirar"
    >
      <div className="inv-field full">
        <label>Observaciones</label>
        <textarea
          className="inv-textarea"
          rows={3}
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Motivo del retiro, condición del equipo..."
        />
      </div>
    </ActionModalBase>
  );
}

/* ─── Revisar (EN_REVISION → REUSAR / DEVOLVER_CENTRAL / DESCARTAR) ─── */
export function RevisarModal({ open, equipo, onClose, onSuccess }) {
  const toast = useToast();
  const [accion, setAccion] = useState("DEVOLVER_CENTRAL");
  const [tecnico, setTecnico] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [ciudades, setCiudades] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);

  useEffect(() => {
    if (!open) return;
    setAccion("DEVOLVER_CENTRAL"); setTecnico(""); setCiudad(""); setObservaciones("");
    Promise.all([
      CiudadesService.list().catch(() => []),
      TecnicosService.list().catch(() => []),
    ]).then(([c, t]) => {
      setCiudades(asArr(c).map((x) => ({ value: x._id, label: x.nombre })));
      setTecnicos(asArr(t).map((x) => ({
        value: x._id,
        label: `${x.nombres || ""} ${x.apellidos || ""}`.trim(),
        ciudadId: x.ciudad?._id || x.ciudad,
      })));
    });
  }, [open]);

  const tecnicosFiltrados = ciudad ? tecnicos.filter((t) => t.ciudadId === ciudad) : tecnicos;

  const handle = async () => {
    try {
      const body = { accion, observaciones };
      if (accion === "REUSAR") {
        if (tecnico) body.tecnico = tecnico;
        if (ciudad) body.ciudad = ciudad;
      }
      await EquiposService.revisar(equipo._id, body);
      const estadoFinal = { REUSAR: "INSTALADO", DEVOLVER_CENTRAL: "DISPONIBLE", DESCARTAR: "RETIRADO" }[accion];
      toast.success("Revisión completada", `Estado: ${estadoFinal}`);
      onSuccess?.();
    } catch (err) {
      toast.error("Error", err.response?.data?.message || "No se pudo procesar la revisión");
    }
  };

  return (
    <ActionModalBase
      open={open}
      title="Procesar revisión"
      subtitle="Decide el destino del equipo en revisión"
      onClose={onClose}
      onSubmit={handle}
      submitLabel="Confirmar"
      danger={accion === "DESCARTAR"}
      valid={accion !== "REUSAR" || (!!tecnico && !!ciudad)}
    >
      <div className="inv-form-grid">
        <div className="inv-field full">
          <label>Acción <span className="req">*</span></label>
          <InvSelect
            value={accion}
            options={[
              { value: "DEVOLVER_CENTRAL", label: "Devolver al centro (DISPONIBLE en Pasto)" },
              { value: "REUSAR", label: "Reusar / Reasignar (INSTALADO con técnico)" },
              { value: "DESCARTAR", label: "Descartar (RETIRADO definitivo)" },
            ]}
            onChange={setAccion}
            isClearable={false}
          />
        </div>

        {accion === "REUSAR" && (
          <>
            <div className="inv-field full">
              <label>Ciudad <span className="req">*</span></label>
              <InvSelect value={ciudad} options={ciudades} onChange={(v) => { setCiudad(v); setTecnico(""); }} />
            </div>
            <div className="inv-field full">
              <label>Técnico <span className="req">*</span></label>
              <InvSelect
                value={tecnico}
                options={tecnicosFiltrados}
                onChange={setTecnico}
                isDisabled={!ciudad}
              />
            </div>
          </>
        )}

        <div className="inv-field full">
          <label>Observaciones</label>
          <textarea className="inv-textarea" rows={2} value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
        </div>
      </div>
    </ActionModalBase>
  );
}

/* ─── Enviar a garantía (DISPONIBLE/EN_REVISION → EN_GARANTIA) ─── */
export function EnviarGarantiaModal({ open, equipo, onClose, onSuccess }) {
  const toast = useToast();
  const [motivo, setMotivo] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [observaciones, setObservaciones] = useState("");

  useEffect(() => {
    if (!open) return;
    setMotivo(""); setProveedor(""); setObservaciones("");
  }, [open]);

  const handle = async () => {
    try {
      const body = { motivo, observaciones };
      if (proveedor) body.proveedor = proveedor;
      await EquiposService.enviarGarantia(equipo._id, body);
      toast.success("Enviado a garantía", "Estado: EN_GARANTIA");
      onSuccess?.();
    } catch (err) {
      toast.error("Error", err.response?.data?.message || "No se pudo enviar");
    }
  };

  return (
    <ActionModalBase
      open={open}
      title="Enviar a garantía"
      subtitle="DISPONIBLE / EN_REVISION → EN_GARANTIA"
      onClose={onClose}
      onSubmit={handle}
      submitLabel="Enviar a garantía"
      valid={!!motivo}
    >
      <div className="inv-form-grid">
        <div className="inv-field full">
          <label>Motivo <span className="req">*</span></label>
          <input
            className="inv-input"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ej: Falla GPS, no enciende..."
          />
        </div>
        <div className="inv-field full">
          <label>Proveedor</label>
          <input
            className="inv-input"
            value={proveedor}
            onChange={(e) => setProveedor(e.target.value)}
            placeholder="Ej: Queclink, Teltonika"
          />
        </div>
        <div className="inv-field full">
          <label>Observaciones</label>
          <textarea className="inv-textarea" rows={2} value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
        </div>
      </div>
    </ActionModalBase>
  );
}

/* ─── Recibir de garantía (EN_GARANTIA → DISPONIBLE en Pasto) ─── */
export function RecibirGarantiaModal({ open, equipo, onClose, onSuccess }) {
  const toast = useToast();
  const [marcarComoSegunda, setMarcarComoSegunda] = useState(false);
  const [observaciones, setObservaciones] = useState("");

  useEffect(() => {
    if (!open) return;
    setMarcarComoSegunda(false); setObservaciones("");
  }, [open]);

  const handle = async () => {
    try {
      await EquiposService.recibirGarantia(equipo._id, { marcarComoSegunda, observaciones });
      toast.success("Recibido de garantía", "Estado: DISPONIBLE");
      onSuccess?.();
    } catch (err) {
      toast.error("Error", err.response?.data?.message || "No se pudo recibir");
    }
  };

  return (
    <ActionModalBase
      open={open}
      title="Recibir de garantía"
      subtitle="EN_GARANTIA → DISPONIBLE (Pasto)"
      onClose={onClose}
      onSubmit={handle}
      submitLabel="Recibir"
    >
      <div className="inv-form-grid">
        <div className="inv-field full">
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={marcarComoSegunda}
              onChange={(e) => setMarcarComoSegunda(e.target.checked)}
              style={{ width: 16, height: 16 }}
            />
            <span style={{ fontWeight: 500 }}>
              Marcar como SEGUNDA (el proveedor entregó otro equipo físico)
            </span>
          </label>
        </div>
        <div className="inv-field full">
          <label>Observaciones</label>
          <textarea
            className="inv-textarea"
            rows={2}
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          />
        </div>
      </div>
    </ActionModalBase>
  );
}

/* ─── Confirmar recepción (EN_TRANSITO → EN_POSESION_TECNICO) ─── */
export function ConfirmarRecepcionModal({ open, equipo, onClose, onSuccess }) {
  const toast = useToast();
  const [observaciones, setObservaciones] = useState("");

  useEffect(() => { if (open) setObservaciones(""); }, [open]);

  const handle = async () => {
    try {
      await EquiposService.confirmarRecepcion(equipo._id, { observaciones });
      toast.success("Recepción confirmada", "Estado: EN_POSESION_TECNICO");
      onSuccess?.();
    } catch (err) {
      toast.error("Error", err.response?.data?.message || "No se pudo confirmar");
    }
  };

  return (
    <ActionModalBase
      open={open}
      title="Confirmar recepción"
      subtitle="EN_TRANSITO → EN_POSESION_TECNICO"
      onClose={onClose}
      onSubmit={handle}
      submitLabel="Confirmar recepción"
    >
      <p style={{ margin: "0 0 12px 0", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
        El equipo permanecerá con el técnico <strong>
          {equipo?.tecnico ? `${equipo.tecnico.nombres || ""} ${equipo.tecnico.apellidos || ""}`.trim() : "—"}
        </strong>
        {equipo?.ciudad?.nombre && <> en <strong>{equipo.ciudad.nombre}</strong></>}.
      </p>
      <div className="inv-field full">
        <label>Observaciones</label>
        <textarea
          className="inv-textarea"
          rows={3}
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Recibido en buen estado..."
        />
      </div>
    </ActionModalBase>
  );
}

/* ─── Modal de resultado por lotes (207 partial) ─── */
export function BatchResultModal({ open, result, onClose }) {
  if (!open || !result) return null;
  const exitosos = result.exitosos || [];
  const errores = result.errores || [];
  const hasErrors = errores.length > 0;

  return (
    <div className="inv-modal-backdrop" onClick={onClose}>
      <div className="inv-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 600 }}>
        <div className="inv-modal-header">
          <h3>Resultado de la operación</h3>
          <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: "0.82rem" }}>
            {result.ciudadDestino && <>Destino: <strong>{result.ciudadDestino}</strong> · </>}
            {result.tecnico && <>Técnico: <strong>{result.tecnico}</strong></>}
          </p>
        </div>
        <div className="inv-modal-body" style={{ maxHeight: "60vh", overflowY: "auto" }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
            <div className="inv-tag success" style={{ fontSize: "0.82rem" }}>
              ✓ {exitosos.length} {result.totalEnviados != null ? `de ${result.totalEnviados + result.totalErrores}` : ""} exitosos
            </div>
            {hasErrors && (
              <div className="inv-tag danger" style={{ fontSize: "0.82rem" }}>
                ✕ {errores.length} con error
              </div>
            )}
          </div>

          {exitosos.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <h4 style={{ margin: "0 0 8px", fontSize: "0.82rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                Exitosos
              </h4>
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {exitosos.map((e, i) => (
                  <li key={i} style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: "var(--inv-success-bg)",
                    color: "var(--inv-success)",
                    fontSize: "0.85rem",
                    marginBottom: 4,
                  }}>
                    <strong>{e.imei || e.equipoId}</strong>
                    {e.estado && <span style={{ marginLeft: 8, opacity: 0.8 }}>→ {e.estado}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasErrors && (
            <div>
              <h4 style={{ margin: "0 0 8px", fontSize: "0.82rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                Errores
              </h4>
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {errores.map((e, i) => (
                  <li key={i} style={{
                    padding: "8px 10px",
                    borderRadius: 6,
                    background: "var(--inv-danger-bg)",
                    color: "var(--inv-danger)",
                    fontSize: "0.85rem",
                    marginBottom: 4,
                  }}>
                    <div><strong>{e.imei || e.equipoId}</strong></div>
                    <div style={{ opacity: 0.85 }}>{e.message || "Error sin descripción"}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="inv-modal-footer">
          <button className="inv-btn" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

function asArr(v) {
  if (Array.isArray(v)) return v;
  return v?.data || v?.items || v?.tecnicos || v?.ciudades || [];
}
