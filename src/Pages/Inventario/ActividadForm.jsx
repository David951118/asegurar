import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InventarioLayout from "./Layout";
import GpsService, { TecnicosService } from "../../Services/gpsApi";
import { Icon, InvSelect, InvTag, useToast } from "./components";

const TIPOS = [
  { value: "INSTALACION_NUEVA", label: "Instalación nueva" },
  { value: "HOMOLOGACION", label: "Homologación" },
  { value: "CAMBIO_2G_4G", label: "Cambio 2G→4G" },
  { value: "CAMBIO_CON_COSTO", label: "Cambio con costo" },
  { value: "CAMBIO_SIN_COSTO", label: "Cambio sin costo" },
  { value: "CAMBIO_COMODATO", label: "Cambio comodato" },
  { value: "PRUEBAS", label: "Pruebas" },
  { value: "GARANTIA", label: "Garantía" },
  { value: "EQUIPO_DANADO", label: "Equipo dañado" },
];
const TIPOS_SIN_RETIRO = ["INSTALACION_NUEVA", "HOMOLOGACION"];
const PROPIEDADES = [
  { value: "COMODATO", label: "Comodato (Asegurar Ltda.)" },
  { value: "PROPIO", label: "Propio (del cliente)" },
];

const initialForm = {
  tipoActividad: "",
  tecnico: "",
  ciudad: "",
  equipoInstalado: "",
  equipoRetiradoMode: "buscar",
  equipoRetirado: "",
  imeiRetirado: "",
  retiradoEncontrado: null,
  equipoRetiradoNuevo: {
    imei: "",
    serial: "",
    marca: "",
    modelo: "",
    tipoPropiedad: "COMODATO",
    propietarioNombre: "ASEGURAR LTDA",
  },
  placaInstalada: "",
  lineaSim: "",
  numeroSim: "",
  tipoPropiedad: "COMODATO",
  propietarioNombre: "ASEGURAR LTDA",
  fechaActividad: new Date().toISOString().slice(0, 10), // hoy YYYY-MM-DD
  observaciones: "",
};

export default function ActividadForm() {
  return (
    <InventarioLayout
      title="Nueva actividad"
      subtitle="Registro de operación de campo"
    >
      <FormContent />
    </InventarioLayout>
  );
}

function FormContent() {
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [verificando, setVerificando] = useState(false);

  const [tecnicos, setTecnicos] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [equiposDisp, setEquiposDisp] = useState([]);
  const [loadingEquipos, setLoadingEquipos] = useState(false);

  const requiereRetiro = form.tipoActividad && !TIPOS_SIN_RETIRO.includes(form.tipoActividad);

  useEffect(() => {
    cargarCatalogos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (form.tipoPropiedad === "COMODATO") {
      setForm((f) => ({ ...f, propietarioNombre: "ASEGURAR LTDA" }));
    } else if (form.propietarioNombre === "ASEGURAR LTDA") {
      setForm((f) => ({ ...f, propietarioNombre: "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.tipoPropiedad]);

  // Cargar equipos del técnico seleccionado (solo EN_POSESION_TECNICO)
  useEffect(() => {
    if (!form.tecnico) {
      setEquiposDisp([]);
      return;
    }
    setLoadingEquipos(true);
    TecnicosService.equipos(form.tecnico, { estado: "EN_POSESION_TECNICO" })
      .then((res) => {
        const list = res?.equipos || (Array.isArray(res) ? res : []);
        setEquiposDisp(list.map((x) => ({
          value: x._id,
          label: `${x.imei || "(sin IMEI)"} — ${x.marca?.nombre || ""} ${x.modelo?.nombre || ""}`,
          equipo: x,
        })));
      })
      .catch((err) => {
        console.error("Error cargando equipos del técnico:", err);
        setEquiposDisp([]);
      })
      .finally(() => setLoadingEquipos(false));
  }, [form.tecnico]);

  useEffect(() => {
    if (form.equipoRetiradoNuevo.marca) {
      GpsService.listarModelos(form.equipoRetiradoNuevo.marca)
        .then((res) => {
          const list = Array.isArray(res) ? res : res?.data || [];
          setModelos(list.map((m) => ({ value: m._id, label: m.nombre })));
        })
        .catch(() => setModelos([]));
    } else {
      setModelos([]);
    }
  }, [form.equipoRetiradoNuevo.marca]);

  const cargarCatalogos = async () => {
    try {
      const [tecs, cdds, mrcs] = await Promise.all([
        GpsService.listarTecnicos({ limit: 1000 }).catch(() => []),
        GpsService.listarCiudades({ limit: 1000 }).catch(() => []),
        GpsService.listarMarcas({ limit: 1000 }).catch(() => []),
      ]);
      const t = Array.isArray(tecs) ? tecs : tecs?.data || [];
      const c = Array.isArray(cdds) ? cdds : cdds?.data || [];
      const m = Array.isArray(mrcs) ? mrcs : mrcs?.data || [];
      setTecnicos(t.map((x) => ({
        value: x._id,
        label: `${x.nombres || ""} ${x.apellidos || ""}`.trim() || x.identificacion || x._id,
        ciudadId: x.ciudad?._id || x.ciudad,
      })));
      setCiudades(c.map((x) => ({ value: x._id, label: x.nombre })));
      setMarcas(m.map((x) => ({ value: x._id, label: x.nombre })));
    } catch (err) {
      console.error("Error catálogos:", err);
    }
  };

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const updateNested = (parent, key, value) =>
    setForm((f) => ({ ...f, [parent]: { ...f[parent], [key]: value } }));

  const verificarImei = async () => {
    if (!form.imeiRetirado || form.imeiRetirado.length < 10) {
      toast.warn("IMEI incompleto", "Ingrese un IMEI válido (mínimo 10 dígitos)");
      return;
    }
    setVerificando(true);
    try {
      const res = await GpsService.buscarEquipo({ imei: form.imeiRetirado });
      if (res.existe && res.data) {
        setForm((f) => ({
          ...f,
          retiradoEncontrado: res.data,
          equipoRetirado: res.data._id,
          equipoRetiradoMode: "buscar",
        }));
        toast.success("Encontrado", "Equipo localizado en plataforma");
      } else {
        setForm((f) => ({
          ...f,
          retiradoEncontrado: null,
          equipoRetirado: "",
          equipoRetiradoMode: "nuevo",
          equipoRetiradoNuevo: { ...f.equipoRetiradoNuevo, imei: f.imeiRetirado },
        }));
        toast.info("No registrado", "Complete los datos para crearlo en plataforma");
      }
    } catch (err) {
      toast.error("Error", err.response?.data?.message || "No se pudo verificar el IMEI");
    } finally {
      setVerificando(false);
    }
  };

  const validar = () => {
    const e = {};
    if (!form.tipoActividad) e.tipoActividad = "Seleccione un tipo";
    if (!form.tecnico) e.tecnico = "Seleccione un técnico";
    if (!form.ciudad) e.ciudad = "Seleccione una ciudad";
    if (!form.equipoInstalado) e.equipoInstalado = "Seleccione el equipo a instalar";
    if (!form.placaInstalada || !String(form.placaInstalada).trim()) e.placaInstalada = "Ingrese la placa";
    if (!form.tipoPropiedad) e.tipoPropiedad = "Seleccione la propiedad";
    if (form.tipoPropiedad === "PROPIO" && !form.propietarioNombre) e.propietarioNombre = "Ingrese el nombre del propietario";

    if (requiereRetiro) {
      if (form.equipoRetiradoMode === "buscar") {
        if (!form.equipoRetirado) e.equipoRetirado = "Verifique el IMEI o cambie a 'crear nuevo'";
      } else {
        const n = form.equipoRetiradoNuevo;
        if (!n.imei) e.retNuevoImei = "IMEI requerido";
        if (!n.marca) e.retNuevoMarca = "Marca requerida";
        if (!n.modelo) e.retNuevoModelo = "Modelo requerido";
        if (!n.tipoPropiedad) e.retNuevoPropiedad = "Propiedad requerida";
        if (n.tipoPropiedad === "PROPIO" && !n.propietarioNombre) e.retNuevoPropietario = "Nombre requerido";
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validar()) {
      toast.warn("Datos incompletos", "Revise los campos marcados");
      return;
    }

    const payload = {
      tipoActividad: form.tipoActividad,
      tecnico: form.tecnico,
      ciudad: form.ciudad,
      equipoInstalado: form.equipoInstalado,
      placaInstalada: form.placaInstalada,
      tipoPropiedad: form.tipoPropiedad,
      propietarioNombre: form.propietarioNombre || undefined,
    };
    if (form.lineaSim) payload.lineaSim = form.lineaSim;
    if (form.numeroSim) payload.numeroSim = form.numeroSim;
    if (form.fechaActividad) payload.fechaActividad = form.fechaActividad; // YYYY-MM-DD
    if (form.observaciones) payload.observaciones = form.observaciones;

    if (requiereRetiro) {
      if (form.equipoRetiradoMode === "buscar") {
        payload.equipoRetirado = form.equipoRetirado;
      } else {
        const n = form.equipoRetiradoNuevo;
        payload.equipoRetiradoNuevo = {
          imei: n.imei,
          marca: n.marca,
          modelo: n.modelo,
          tipoPropiedad: n.tipoPropiedad,
        };
        if (n.serial) payload.equipoRetiradoNuevo.serial = n.serial;
        if (n.tipoPropiedad === "PROPIO") payload.equipoRetiradoNuevo.propietarioNombre = n.propietarioNombre;
      }
    }

    setSubmitting(true);
    try {
      const data = await GpsService.crearActividad(payload);
      toast.success("Actividad registrada", "La operación fue guardada correctamente");
      const id = data?._id || data?.actividad?._id;
      setTimeout(() => {
        if (id) navigate(`/inventario/actividades/${id}`);
        else navigate("/inventario/actividades");
      }, 600);
    } catch (err) {
      const detail = err.response?.data?.error?.details?.[0]?.message
        || err.response?.data?.message
        || "No se pudo registrar la actividad";
      toast.error("Error", detail);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="inv-card" onSubmit={handleSubmit} style={{ maxWidth: 1080, margin: "0 auto" }}>
      <div className="inv-card-body">
        {/* Datos generales */}
        <div className="inv-form-section">
          <h3>Datos generales</h3>
          <div className="inv-form-grid">
            <div className="inv-field">
              <label>Tipo de actividad <span className="req">*</span></label>
              <InvSelect
                value={form.tipoActividad}
                options={TIPOS}
                onChange={(v) => update("tipoActividad", v)}
                placeholder="Seleccione tipo"
                isClearable={false}
              />
              {errors.tipoActividad && <small className="err">{errors.tipoActividad}</small>}
            </div>
            <div className="inv-field">
              <label>Fecha de actividad</label>
              <input
                type="date"
                className="inv-input"
                value={form.fechaActividad}
                onChange={(e) => update("fechaActividad", e.target.value)}
              />
            </div>
            <div className="inv-field">
              <label>Técnico <span className="req">*</span></label>
              <InvSelect
                value={form.tecnico}
                options={tecnicos}
                onChange={(v) => {
                  setForm((f) => {
                    const tec = tecnicos.find((t) => t.value === v);
                    return {
                      ...f,
                      tecnico: v,
                      equipoInstalado: "", // limpiar al cambiar técnico
                      ciudad: tec?.ciudadId || f.ciudad,
                    };
                  });
                }}
                placeholder="Seleccione técnico"
              />
              {errors.tecnico && <small className="err">{errors.tecnico}</small>}
            </div>
            <div className="inv-field">
              <label>Ciudad <span className="req">*</span></label>
              <InvSelect
                value={form.ciudad}
                options={ciudades}
                onChange={(v) => update("ciudad", v)}
                placeholder="Seleccione ciudad"
              />
              {errors.ciudad && <small className="err">{errors.ciudad}</small>}
            </div>
          </div>
        </div>

        {/* Equipo a instalar */}
        <div className="inv-form-section">
          <h3>Equipo a instalar</h3>
          <div className="inv-form-grid">
            <div className="inv-field full">
              <label>Equipo <span className="req">*</span></label>
              <InvSelect
                value={form.equipoInstalado}
                options={equiposDisp}
                onChange={(v) => update("equipoInstalado", v)}
                isLoading={loadingEquipos}
                isDisabled={!form.tecnico || loadingEquipos}
                placeholder={
                  !form.tecnico
                    ? "Primero seleccione un técnico"
                    : loadingEquipos
                    ? "Cargando equipos..."
                    : equiposDisp.length === 0
                    ? "El técnico no tiene equipos en posesión"
                    : "Buscar por IMEI / marca..."
                }
              />
              {errors.equipoInstalado && <small className="err">{errors.equipoInstalado}</small>}
              {form.tecnico && !loadingEquipos && equiposDisp.length === 0 && (
                <small style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginTop: 4 }}>
                  Este técnico no tiene equipos en estado <strong>EN_POSESION_TECNICO</strong>. Confirma primero la recepción desde <strong>Equipos</strong>.
                </small>
              )}
              {(() => {
                if (!form.equipoInstalado) return null;
                const opt = equiposDisp.find((o) => o.value === form.equipoInstalado);
                const eq = opt?.equipo;
                if (!eq) return null;
                const ciudadEq = eq.ciudad?._id || eq.ciudad;
                const tieneTecnico = !!(eq.tecnico?._id || eq.tecnico);
                const ciudadCoincide = !form.ciudad || !ciudadEq || ciudadEq === form.ciudad;

                if (!tieneTecnico) {
                  return (
                    <div className="inv-alert alta" style={{ marginTop: 8 }}>
                      <span style={{ marginTop: 1 }}>⚠</span>
                      <div>
                        <b>Este equipo no tiene técnico asignado.</b><br />
                        Antes de registrar la actividad, ve a <strong>Equipos → este equipo → Enviar / asignar técnico</strong> para asignárselo a un técnico.
                      </div>
                    </div>
                  );
                }
                if (!ciudadCoincide) {
                  return (
                    <div className="inv-alert media" style={{ marginTop: 8 }}>
                      <span style={{ marginTop: 1 }}>⚠</span>
                      <div>
                        <b>El equipo está en otra ciudad.</b><br />
                        Ciudad del equipo: <strong>{eq.ciudad?.nombre || "—"}</strong>. La actividad debe registrarse en la misma ciudad del equipo y técnico asignado.
                      </div>
                    </div>
                  );
                }
                return (
                  <div className="inv-alert info" style={{ marginTop: 8 }}>
                    <span style={{ marginTop: 1 }}>ℹ</span>
                    <div>
                      Asignado a <strong>{`${eq.tecnico?.nombres || ""} ${eq.tecnico?.apellidos || ""}`.trim() || "técnico"}</strong>
                      {eq.ciudad?.nombre && <> en <strong>{eq.ciudad.nombre}</strong></>}.
                    </div>
                  </div>
                );
              })()}
            </div>
            <div className="inv-field">
              <label>Placa instalada <span className="req">*</span></label>
              <input
                className="inv-input"
                value={form.placaInstalada}
                onChange={(e) => update("placaInstalada", e.target.value)}
                placeholder="Placa o identificador"
              />
              {errors.placaInstalada && <small className="err">{errors.placaInstalada}</small>}
            </div>
            <div className="inv-field">
              <label>Tipo de propiedad <span className="req">*</span></label>
              <InvSelect
                value={form.tipoPropiedad}
                options={PROPIEDADES}
                onChange={(v) => update("tipoPropiedad", v)}
                isClearable={false}
              />
            </div>
            <div className="inv-field">
              <label>Línea / SIM</label>
              <input
                className="inv-input"
                value={form.lineaSim}
                onChange={(e) => update("lineaSim", e.target.value)}
                placeholder="Claro, Movistar..."
              />
            </div>
            <div className="inv-field">
              <label>Número SIM</label>
              <input
                className="inv-input"
                value={form.numeroSim}
                onChange={(e) => update("numeroSim", e.target.value)}
                placeholder="3001234567"
              />
            </div>
            <div className="inv-field full">
              <label>
                Propietario
                {form.tipoPropiedad === "PROPIO" && <span className="req"> *</span>}
              </label>
              <input
                className="inv-input"
                value={form.propietarioNombre}
                onChange={(e) => update("propietarioNombre", e.target.value)}
                disabled={form.tipoPropiedad === "COMODATO"}
                placeholder={form.tipoPropiedad === "COMODATO" ? "ASEGURAR LTDA" : "Nombre del cliente"}
              />
              {errors.propietarioNombre && <small className="err">{errors.propietarioNombre}</small>}
            </div>
          </div>
        </div>

        {/* Equipo retirado */}
        {requiereRetiro && (
          <div className="inv-form-section">
            <h3>Equipo retirado</h3>

            <div className="inv-field" style={{ marginBottom: 12 }}>
              <label>IMEI a verificar</label>
              <div className="inv-input-group">
                <input
                  className="inv-input"
                  value={form.imeiRetirado}
                  onChange={(e) => update("imeiRetirado", e.target.value.replace(/\D/g, ""))}
                  placeholder="864281041234567"
                  maxLength={20}
                />
                <button
                  type="button"
                  className="inv-btn"
                  onClick={verificarImei}
                  disabled={verificando || !form.imeiRetirado}
                >
                  {verificando ? <span className="inv-spinner" /> : Icon.search}
                  Verificar
                </button>
              </div>
              {errors.equipoRetirado && <small className="err">{errors.equipoRetirado}</small>}
            </div>

            {form.retiradoEncontrado && (
              <div className="inv-equipo-card found">
                <div style={{ marginBottom: 8 }}>
                  <InvTag value="Equipo encontrado" severity="success" />
                </div>
                <div className="inv-kv-grid">
                  <div className="inv-kv">
                    <label>IMEI</label>
                    <b>{form.retiradoEncontrado.imei}</b>
                  </div>
                  <div className="inv-kv">
                    <label>Marca / Modelo</label>
                    <b>{form.retiradoEncontrado.marca?.nombre || ""} {form.retiradoEncontrado.modelo?.nombre || ""}</b>
                  </div>
                  <div className="inv-kv">
                    <label>Ciudad</label>
                    <b>{form.retiradoEncontrado.ciudad?.nombre || "—"}</b>
                  </div>
                  <div className="inv-kv">
                    <label>Propiedad</label>
                    <b>
                      {form.retiradoEncontrado.tipoPropiedad}
                      {form.retiradoEncontrado.propietarioNombre && ` · ${form.retiradoEncontrado.propietarioNombre}`}
                    </b>
                  </div>
                </div>
              </div>
            )}

            {form.equipoRetiradoMode === "nuevo" && (
              <div style={{ marginTop: 14 }}>
                <div style={{ marginBottom: 10 }}>
                  <InvTag value="Equipo no registrado — complete los datos" severity="warning" />
                </div>
                <div className="inv-form-grid inv-form-grid-3">
                  <div className="inv-field">
                    <label>IMEI <span className="req">*</span></label>
                    <input
                      className="inv-input"
                      value={form.equipoRetiradoNuevo.imei}
                      onChange={(e) => updateNested("equipoRetiradoNuevo", "imei", e.target.value)}
                    />
                    {errors.retNuevoImei && <small className="err">{errors.retNuevoImei}</small>}
                  </div>
                  <div className="inv-field">
                    <label>Serial</label>
                    <input
                      className="inv-input"
                      value={form.equipoRetiradoNuevo.serial}
                      onChange={(e) => updateNested("equipoRetiradoNuevo", "serial", e.target.value)}
                    />
                  </div>
                  <div className="inv-field">
                    <label>Marca <span className="req">*</span></label>
                    <InvSelect
                      value={form.equipoRetiradoNuevo.marca}
                      options={marcas}
                      onChange={(v) => updateNested("equipoRetiradoNuevo", "marca", v)}
                    />
                    {errors.retNuevoMarca && <small className="err">{errors.retNuevoMarca}</small>}
                  </div>
                  <div className="inv-field">
                    <label>Modelo <span className="req">*</span></label>
                    <InvSelect
                      value={form.equipoRetiradoNuevo.modelo}
                      options={modelos}
                      onChange={(v) => updateNested("equipoRetiradoNuevo", "modelo", v)}
                      isDisabled={!form.equipoRetiradoNuevo.marca}
                    />
                    {errors.retNuevoModelo && <small className="err">{errors.retNuevoModelo}</small>}
                  </div>
                  <div className="inv-field">
                    <label>Tipo propiedad <span className="req">*</span></label>
                    <InvSelect
                      value={form.equipoRetiradoNuevo.tipoPropiedad}
                      options={PROPIEDADES}
                      onChange={(v) => {
                        updateNested("equipoRetiradoNuevo", "tipoPropiedad", v);
                        if (v === "COMODATO") {
                          updateNested("equipoRetiradoNuevo", "propietarioNombre", "ASEGURAR LTDA");
                        } else if (form.equipoRetiradoNuevo.propietarioNombre === "ASEGURAR LTDA") {
                          updateNested("equipoRetiradoNuevo", "propietarioNombre", "");
                        }
                      }}
                      isClearable={false}
                    />
                  </div>
                  <div className="inv-field">
                    <label>
                      Propietario
                      {form.equipoRetiradoNuevo.tipoPropiedad === "PROPIO" && <span className="req"> *</span>}
                    </label>
                    <input
                      className="inv-input"
                      value={form.equipoRetiradoNuevo.propietarioNombre}
                      onChange={(e) => updateNested("equipoRetiradoNuevo", "propietarioNombre", e.target.value)}
                      disabled={form.equipoRetiradoNuevo.tipoPropiedad === "COMODATO"}
                    />
                    {errors.retNuevoPropietario && <small className="err">{errors.retNuevoPropietario}</small>}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Observaciones */}
        <div className="inv-form-section">
          <h3>Observaciones</h3>
          <textarea
            className="inv-textarea"
            value={form.observaciones}
            onChange={(e) => update("observaciones", e.target.value)}
            placeholder="Notas del técnico, contexto, condiciones especiales..."
            rows={3}
          />
        </div>

        <div className="inv-form-actions">
          <button
            type="button"
            className="inv-btn inv-btn-outline"
            onClick={() => navigate("/inventario/actividades")}
          >
            {Icon.x} Cancelar
          </button>
          <button type="submit" className="inv-btn" disabled={submitting}>
            {submitting ? <span className="inv-spinner" /> : Icon.check}
            {submitting ? "Registrando..." : "Registrar actividad"}
          </button>
        </div>
      </div>
    </form>
  );
}
