import React, { useEffect, useMemo, useState } from "react";
import InventarioLayout from "./Layout";
import {
  EquiposService,
  CiudadesService,
  TecnicosService,
  MarcasService,
  ModelosService,
} from "../../Services/gpsApi";
import { Icon, InvSelect, InvTable, InvTag, useToast } from "./components";
import { BatchResultModal } from "./EquipoActions";

export default function TrasladoEquipos() {
  return (
    <InventarioLayout
      title="Traslado de equipos"
      subtitle="Envío en paquete a una ciudad / técnico"
    >
      <Content />
    </InventarioLayout>
  );
}

function Content() {
  const toast = useToast();

  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const [ciudades, setCiudades] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);

  const [destino, setDestino] = useState({ ciudad: "", tecnico: "", observaciones: "" });
  const [filters, setFilters] = useState({ ciudadOrigen: "", marca: "", modelo: "", imei: "" });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [batchResult, setBatchResult] = useState(null);

  useEffect(() => {
    cargarCatalogos();
    cargarEquipos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarCatalogos = async () => {
    try {
      const [c, t, m, mo] = await Promise.all([
        CiudadesService.list({ limit: 1000 }).catch(() => []),
        TecnicosService.list({ limit: 1000 }).catch(() => []),
        MarcasService.list({ limit: 1000 }).catch(() => []),
        ModelosService.list({ limit: 1000 }).catch(() => []),
      ]);
      setCiudades(asArr(c).map((x) => ({ value: x._id, label: x.nombre, esCentral: x.esCentral })));
      setTecnicos(asArr(t).map((x) => ({
        value: x._id,
        label: `${x.nombres || ""} ${x.apellidos || ""}`.trim(),
        ciudadId: x.ciudad?._id || x.ciudad,
      })));
      setMarcas(asArr(m).map((x) => ({ value: x._id, label: x.nombre })));
      setModelos(asArr(mo).map((x) => ({
        value: x._id,
        label: x.nombre,
        marca: x.marca?._id || x.marca,
      })));
    } catch (err) {
      console.error(err);
    }
  };

  const cargarEquipos = async () => {
    setLoading(true);
    try {
      // Solo DISPONIBLE — los únicos elegibles para envío
      const params = { estado: "DISPONIBLE", page: 1, limit: 500 };
      if (filters.ciudadOrigen) params.ciudad = filters.ciudadOrigen;
      if (filters.marca) params.marca = filters.marca;
      if (filters.modelo) params.modelo = filters.modelo;
      if (filters.imei) params.imei = filters.imei;
      const res = await EquiposService.list(params);
      const list = res?.equipos || res?.items || (Array.isArray(res) ? res : []);
      setEquipos(list);
    } catch (err) {
      toast.error("Error", err.response?.data?.message || "No se pudieron cargar los equipos");
    } finally {
      setLoading(false);
    }
  };

  const tecnicosFiltrados = destino.ciudad
    ? tecnicos.filter((t) => t.ciudadId === destino.ciudad)
    : tecnicos;

  const modelosFiltered = filters.marca
    ? modelos.filter((m) => m.marca === filters.marca)
    : modelos;

  const seleccionados = useMemo(
    () => equipos.filter((e) => selectedIds.includes(e._id)),
    [equipos, selectedIds]
  );

  const valid = !!destino.ciudad && !!destino.tecnico && selectedIds.length > 0;

  const onEnviar = async () => {
    setConfirmOpen(false);
    setSubmitting(true);
    try {
      const body = {
        equipos: selectedIds,
        ciudad: destino.ciudad,
        tecnico: destino.tecnico,
      };
      if (destino.observaciones) body.observaciones = destino.observaciones;
      const res = await EquiposService.enviarPaquete(body);
      setBatchResult(res);
      setSelectedIds([]);
      setDestino({ ciudad: "", tecnico: "", observaciones: "" });
      cargarEquipos();
    } catch (err) {
      const data = err.response?.data;
      if (data && (data.exitosos || data.errores)) {
        setBatchResult(data);
        cargarEquipos();
      } else {
        toast.error("Error", data?.message || "No se pudo realizar el envío");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Bloque destino */}
      <div className="inv-card" style={{ marginBottom: 18 }}>
        <div className="inv-card-body">
          <h3>Destino del envío</h3>
          <div className="inv-form-grid">
            <div className="inv-field">
              <label>Ciudad destino <span className="req">*</span></label>
              <InvSelect
                value={destino.ciudad}
                options={ciudades}
                onChange={(v) => setDestino((d) => ({ ...d, ciudad: v, tecnico: "" }))}
                placeholder="Seleccione ciudad"
              />
            </div>
            <div className="inv-field">
              <label>Técnico <span className="req">*</span></label>
              <InvSelect
                value={destino.tecnico}
                options={tecnicosFiltrados}
                onChange={(v) => setDestino((d) => ({ ...d, tecnico: v }))}
                placeholder={destino.ciudad ? "Seleccione técnico" : "Primero seleccione ciudad"}
                isDisabled={!destino.ciudad}
              />
              {destino.ciudad && tecnicosFiltrados.length === 0 && (
                <small className="err">No hay técnicos asignados a esta ciudad</small>
              )}
            </div>
            <div className="inv-field full">
              <label>Observaciones</label>
              <input
                className="inv-input"
                value={destino.observaciones}
                onChange={(e) => setDestino((d) => ({ ...d, observaciones: e.target.value }))}
                placeholder="Despacho semanal sede Ipiales"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros + tabla */}
      <div className="inv-card">
        <div className="inv-card-body">
          <h3>Equipos disponibles</h3>
          <div className="inv-filters">
            <div className="inv-field" style={{ minWidth: 160 }}>
              <label>Ciudad origen</label>
              <InvSelect
                value={filters.ciudadOrigen}
                options={[{ value: "", label: "Todas" }, ...ciudades]}
                onChange={(v) => setFilters((f) => ({ ...f, ciudadOrigen: v }))}
                placeholder="Todas"
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
                placeholder="Buscar IMEI..."
              />
            </div>
            <button className="inv-btn" onClick={cargarEquipos}>
              {Icon.search} Aplicar
            </button>
            <button
              className="inv-btn inv-btn-outline"
              onClick={() => {
                setFilters({ ciudadOrigen: "", marca: "", modelo: "", imei: "" });
                setTimeout(cargarEquipos, 0);
              }}
            >
              {Icon.x} Limpiar
            </button>
          </div>

          {/* Barra de selección */}
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
                {selectedIds.length} equipo{selectedIds.length !== 1 ? "s" : ""} seleccionado{selectedIds.length !== 1 ? "s" : ""}
              </span>
              <div className="spacer" />
              <button
                className="inv-btn"
                disabled={!valid || submitting}
                onClick={() => setConfirmOpen(true)}
                title={!valid ? "Selecciona destino y al menos 1 equipo" : ""}
              >
                {submitting ? <span className="inv-spinner" /> : Icon.check}
                Enviar paquete ({selectedIds.length})
              </button>
              <button className="inv-btn inv-btn-outline" onClick={() => setSelectedIds([])}>
                {Icon.x} Limpiar selección
              </button>
            </div>
          )}

          <InvTable
            loading={loading}
            data={equipos}
            rowsPerPage={20}
            emptyMessage="No hay equipos DISPONIBLES con estos filtros"
            selectable
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            columns={[
              { key: "imei", header: "IMEI", sortable: true,
                render: (r) => <strong style={{ fontSize: "0.86rem" }}>{r.imei}</strong> },
              { key: "serial", header: "Serial", render: (r) => r.serial || "—" },
              { key: "marca", header: "Marca / Modelo",
                render: (r) => `${r.marca?.nombre || ""} ${r.modelo?.nombre || ""}`.trim() || "—" },
              { key: "condicion", header: "Condición",
                render: (r) => <InvTag value={r.condicion} severity={r.condicion === "NUEVO" ? "info" : "neutral"} /> },
              { key: "ciudad", header: "Ciudad actual",
                render: (r) => (
                  <span>
                    {r.ciudad?.nombre || "—"}
                    {r.ciudad?.esCentral && <InvTag value="Central" severity="info" />}
                  </span>
                ) },
            ]}
          />
        </div>
      </div>

      {/* Modal de confirmación */}
      {confirmOpen && (
        <div className="inv-modal-backdrop" onClick={() => setConfirmOpen(false)}>
          <div className="inv-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <div className="inv-modal-header">
              <h3>Confirmar envío en paquete</h3>
            </div>
            <div className="inv-modal-body">
              <p style={{ margin: "0 0 12px", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                Se enviarán <strong>{selectedIds.length} equipo{selectedIds.length !== 1 ? "s" : ""}</strong> a:
              </p>
              <div className="inv-kv-grid">
                <div className="inv-kv">
                  <label>Ciudad destino</label>
                  <b>{ciudades.find((c) => c.value === destino.ciudad)?.label || "—"}</b>
                </div>
                <div className="inv-kv">
                  <label>Técnico</label>
                  <b>{tecnicos.find((t) => t.value === destino.tecnico)?.label || "—"}</b>
                </div>
              </div>
              <ul style={{
                margin: "12px 0 0", padding: "8px 10px", listStyle: "none",
                maxHeight: 180, overflowY: "auto",
                background: "var(--bg-tertiary)", borderRadius: 8,
              }}>
                {seleccionados.map((e) => (
                  <li key={e._id} style={{ fontSize: "0.82rem", padding: "3px 0", color: "var(--text-secondary)" }}>
                    <strong style={{ color: "var(--text-primary)" }}>{e.imei}</strong>
                    {e.marca?.nombre && <span> — {e.marca.nombre} {e.modelo?.nombre || ""}</span>}
                  </li>
                ))}
              </ul>
            </div>
            <div className="inv-modal-footer">
              <button className="inv-btn inv-btn-outline" onClick={() => setConfirmOpen(false)}>Cancelar</button>
              <button className="inv-btn" onClick={onEnviar}>
                {Icon.check} Confirmar envío
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
  return v?.data || v?.items || v?.equipos || v?.tecnicos || v?.ciudades || v?.marcas || v?.modelos || [];
}
