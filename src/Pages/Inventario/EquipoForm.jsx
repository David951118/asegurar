import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InventarioLayout from "./Layout";
import {
  EquiposService,
  MarcasService,
  ModelosService,
  CiudadesService,
} from "../../Services/gpsApi";
import { CONDICIONES } from "./Equipos";
import { Icon, InvSelect, useToast } from "./components";

const initial = {
  marca: "",
  modelo: "",
  imei: "",
  serial: "",
  idEquipo: "",
  condicion: "NUEVO",
  ciudad: "",
  observaciones: "",
  // Estado inicial: DISPONIBLE (entra a inventario) o INSTALADO (directo a producción).
  estado: "DISPONIBLE",
  placaInstalada: "",
  lineaSim: "",
  numeroSim: "",
  tipoPropiedad: "COMODATO",
  propietarioNombre: "",
};

const ESTADO_INICIAL = [
  { value: "DISPONIBLE", label: "Disponible (entra a inventario)" },
  { value: "INSTALADO", label: "Instalado (directo a producción)" },
];

const TIPOS_PROPIEDAD = [
  { value: "COMODATO", label: "Comodato (Asegurar Ltda.)" },
  { value: "PROPIO", label: "Propio del cliente" },
];

export default function EquipoForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  return (
    <InventarioLayout
      title={isEdit ? "Editar equipo" : "Nuevo equipo"}
      subtitle={isEdit ? id : "Registrar un dispositivo GPS al inventario"}
    >
      <FormContent id={id} isEdit={isEdit} />
    </InventarioLayout>
  );
}

function FormContent({ id, isEdit }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [ciudades, setCiudades] = useState([]);

  useEffect(() => {
    cargarCatalogos();
    if (isEdit) cargarEquipo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (form.marca) {
      ModelosService.list({ marca: form.marca })
        .then((res) => {
          const list = Array.isArray(res) ? res : res?.data || res?.modelos || [];
          setModelos(list.map((m) => ({ value: m._id, label: m.nombre })));
        })
        .catch(() => setModelos([]));
    } else {
      setModelos([]);
    }
  }, [form.marca]);

  const cargarCatalogos = async () => {
    try {
      const [m, c] = await Promise.all([
        MarcasService.list().catch(() => []),
        CiudadesService.list().catch(() => []),
      ]);
      const ml = Array.isArray(m) ? m : m?.data || m?.marcas || [];
      const cl = Array.isArray(c) ? c : c?.data || c?.ciudades || [];
      setMarcas(ml.map((x) => ({ value: x._id, label: x.nombre })));
      setCiudades(cl.map((x) => ({ value: x._id, label: x.nombre })));
    } catch (err) {
      console.error(err);
    }
  };

  const cargarEquipo = async () => {
    setLoading(true);
    try {
      const res = await EquiposService.get(id);
      const eq = res?.equipo || res;
      setForm({
        marca: eq.marca?._id || eq.marca || "",
        modelo: eq.modelo?._id || eq.modelo || "",
        imei: eq.imei || "",
        serial: eq.serial || "",
        idEquipo: eq.idEquipo || "",
        condicion: eq.condicion || "NUEVO",
        ciudad: eq.ciudad?._id || eq.ciudad || "",
        observaciones: eq.observaciones || "",
      });
    } catch (err) {
      toast.error("Error", "No se pudo cargar el equipo");
      navigate("/inventario/equipos");
    } finally {
      setLoading(false);
    }
  };

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const instaladoDirecto = !isEdit && form.estado === "INSTALADO";

  const validar = () => {
    const e = {};
    if (!form.marca) e.marca = "Seleccione una marca";
    if (!form.modelo) e.modelo = "Seleccione un modelo";
    if (!form.imei) e.imei = "IMEI requerido";
    else if (form.imei.length < 10) e.imei = "IMEI debe tener al menos 10 dígitos";
    if (instaladoDirecto) {
      if (!form.placaInstalada || form.placaInstalada.length < 3)
        e.placaInstalada = "Placa del vehículo requerida (mín. 3 caracteres)";
      if (form.tipoPropiedad === "PROPIO" && !form.propietarioNombre.trim())
        e.propietarioNombre = "Indique el propietario (equipo propio del cliente)";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validar()) return;
    const payload = {
      marca: form.marca,
      modelo: form.modelo,
      imei: form.imei,
      condicion: form.condicion,
    };
    if (form.serial) payload.serial = form.serial;
    if (form.idEquipo) payload.idEquipo = form.idEquipo;
    if (form.ciudad) payload.ciudad = form.ciudad;
    if (form.observaciones) payload.observaciones = form.observaciones;

    // Registro directo en producción (solo al crear).
    if (instaladoDirecto) {
      payload.estado = "INSTALADO";
      payload.placaInstalada = form.placaInstalada;
      payload.tipoPropiedad = form.tipoPropiedad;
      if (form.tipoPropiedad === "PROPIO") payload.propietarioNombre = form.propietarioNombre;
      if (form.lineaSim) payload.lineaSim = form.lineaSim;
      if (form.numeroSim) payload.numeroSim = form.numeroSim;
    }

    setSubmitting(true);
    try {
      if (isEdit) {
        await EquiposService.update(id, payload);
        toast.success("Actualizado", "Equipo actualizado correctamente");
      } else {
        await EquiposService.create(payload);
        toast.success(
          "Creado",
          instaladoDirecto
            ? "Equipo registrado directo en producción (INSTALADO)"
            : "Equipo registrado en el inventario",
        );
      }
      setTimeout(() => navigate("/inventario/equipos"), 500);
    } catch (err) {
      toast.error("Error", err.response?.data?.message || "No se pudo guardar el equipo");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="inv-card"><div className="inv-card-body"><div className="inv-loading"><span className="inv-spinner" /> Cargando...</div></div></div>;
  }

  return (
    <form className="inv-card" onSubmit={handleSubmit} style={{ maxWidth: 880, margin: "0 auto" }}>
      <div className="inv-card-body">
        <div className="inv-form-section">
          <h3>Identificación</h3>
          <div className="inv-form-grid">
            <div className="inv-field">
              <label>Marca <span className="req">*</span></label>
              <InvSelect
                value={form.marca}
                options={marcas}
                onChange={(v) => { update("marca", v); update("modelo", ""); }}
              />
              {errors.marca && <small className="err">{errors.marca}</small>}
            </div>
            <div className="inv-field">
              <label>Modelo <span className="req">*</span></label>
              <InvSelect
                value={form.modelo}
                options={modelos}
                onChange={(v) => update("modelo", v)}
                isDisabled={!form.marca}
              />
              {errors.modelo && <small className="err">{errors.modelo}</small>}
            </div>
            <div className="inv-field">
              <label>IMEI <span className="req">*</span></label>
              <input
                className="inv-input"
                value={form.imei}
                onChange={(e) => update("imei", e.target.value.replace(/\D/g, ""))}
                placeholder="864281041234567"
                maxLength={20}
              />
              {errors.imei && <small className="err">{errors.imei}</small>}
            </div>
            <div className="inv-field">
              <label>Serial</label>
              <input
                className="inv-input"
                value={form.serial}
                onChange={(e) => update("serial", e.target.value)}
                placeholder="QL-2024-0987"
              />
            </div>
            <div className="inv-field">
              <label>Placa Cellvi instalada</label>
              <input
                className="inv-input"
                value={form.idEquipo}
                onChange={(e) => update("idEquipo", e.target.value.toUpperCase())}
                placeholder="ABC123"
                maxLength={7}
              />
            </div>
            <div className="inv-field">
              <label>Condición</label>
              <InvSelect
                value={form.condicion}
                options={CONDICIONES}
                onChange={(v) => update("condicion", v)}
                isClearable={false}
              />
            </div>
          </div>
        </div>

        {!isEdit && (
          <div className="inv-form-section">
            <h3>Destino inicial</h3>
            <div className="inv-form-grid">
              <div className="inv-field">
                <label>¿Cómo ingresa el equipo?</label>
                <InvSelect
                  value={form.estado}
                  options={ESTADO_INICIAL}
                  onChange={(v) => update("estado", v || "DISPONIBLE")}
                  isClearable={false}
                />
                <small style={{ color: "#6b7280" }}>
                  {instaladoDirecto
                    ? "Se registra como INSTALADO, directo a producción, sin pasar por inventario."
                    : "Ingresa al inventario de la ciudad seleccionada (por defecto la central)."}
                </small>
              </div>
            </div>
          </div>
        )}

        {instaladoDirecto && (
          <div className="inv-form-section">
            <h3>Instalación en producción</h3>
            <div className="inv-form-grid">
              <div className="inv-field">
                <label>Placa del vehículo <span className="req">*</span></label>
                <input
                  className="inv-input"
                  value={form.placaInstalada}
                  onChange={(e) => update("placaInstalada", e.target.value.toUpperCase())}
                  placeholder="ABC123"
                  maxLength={20}
                />
                {errors.placaInstalada && <small className="err">{errors.placaInstalada}</small>}
              </div>
              <div className="inv-field">
                <label>Línea SIM</label>
                <input
                  className="inv-input"
                  value={form.lineaSim}
                  onChange={(e) => update("lineaSim", e.target.value)}
                  placeholder="3001234567"
                />
              </div>
              <div className="inv-field">
                <label>Número SIM</label>
                <input
                  className="inv-input"
                  value={form.numeroSim}
                  onChange={(e) => update("numeroSim", e.target.value)}
                  placeholder="ICCID / número de SIM"
                />
              </div>
              <div className="inv-field">
                <label>Propiedad</label>
                <InvSelect
                  value={form.tipoPropiedad}
                  options={TIPOS_PROPIEDAD}
                  onChange={(v) => update("tipoPropiedad", v || "COMODATO")}
                  isClearable={false}
                />
              </div>
              {form.tipoPropiedad === "PROPIO" && (
                <div className="inv-field">
                  <label>Propietario <span className="req">*</span></label>
                  <input
                    className="inv-input"
                    value={form.propietarioNombre}
                    onChange={(e) => update("propietarioNombre", e.target.value)}
                    placeholder="Nombre del cliente propietario"
                  />
                  {errors.propietarioNombre && (
                    <small className="err">{errors.propietarioNombre}</small>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="inv-form-section">
          <h3>Ubicación</h3>
          <div className="inv-form-grid">
            <div className="inv-field">
              <label>Ciudad</label>
              <InvSelect
                value={form.ciudad}
                options={ciudades}
                onChange={(v) => update("ciudad", v)}
                placeholder="Por defecto: ciudad central (Pasto)"
              />
            </div>
          </div>
        </div>

        <div className="inv-form-section">
          <h3>Observaciones</h3>
          <textarea
            className="inv-textarea"
            value={form.observaciones}
            onChange={(e) => update("observaciones", e.target.value)}
            rows={3}
            placeholder="Notas, número de remisión, contexto de adquisición..."
          />
        </div>

        <div className="inv-form-actions">
          <button
            type="button"
            className="inv-btn inv-btn-outline"
            onClick={() => navigate("/inventario/equipos")}
          >
            {Icon.x} Cancelar
          </button>
          <button type="submit" className="inv-btn" disabled={submitting}>
            {submitting ? <span className="inv-spinner" /> : Icon.check}
            {submitting ? "Guardando..." : isEdit ? "Guardar cambios" : "Registrar equipo"}
          </button>
        </div>
      </div>
    </form>
  );
}
