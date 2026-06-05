import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InventarioLayout from "./Layout";
import {
  EquiposService,
  CiudadesService,
  TecnicosService,
  MarcasService,
  ModelosService,
} from "../../Services/gpsApi";
import {
  ConfirmModal,
  Icon,
  InvSelect,
  InvTable,
  InvTag,
  useToast,
} from "./components";
import { BatchResultModal } from "./EquipoActions";

const ESTADOS = [
  { value: "DISPONIBLE", label: "Disponible" },
  { value: "EN_TRANSITO", label: "En tránsito" },
  { value: "EN_POSESION_TECNICO", label: "En posesión del técnico" },
  { value: "INSTALADO", label: "Instalado" },
  { value: "EN_REVISION", label: "En revisión" },
  { value: "EN_GARANTIA", label: "En garantía" },
  { value: "RETIRADO", label: "Retirado" },
  { value: "DEVUELTO_CLIENTE", label: "Devuelto al cliente" },
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

const CONDICIONES = [
  { value: "NUEVO", label: "Nuevo" },
  { value: "SEGUNDA", label: "Segunda" },
];

export default function Equipos() {
  return (
    <InventarioLayout title="Equipos GPS" subtitle="Gestión completa del inventario de dispositivos">
      <EquiposContent />
    </InventarioLayout>
  );
}

function EquiposContent() {
  const navigate = useNavigate();
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [confirmRecepcionLote, setConfirmRecepcionLote] = useState(false);
  const [batchResult, setBatchResult] = useState(null);
  const [observacionesLote, setObservacionesLote] = useState("");

  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);

  const [filters, setFilters] = useState({
    estado: "",
    ciudad: "",
    tecnico: "",
    marca: "",
    modelo: "",
    imei: "",
  });

  useEffect(() => {
    cargarCatalogos();
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarCatalogos = async () => {
    try {
      const [m, mo, c, t] = await Promise.all([
        MarcasService.list().catch(() => []),
        ModelosService.list().catch(() => []),
        CiudadesService.list().catch(() => []),
        TecnicosService.list().catch(() => []),
      ]);
      setMarcas(asArr(m).map((x) => ({ value: x._id, label: x.nombre })));
      setModelos(asArr(mo).map((x) => ({ value: x._id, label: x.nombre, marca: x.marca?._id || x.marca })));
      setCiudades(asArr(c).map((x) => ({ value: x._id, label: x.nombre })));
      setTecnicos(asArr(t).map((x) => ({
        value: x._id,
        label: `${x.nombres || ""} ${x.apellidos || ""}`.trim() || x.identificacion,
      })));
    } catch (err) {
      console.error(err);
    }
  };

  const cargar = async () => {
    setLoading(true);
    try {
      const params = { page: 1, limit: 200 };
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params[k] = v;
      });
      const res = await EquiposService.list(params);
      const list = res?.equipos || res?.items || (Array.isArray(res) ? res : []);
      setItems(list);
    } catch (err) {
      toast.error("Error", err.response?.data?.message || "No se pudieron cargar los equipos");
    } finally {
      setLoading(false);
    }
  };

  const limpiar = () => {
    setFilters({ estado: "", ciudad: "", tecnico: "", marca: "", modelo: "", imei: "" });
    setTimeout(cargar, 0);
  };

  const onDelete = async () => {
    const eq = confirmDel;
    setConfirmDel(null);
    try {
      await EquiposService.remove(eq._id);
      toast.success("Eliminado", "Equipo removido del inventario");
      cargar();
    } catch (err) {
      toast.error("Error", err.response?.data?.message || "No se pudo eliminar");
    }
  };

  // Equipos en EN_TRANSITO seleccionados (los únicos elegibles para confirmar recepción)
  const seleccionRecepcionables = items.filter(
    (e) => selectedIds.includes(e._id) && e.estado === "EN_TRANSITO"
  );

  const onConfirmarRecepcionLote = async () => {
    setConfirmRecepcionLote(false);
    try {
      const res = await EquiposService.confirmarRecepcionPaquete({
        equipos: seleccionRecepcionables.map((e) => e._id),
        observaciones: observacionesLote || undefined,
      });
      setBatchResult(res);
      setSelectedIds([]);
      setObservacionesLote("");
      cargar();
    } catch (err) {
      // Si el backend devuelve 409 con detalle estructurado, lo mostramos como BatchResult
      const data = err.response?.data;
      if (data && (data.exitosos || data.errores)) {
        setBatchResult(data);
        cargar();
      } else {
        toast.error("Error", data?.message || "No se pudo confirmar la recepción");
      }
    }
  };

  const modelosFiltered = filters.marca
    ? modelos.filter((m) => m.marca === filters.marca)
    : modelos;

  return (
    <>
      <div className="inv-card">
        <div className="inv-card-body">
          <div className="inv-filters">
            <div className="inv-field" style={{ minWidth: 160 }}>
              <label>Estado</label>
              <InvSelect
                value={filters.estado}
                options={[{ value: "", label: "Todos" }, ...ESTADOS]}
                onChange={(v) => setFilters((f) => ({ ...f, estado: v }))}
                placeholder="Todos"
              />
            </div>
            <div className="inv-field" style={{ minWidth: 160 }}>
              <label>Ciudad</label>
              <InvSelect
                value={filters.ciudad}
                options={[{ value: "", label: "Todas" }, ...ciudades]}
                onChange={(v) => setFilters((f) => ({ ...f, ciudad: v }))}
                placeholder="Todas"
              />
            </div>
            <div className="inv-field" style={{ minWidth: 180 }}>
              <label>Técnico</label>
              <InvSelect
                value={filters.tecnico}
                options={[{ value: "", label: "Todos" }, ...tecnicos]}
                onChange={(v) => setFilters((f) => ({ ...f, tecnico: v }))}
                placeholder="Todos"
              />
            </div>
            <div className="inv-field" style={{ minWidth: 150 }}>
              <label>Marca</label>
              <InvSelect
                value={filters.marca}
                options={[{ value: "", label: "Todas" }, ...marcas]}
                onChange={(v) => setFilters((f) => ({ ...f, marca: v, modelo: "" }))}
                placeholder="Todas"
              />
            </div>
            <div className="inv-field" style={{ minWidth: 150 }}>
              <label>Modelo</label>
              <InvSelect
                value={filters.modelo}
                options={[{ value: "", label: "Todos" }, ...modelosFiltered]}
                onChange={(v) => setFilters((f) => ({ ...f, modelo: v }))}
                placeholder="Todos"
              />
            </div>
            <div className="inv-field">
              <label>IMEI</label>
              <input
                className="inv-input"
                value={filters.imei}
                onChange={(e) => setFilters((f) => ({ ...f, imei: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    cargar();
                  }
                }}
                placeholder="Buscar IMEI..."
              />
            </div>
            <button className="inv-btn" onClick={cargar}>{Icon.search} Aplicar</button>
            <button className="inv-btn inv-btn-outline" onClick={limpiar}>{Icon.x} Limpiar</button>
            <div className="spacer" />
            <button className="inv-btn" onClick={() => navigate("/inventario/equipos/nuevo")}>
              {Icon.plus} Nuevo equipo
            </button>
          </div>

          {/* Barra de acciones masivas (visible cuando hay selección) */}
          {selectedIds.length > 0 && (
            <div style={{
              background: "var(--accent-bg)",
              border: "1px solid var(--accent-border)",
              borderRadius: 8,
              padding: "10px 14px",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}>
              <span style={{ color: "var(--accent)", fontWeight: 600, fontSize: "0.88rem" }}>
                {selectedIds.length} seleccionado{selectedIds.length !== 1 ? "s" : ""}
                {seleccionRecepcionables.length > 0 && seleccionRecepcionables.length !== selectedIds.length && (
                  <span style={{ color: "var(--text-muted)", fontWeight: 500, marginLeft: 6 }}>
                    ({seleccionRecepcionables.length} en tránsito)
                  </span>
                )}
              </span>
              <div className="spacer" />
              <button
                className="inv-btn"
                disabled={seleccionRecepcionables.length === 0}
                onClick={() => setConfirmRecepcionLote(true)}
                title={seleccionRecepcionables.length === 0 ? "Solo equipos EN_TRANSITO pueden confirmarse" : ""}
              >
                {Icon.check} Confirmar recepción ({seleccionRecepcionables.length})
              </button>
              <button className="inv-btn inv-btn-outline" onClick={() => setSelectedIds([])}>
                {Icon.x} Limpiar selección
              </button>
            </div>
          )}

          <InvTable
            loading={loading}
            data={items}
            rowsPerPage={20}
            emptyMessage="No hay equipos para los filtros seleccionados"
            defaultSort={{ key: "createdAt", dir: "desc" }}
            selectable
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            columns={[
              { key: "imei", header: "IMEI", sortable: true,
                render: (r) => <strong style={{ fontSize: "0.86rem" }}>{r.imei || "—"}</strong> },
              { key: "serial", header: "Serial", render: (r) => r.serial || "—" },
              {
                key: "marca",
                header: "Marca / Modelo",
                render: (r) =>
                  `${r.marca?.nombre || ""} ${r.modelo?.nombre || ""}`.trim() || "—",
              },
              {
                key: "estado",
                header: "Estado",
                sortable: true,
                render: (r) => {
                  const tecNombre = r.tecnico
                    ? `${r.tecnico.nombres || ""} ${r.tecnico.apellidos || ""}`.trim()
                    : "";
                  const ciudadNombre = r.ciudad?.nombre || "";
                  const muestraCtx = r.estado === "EN_POSESION_TECNICO" || r.estado === "EN_TRANSITO" || r.estado === "INSTALADO";
                  return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <InvTag value={r.estado} severity={ESTADO_SEVERITY[r.estado] || "neutral"} />
                      {muestraCtx && (tecNombre || ciudadNombre) && (
                        <span style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                          {tecNombre}{tecNombre && ciudadNombre ? " · " : ""}{ciudadNombre}
                        </span>
                      )}
                    </div>
                  );
                },
              },
              {
                key: "condicion",
                header: "Condición",
                render: (r) => (
                  <InvTag value={r.condicion} severity={r.condicion === "NUEVO" ? "info" : "neutral"} />
                ),
              },
              { key: "ciudad", header: "Ciudad", render: (r) => r.ciudad?.nombre || "—" },
              {
                key: "tecnico",
                header: "Técnico",
                render: (r) =>
                  r.tecnico ? `${r.tecnico.nombres || ""} ${r.tecnico.apellidos || ""}`.trim() : "—",
              },
              {
                key: "acciones",
                header: "",
                width: 100,
                render: (r) => (
                  <div style={{ display: "flex", gap: 4 }}>
                    <button
                      className="inv-btn inv-btn-outline inv-btn-icon"
                      title="Ver detalle"
                      onClick={() => navigate(`/inventario/equipos/${r._id}`)}
                    >{Icon.eye}</button>
                    <button
                      className="inv-btn inv-btn-danger-outline inv-btn-icon"
                      title="Eliminar"
                      onClick={() => setConfirmDel(r)}
                    >{Icon.trash}</button>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>

      <ConfirmModal
        open={!!confirmDel}
        title="Eliminar equipo"
        message={confirmDel ? `¿Enviar a la papelera el equipo IMEI ${confirmDel.imei}? Quedará desasignado de su técnico y vehículo. Podrás restaurarlo desde la Papelera.` : ""}
        confirmLabel="Eliminar"
        danger
        onCancel={() => setConfirmDel(null)}
        onConfirm={onDelete}
      />

      {/* Modal de confirmación de recepción de lote (con observaciones) */}
      {confirmRecepcionLote && (
        <div className="inv-modal-backdrop" onClick={() => setConfirmRecepcionLote(false)}>
          <div className="inv-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div className="inv-modal-header">
              <h3>Confirmar recepción</h3>
              <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: "0.82rem" }}>
                {seleccionRecepcionables.length} equipo{seleccionRecepcionables.length !== 1 ? "s" : ""} EN_TRANSITO → EN_POSESION_TECNICO
              </p>
            </div>
            <div className="inv-modal-body">
              <div className="inv-field full">
                <label>Observaciones</label>
                <textarea
                  className="inv-textarea"
                  rows={3}
                  value={observacionesLote}
                  onChange={(e) => setObservacionesLote(e.target.value)}
                  placeholder="Recibido el lote completo..."
                />
              </div>
              <ul style={{
                margin: "10px 0 0", padding: "8px 10px", listStyle: "none",
                maxHeight: 180, overflowY: "auto",
                background: "var(--bg-tertiary)", borderRadius: 8,
              }}>
                {seleccionRecepcionables.map((e) => (
                  <li key={e._id} style={{ fontSize: "0.82rem", padding: "3px 0", color: "var(--text-secondary)" }}>
                    <strong style={{ color: "var(--text-primary)" }}>{e.imei}</strong>
                    {e.marca?.nombre && <span> — {e.marca.nombre} {e.modelo?.nombre || ""}</span>}
                  </li>
                ))}
              </ul>
            </div>
            <div className="inv-modal-footer">
              <button className="inv-btn inv-btn-outline" onClick={() => setConfirmRecepcionLote(false)}>
                Cancelar
              </button>
              <button className="inv-btn" onClick={onConfirmarRecepcionLote}>
                {Icon.check} Confirmar recepción
              </button>
            </div>
          </div>
        </div>
      )}

      <BatchResultModal
        open={!!batchResult}
        result={batchResult}
        onClose={() => setBatchResult(null)}
      />
    </>
  );
}

function asArr(v) {
  if (Array.isArray(v)) return v;
  return v?.data || v?.items || v?.equipos || v?.tecnicos || v?.marcas || v?.modelos || v?.ciudades || [];
}

export { ESTADO_SEVERITY, ESTADOS, CONDICIONES };
