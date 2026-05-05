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
};

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

  const validar = () => {
    const e = {};
    if (!form.marca) e.marca = "Seleccione una marca";
    if (!form.modelo) e.modelo = "Seleccione un modelo";
    if (!form.imei) e.imei = "IMEI requerido";
    else if (form.imei.length < 10) e.imei = "IMEI debe tener al menos 10 dígitos";
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

    setSubmitting(true);
    try {
      if (isEdit) {
        await EquiposService.update(id, payload);
        toast.success("Actualizado", "Equipo actualizado correctamente");
      } else {
        await EquiposService.create(payload);
        toast.success("Creado", "Equipo registrado en el inventario");
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
