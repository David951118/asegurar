import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InventarioLayout from "./Layout";
import GpsService from "../../Services/gpsApi";
import {
  ConfirmModal,
  Icon,
  InvSelect,
  InvTable,
  InvTag,
  useToast,
} from "./components";

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
const TIPO_LABEL = TIPOS.reduce((a, t) => ({ ...a, [t.value]: t.label }), {});
const TIPO_SEVERITY = {
  INSTALACION_NUEVA: "success",
  HOMOLOGACION: "info",
  CAMBIO_2G_4G: "info",
  CAMBIO_CON_COSTO: "warning",
  CAMBIO_SIN_COSTO: "warning",
  CAMBIO_COMODATO: "warning",
  PRUEBAS: "info",
  GARANTIA: "warning",
  EQUIPO_DANADO: "danger",
};

export default function ActividadesList() {
  return (
    <InventarioLayout title="Actividades" subtitle="Listado de operaciones de campo">
      <ListContent />
    </InventarioLayout>
  );
}

function ListContent() {
  const navigate = useNavigate();
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tecnicos, setTecnicos] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [confirmDel, setConfirmDel] = useState(null);

  const [filters, setFilters] = useState({
    tipoActividad: "",
    tecnico: "",
    ciudad: "",
    placa: "",
    desde: "",
    hasta: "",
  });

  const fetchCatalogos = async () => {
    try {
      const [tecs, cdds] = await Promise.all([
        GpsService.listarTecnicos().catch(() => []),
        GpsService.listarCiudades().catch(() => []),
      ]);
      const tList = Array.isArray(tecs) ? tecs : tecs?.data || [];
      const cList = Array.isArray(cdds) ? cdds : cdds?.data || [];
      setTecnicos(
        tList.map((t) => ({
          label: `${t.nombres || ""} ${t.apellidos || ""}`.trim() || t.identificacion || t._id,
          value: t._id,
        }))
      );
      setCiudades(cList.map((c) => ({ label: c.nombre, value: c._id })));
    } catch (err) {
      console.error("Error catálogos:", err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.tipoActividad) params.tipoActividad = filters.tipoActividad;
      if (filters.tecnico) params.tecnico = filters.tecnico;
      if (filters.ciudad) params.ciudad = filters.ciudad;
      if (filters.placa) params.placa = filters.placa;
      if (filters.desde) params.desde = filters.desde;
      if (filters.hasta) params.hasta = filters.hasta;
      params.page = 1;
      params.limit = 200;

      const res = await GpsService.listarActividades(params);
      const list = res?.actividades || res?.items || (Array.isArray(res) ? res : []);
      setItems(list);
    } catch (err) {
      console.error(err);
      toast.error("Error", err.response?.data?.message || "No se pudieron cargar las actividades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogos();
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const limpiar = () => {
    setFilters({ tipoActividad: "", tecnico: "", ciudad: "", placa: "", desde: "", hasta: "" });
    setTimeout(fetchData, 0);
  };

  const onDelete = async () => {
    const row = confirmDel;
    setConfirmDel(null);
    try {
      await GpsService.eliminarActividad(row._id);
      toast.success("Eliminada", "Actividad eliminada correctamente");
      fetchData();
    } catch (err) {
      toast.error("Error", err.response?.data?.message || "No se pudo eliminar");
    }
  };

  const tipoOptions = [{ label: "Todos los tipos", value: "" }, ...TIPOS];
  const tecOptions = [{ label: "Todos los técnicos", value: "" }, ...tecnicos];
  const cdOptions = [{ label: "Todas las ciudades", value: "" }, ...ciudades];

  return (
    <>
      <div className="inv-card">
        <div className="inv-card-body">
          <div className="inv-filters">
            <div className="inv-field" style={{ minWidth: 180 }}>
              <label>Tipo</label>
              <InvSelect
                value={filters.tipoActividad}
                options={tipoOptions}
                onChange={(v) => setFilters((f) => ({ ...f, tipoActividad: v }))}
                placeholder="Todos los tipos"
              />
            </div>
            <div className="inv-field" style={{ minWidth: 200 }}>
              <label>Técnico</label>
              <InvSelect
                value={filters.tecnico}
                options={tecOptions}
                onChange={(v) => setFilters((f) => ({ ...f, tecnico: v }))}
                placeholder="Todos los técnicos"
              />
            </div>
            <div className="inv-field" style={{ minWidth: 180 }}>
              <label>Ciudad</label>
              <InvSelect
                value={filters.ciudad}
                options={cdOptions}
                onChange={(v) => setFilters((f) => ({ ...f, ciudad: v }))}
                placeholder="Todas las ciudades"
              />
            </div>
            <div className="inv-field">
              <label>Placa</label>
              <input
                className="inv-input"
                value={filters.placa}
                onChange={(e) => setFilters((f) => ({ ...f, placa: e.target.value.toUpperCase() }))}
                placeholder="ABC123"
              />
            </div>
            <div className="inv-field">
              <label>Desde</label>
              <input
                type="date"
                className="inv-input"
                value={filters.desde}
                onChange={(e) => setFilters((f) => ({ ...f, desde: e.target.value }))}
              />
            </div>
            <div className="inv-field">
              <label>Hasta</label>
              <input
                type="date"
                className="inv-input"
                value={filters.hasta}
                onChange={(e) => setFilters((f) => ({ ...f, hasta: e.target.value }))}
              />
            </div>
            <button className="inv-btn" onClick={fetchData}>
              {Icon.search} Aplicar
            </button>
            <button className="inv-btn inv-btn-outline" onClick={limpiar}>
              {Icon.x} Limpiar
            </button>
            <div className="spacer" />
            <button className="inv-btn" onClick={() => navigate("/inventario/actividades/nueva")}>
              {Icon.plus} Nueva
            </button>
          </div>

          <InvTable
            loading={loading}
            data={items}
            rowsPerPage={15}
            emptyMessage="No hay actividades para los filtros seleccionados"
            defaultSort={{ key: "fechaActividad", dir: "desc" }}
            columns={[
              {
                key: "fechaActividad",
                header: "Fecha",
                sortable: true,
                width: 160,
                render: (r) => formatFecha(r.fechaActividad),
              },
              {
                key: "tipoActividad",
                header: "Tipo",
                sortable: true,
                render: (r) => (
                  <InvTag
                    value={TIPO_LABEL[r.tipoActividad] || r.tipoActividad}
                    severity={TIPO_SEVERITY[r.tipoActividad] || "neutral"}
                  />
                ),
              },
              {
                key: "tecnico",
                header: "Técnico",
                render: (r) =>
                  `${r.tecnico?.nombres || ""} ${r.tecnico?.apellidos || ""}`.trim() ||
                  r.tecnico?.identificacion ||
                  "—",
              },
              { key: "ciudad", header: "Ciudad", render: (r) => r.ciudad?.nombre || "—" },
              {
                key: "equipoInstalado",
                header: "Equipo instalado",
                render: (r) => {
                  const e = r.equipoInstalado;
                  if (!e) return "—";
                  return (
                    <div style={{ fontSize: "0.82rem", lineHeight: 1.3 }}>
                      <div><strong>{e.imei || "—"}</strong></div>
                      <div style={{ color: "var(--text-muted)" }}>
                        {e.marca?.nombre || ""} {e.modelo?.nombre || ""}
                      </div>
                    </div>
                  );
                },
              },
              { key: "placaInstalada", header: "Placa", width: 100 },
              {
                key: "equipoRetirado",
                header: "Retirado",
                render: (r) =>
                  r.equipoRetirado ? (
                    <div style={{ fontSize: "0.8rem" }}>
                      <div>{r.equipoRetirado.imei || "—"}</div>
                      <InvTag
                        value={r.equipoRetirado.estado}
                        severity={
                          r.equipoRetirado.estado === "DEVUELTO_CLIENTE" ? "warning"
                          : r.equipoRetirado.estado === "RETIRADO" ? "danger"
                          : "info"
                        }
                      />
                    </div>
                  ) : "—",
              },
              {
                key: "acciones",
                header: "",
                width: 90,
                render: (r) => (
                  <div style={{ display: "flex", gap: 4 }}>
                    <button
                      className="inv-btn inv-btn-outline inv-btn-icon"
                      title="Ver detalle"
                      onClick={() => navigate(`/inventario/actividades/${r._id}`)}
                    >
                      {Icon.eye}
                    </button>
                    <button
                      className="inv-btn inv-btn-danger-outline inv-btn-icon"
                      title="Eliminar"
                      onClick={() => setConfirmDel(r)}
                    >
                      {Icon.trash}
                    </button>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>

      <ConfirmModal
        open={!!confirmDel}
        title="Eliminar actividad"
        message={
          confirmDel
            ? `¿Eliminar la actividad del ${formatFecha(confirmDel.fechaActividad)}${confirmDel.placaInstalada ? ` (placa ${confirmDel.placaInstalada})` : ""}? Esto puede afectar el estado del inventario.`
            : ""
        }
        confirmLabel="Eliminar"
        danger
        onCancel={() => setConfirmDel(null)}
        onConfirm={onDelete}
      />
    </>
  );
}

function formatFecha(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("es-CO", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return iso;
  }
}
