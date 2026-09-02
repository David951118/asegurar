import React, { useEffect, useMemo, useState } from "react";
import InventarioLayout from "./Layout";
import { CamarasService } from "../../Services/gpsApi";
import {
  ConfirmModal,
  Icon,
  InvSelect,
  InvTable,
  InvTag,
  useToast,
} from "./components";

const ESTADO_LABEL = {
  EN_EMPRESA: "En la empresa",
  INSTALADA: "Instalada",
  DESCARTADA: "Descartada",
};

const ESTADO_SEVERITY = {
  EN_EMPRESA: "success",
  INSTALADA: "info",
  DESCARTADA: "danger",
};

const ACCION_LABEL = {
  CREADA: "Creada",
  INSTALADA: "Instalada",
  RETIRADA: "Retirada",
  DESCARTADA: "Descartada",
  REINGRESADA: "Reingresada",
  ACTUALIZADA: "Actualizada",
};

export default function Camaras() {
  return (
    <InventarioLayout
      title="Cámaras"
      subtitle="Inventario de cámaras: en la empresa, instaladas (salientes) y retiros"
    >
      <Content />
    </InventarioLayout>
  );
}

function Content() {
  const toast = useToast();

  const [resumen, setResumen] = useState(null);
  const [camaras, setCamaras] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filtros
  const [fEstado, setFEstado] = useState(null);
  const [fMarca, setFMarca] = useState(null);
  const [search, setSearch] = useState("");

  // Modales
  const [showCrear, setShowCrear] = useState(false);
  const [showCatalogo, setShowCatalogo] = useState(false);
  const [accion, setAccion] = useState(null); // { tipo: "instalar"|"retirar"|"descartar", camara }
  const [histCamara, setHistCamara] = useState(null);
  const [confirmar, setConfirmar] = useState(null); // { titulo, mensaje, onConfirm, danger }

  const cargarCatalogos = async () => {
    try {
      const [ms, mos] = await Promise.all([
        CamarasService.listMarcas(),
        CamarasService.listModelos(),
      ]);
      setMarcas(Array.isArray(ms) ? ms : []);
      setModelos(Array.isArray(mos) ? mos : []);
    } catch (err) {
      console.error(err);
    }
  };

  const cargar = async () => {
    setLoading(true);
    try {
      const params = {};
      if (fEstado) params.estado = fEstado;
      if (fMarca) params.marca = fMarca;
      if (search.trim()) params.search = search.trim();
      const [res, kpis] = await Promise.all([
        CamarasService.list(params),
        CamarasService.resumen(),
      ]);
      setCamaras(Array.isArray(res) ? res : []);
      setResumen(kpis);
    } catch (err) {
      console.error(err);
      toast.error("Error", err.response?.data?.message || "No se pudo cargar el inventario de cámaras");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCatalogos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fEstado, fMarca]);

  const porEstado = resumen?.porEstado || {};

  const opcionesMarca = useMemo(
    () => marcas.map((m) => ({ value: m._id, label: m.nombre })),
    [marcas],
  );

  const ejecutarAccion = async (tipo, camara, body) => {
    try {
      let res;
      if (tipo === "instalar") res = await CamarasService.instalar(camara._id, body);
      else if (tipo === "retirar") res = await CamarasService.retirar(camara._id, body);
      else if (tipo === "descartar") res = await CamarasService.descartar(camara._id, body);
      else if (tipo === "reingresar") res = await CamarasService.reingresar(camara._id, body);
      toast.success("Listo", res?.message || "Acción realizada");
      setAccion(null);
      cargar();
    } catch (err) {
      toast.error("Error", err.response?.data?.message || "No se pudo completar la acción");
    }
  };

  return (
    <>
      {/* KPIs */}
      <div className="inv-kpi-grid">
        <Kpi label="Total cámaras" value={resumen?.total ?? "—"} />
        <Kpi label="En la empresa" value={porEstado.EN_EMPRESA ?? 0} variant="success" />
        <Kpi label="Instaladas (salientes)" value={porEstado.INSTALADA ?? 0} variant="info" />
        <Kpi label="Descartadas" value={porEstado.DESCARTADA ?? 0} variant="danger" />
      </div>

      {/* Filtros + acciones */}
      <div className="inv-filters">
        <div className="inv-field" style={{ minWidth: 170 }}>
          <label>Estado</label>
          <InvSelect
            value={fEstado}
            options={Object.entries(ESTADO_LABEL).map(([value, label]) => ({ value, label }))}
            onChange={setFEstado}
            placeholder="Todos"
          />
        </div>
        <div className="inv-field" style={{ minWidth: 170 }}>
          <label>Marca</label>
          <InvSelect value={fMarca} options={opcionesMarca} onChange={setFMarca} placeholder="Todas" />
        </div>
        <div className="inv-field" style={{ minWidth: 220 }}>
          <label>Buscar</label>
          <input
            type="text"
            className="inv-input"
            placeholder="Serial, placa o sitio…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && cargar()}
          />
        </div>
        <button className="inv-btn" onClick={cargar}>{Icon.search} Buscar</button>
        <div className="spacer" />
        <button className="inv-btn inv-btn-outline" onClick={() => setShowCatalogo(true)}>
          {Icon.list} Marcas y modelos
        </button>
        <button className="inv-btn" onClick={() => setShowCrear(true)} style={{ background: "#0a7c3a", color: "#fff", fontWeight: 700 }}>
          + Registrar cámaras
        </button>
      </div>

      {/* Resumen por modelo */}
      {(resumen?.porModelo || []).length > 0 && (
        <div className="inv-card" style={{ marginBottom: 18 }}>
          <div className="inv-card-body">
            <h3 style={{ margin: "0 0 12px" }}>Unidades por marca y modelo</h3>
            <InvTable
              data={resumen.porModelo}
              rowsPerPage={10}
              emptyMessage="Sin cámaras registradas"
              columns={[
                { key: "marca", header: "Marca", render: (r) => r.marca || "—" },
                { key: "modelo", header: "Modelo", render: (r) => r.modelo || "—" },
                { key: "enEmpresa", header: "En empresa", align: "right", render: (r) => r.enEmpresa ?? 0 },
                { key: "instaladas", header: "Instaladas", align: "right", render: (r) => r.instaladas ?? 0 },
                { key: "descartadas", header: "Descartadas", align: "right", render: (r) => r.descartadas ?? 0 },
                { key: "total", header: "Total", align: "right", render: (r) => <strong>{r.total ?? 0}</strong> },
              ]}
            />
          </div>
        </div>
      )}

      {/* Listado de unidades */}
      <div className="inv-card">
        <div className="inv-card-body">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <h3 style={{ margin: 0 }}>Unidades</h3>
            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{camaras.length} cámaras</span>
          </div>
          <InvTable
            loading={loading}
            data={camaras}
            rowsPerPage={15}
            emptyMessage="Sin cámaras para los filtros seleccionados"
            columns={[
              { key: "serial", header: "Serial", render: (r) => <strong style={{ fontSize: "0.86rem" }}>{r.serial}</strong> },
              { key: "marca", header: "Marca / Modelo",
                render: (r) => `${r.marca?.nombre || ""} ${r.modelo?.nombre || ""}`.trim() || "—" },
              { key: "condicion", header: "Condición",
                render: (r) => <InvTag value={r.condicion} severity={r.condicion === "NUEVA" ? "info" : "neutral"} /> },
              { key: "estado", header: "Estado",
                render: (r) => <InvTag value={ESTADO_LABEL[r.estado] || r.estado} severity={ESTADO_SEVERITY[r.estado] || "neutral"} /> },
              { key: "instaladaEn", header: "Instalada en",
                render: (r) => r.estado === "INSTALADA"
                  ? (
                    <div style={{ fontSize: "0.82rem", lineHeight: 1.3 }}>
                      {r.instaladaEn?.placa && <div><strong>{r.instaladaEn.placa}</strong></div>}
                      {r.instaladaEn?.descripcion && (
                        <div style={{ color: "var(--text-muted)" }}>{r.instaladaEn.descripcion}</div>
                      )}
                    </div>
                  )
                  : "—" },
              { key: "fechaInstalacion", header: "Instalación", width: 100,
                render: (r) => fmtFecha(r.fechaInstalacion) },
              { key: "fechaRetiro", header: "Último retiro", width: 100,
                render: (r) => fmtFecha(r.fechaRetiro) },
              { key: "acciones", header: "Acciones", width: 220,
                render: (r) => (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {r.estado === "EN_EMPRESA" && (
                      <button className="inv-btn inv-btn-sm" onClick={() => setAccion({ tipo: "instalar", camara: r })}>
                        Instalar
                      </button>
                    )}
                    {r.estado === "INSTALADA" && (
                      <button className="inv-btn inv-btn-sm inv-btn-outline" onClick={() => setAccion({ tipo: "retirar", camara: r })}>
                        Retirar
                      </button>
                    )}
                    {r.estado !== "DESCARTADA" && (
                      <button
                        className="inv-btn inv-btn-sm inv-btn-outline"
                        style={{ color: "var(--inv-danger)" }}
                        onClick={() => setAccion({ tipo: "descartar", camara: r })}
                      >
                        Descartar
                      </button>
                    )}
                    {r.estado === "DESCARTADA" && (
                      <button
                        className="inv-btn inv-btn-sm inv-btn-outline"
                        onClick={() =>
                          setConfirmar({
                            titulo: "Reingresar cámara",
                            mensaje: `¿Reingresar la cámara ${r.serial} al inventario de la empresa?`,
                            onConfirm: () => {
                              setConfirmar(null);
                              ejecutarAccion("reingresar", r, {});
                            },
                          })
                        }
                      >
                        Reingresar
                      </button>
                    )}
                    <button className="inv-btn inv-btn-sm inv-btn-outline" onClick={() => setHistCamara(r)}>
                      Historial
                    </button>
                    <button
                      className="inv-btn inv-btn-sm inv-btn-outline"
                      style={{ color: "var(--inv-danger)" }}
                      title="Eliminar del inventario"
                      onClick={() =>
                        setConfirmar({
                          titulo: "Eliminar cámara",
                          mensaje: `¿Eliminar la cámara ${r.serial} del inventario? Podrá restaurarse desde papelera de la base de datos.`,
                          danger: true,
                          onConfirm: async () => {
                            setConfirmar(null);
                            try {
                              await CamarasService.remove(r._id);
                              toast.success("Eliminada", `Cámara ${r.serial} eliminada`);
                              cargar();
                            } catch (err) {
                              toast.error("Error", err.response?.data?.message || "No se pudo eliminar");
                            }
                          },
                        })
                      }
                    >
                      {Icon.trash}
                    </button>
                  </div>
                ) },
            ]}
          />
        </div>
      </div>

      {showCrear && (
        <CrearCamarasModal
          marcas={marcas}
          modelos={modelos}
          onClose={() => setShowCrear(false)}
          onCreated={() => {
            setShowCrear(false);
            cargar();
          }}
        />
      )}

      {showCatalogo && (
        <CatalogoModal
          marcas={marcas}
          modelos={modelos}
          onClose={() => setShowCatalogo(false)}
          onChanged={cargarCatalogos}
        />
      )}

      {accion && (
        <AccionModal
          accion={accion}
          onClose={() => setAccion(null)}
          onSubmit={(body) => ejecutarAccion(accion.tipo, accion.camara, body)}
        />
      )}

      {histCamara && <HistorialModal camara={histCamara} onClose={() => setHistCamara(null)} />}

      <ConfirmModal
        open={!!confirmar}
        title={confirmar?.titulo}
        message={confirmar?.mensaje}
        danger={confirmar?.danger}
        onConfirm={confirmar?.onConfirm}
        onCancel={() => setConfirmar(null)}
      />
    </>
  );
}

/* ────────────────────────────────────────────── */

function CrearCamarasModal({ marcas, modelos, onClose, onCreated }) {
  const toast = useToast();
  const [marca, setMarca] = useState(null);
  const [modelo, setModelo] = useState(null);
  const [condicion, setCondicion] = useState("NUEVA");
  const [serialesTxt, setSerialesTxt] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [saving, setSaving] = useState(false);

  const modelosDeMarca = useMemo(
    () => modelos.filter((m) => (m.marca?._id || m.marca) === marca),
    [modelos, marca],
  );

  const seriales = serialesTxt
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const guardar = async () => {
    if (!marca || !modelo || seriales.length === 0) return;
    setSaving(true);
    try {
      const res = await CamarasService.create({
        marca,
        modelo,
        condicion,
        observaciones: observaciones || undefined,
        seriales,
      });
      toast.success("Listo", res?.message || "Cámaras registradas");
      onCreated();
    } catch (err) {
      toast.error("Error", err.response?.data?.message || "No se pudieron registrar las cámaras");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Registrar cámaras" onClose={onClose}
      footer={
        <>
          <button className="inv-btn inv-btn-outline" onClick={onClose}>Cancelar</button>
          <button className="inv-btn" disabled={saving || !marca || !modelo || seriales.length === 0} onClick={guardar}>
            {saving ? <span className="inv-spinner" /> : null}
            Registrar {seriales.length > 0 ? `(${seriales.length})` : ""}
          </button>
        </>
      }
    >
      <div className="inv-field">
        <label>Marca</label>
        <InvSelect
          value={marca}
          options={marcas.map((m) => ({ value: m._id, label: m.nombre }))}
          onChange={(v) => { setMarca(v); setModelo(null); }}
          placeholder="Seleccione la marca"
          isClearable={false}
        />
      </div>
      <div className="inv-field">
        <label>Modelo</label>
        <InvSelect
          value={modelo}
          options={modelosDeMarca.map((m) => ({ value: m._id, label: m.nombre }))}
          onChange={setModelo}
          placeholder={marca ? "Seleccione el modelo" : "Seleccione primero la marca"}
          isDisabled={!marca}
          isClearable={false}
        />
      </div>
      <div className="inv-field">
        <label>Condición</label>
        <InvSelect
          value={condicion}
          options={[{ value: "NUEVA", label: "Nueva" }, { value: "SEGUNDA", label: "Segunda" }]}
          onChange={setCondicion}
          isClearable={false}
        />
      </div>
      <div className="inv-field">
        <label>Seriales (uno por línea o separados por coma)</label>
        <textarea
          className="inv-input"
          rows={5}
          value={serialesTxt}
          onChange={(e) => setSerialesTxt(e.target.value)}
          placeholder={"CAM001\nCAM002\nCAM003"}
        />
        {seriales.length > 0 && (
          <small style={{ color: "var(--text-muted)" }}>{seriales.length} serial(es) detectado(s)</small>
        )}
      </div>
      <div className="inv-field">
        <label>Observaciones (opcional)</label>
        <input className="inv-input" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
      </div>
    </Modal>
  );
}

function CatalogoModal({ marcas, modelos, onClose, onChanged }) {
  const toast = useToast();
  const [nombreMarca, setNombreMarca] = useState("");
  const [marcaModelo, setMarcaModelo] = useState(null);
  const [nombreModelo, setNombreModelo] = useState("");
  const [saving, setSaving] = useState(false);

  const crearMarca = async () => {
    if (!nombreMarca.trim()) return;
    setSaving(true);
    try {
      await CamarasService.createMarca({ nombre: nombreMarca.trim() });
      toast.success("Listo", "Marca creada");
      setNombreMarca("");
      onChanged();
    } catch (err) {
      toast.error("Error", err.response?.data?.message || "No se pudo crear la marca");
    } finally {
      setSaving(false);
    }
  };

  const crearModelo = async () => {
    if (!marcaModelo || !nombreModelo.trim()) return;
    setSaving(true);
    try {
      await CamarasService.createModelo({ marca: marcaModelo, nombre: nombreModelo.trim() });
      toast.success("Listo", "Modelo creado");
      setNombreModelo("");
      onChanged();
    } catch (err) {
      toast.error("Error", err.response?.data?.message || "No se pudo crear el modelo");
    } finally {
      setSaving(false);
    }
  };

  const eliminarMarca = async (m) => {
    try {
      await CamarasService.removeMarca(m._id);
      toast.success("Listo", `Marca ${m.nombre} eliminada`);
      onChanged();
    } catch (err) {
      toast.error("Error", err.response?.data?.message || "No se pudo eliminar la marca");
    }
  };

  const eliminarModelo = async (m) => {
    try {
      await CamarasService.removeModelo(m._id);
      toast.success("Listo", `Modelo ${m.nombre} eliminado`);
      onChanged();
    } catch (err) {
      toast.error("Error", err.response?.data?.message || "No se pudo eliminar el modelo");
    }
  };

  return (
    <Modal title="Marcas y modelos de cámaras" onClose={onClose} wide
      footer={<button className="inv-btn inv-btn-outline" onClick={onClose}>Cerrar</button>}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div>
          <h4 style={{ margin: "0 0 10px" }}>Marcas</h4>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <input
              className="inv-input"
              placeholder="Nueva marca…"
              value={nombreMarca}
              onChange={(e) => setNombreMarca(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && crearMarca()}
            />
            <button className="inv-btn" disabled={saving || !nombreMarca.trim()} onClick={crearMarca}>+</button>
          </div>
          <InvTable
            data={marcas}
            rowsPerPage={8}
            emptyMessage="Sin marcas"
            columns={[
              { key: "nombre", header: "Nombre", render: (r) => r.nombre },
              { key: "x", header: "", width: 50,
                render: (r) => (
                  <button className="inv-btn inv-btn-sm inv-btn-outline" style={{ color: "var(--inv-danger)" }}
                    onClick={() => eliminarMarca(r)} title="Eliminar">
                    {Icon.trash}
                  </button>
                ) },
            ]}
          />
        </div>
        <div>
          <h4 style={{ margin: "0 0 10px" }}>Modelos</h4>
          <div style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "stretch" }}>
            <div style={{ minWidth: 140 }}>
              <InvSelect
                value={marcaModelo}
                options={marcas.map((m) => ({ value: m._id, label: m.nombre }))}
                onChange={setMarcaModelo}
                placeholder="Marca"
                isClearable={false}
              />
            </div>
            <input
              className="inv-input"
              placeholder="Nuevo modelo…"
              value={nombreModelo}
              onChange={(e) => setNombreModelo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && crearModelo()}
            />
            <button className="inv-btn" disabled={saving || !marcaModelo || !nombreModelo.trim()} onClick={crearModelo}>+</button>
          </div>
          <InvTable
            data={modelos}
            rowsPerPage={8}
            emptyMessage="Sin modelos"
            columns={[
              { key: "marca", header: "Marca", render: (r) => r.marca?.nombre || "—" },
              { key: "nombre", header: "Modelo", render: (r) => r.nombre },
              { key: "x", header: "", width: 50,
                render: (r) => (
                  <button className="inv-btn inv-btn-sm inv-btn-outline" style={{ color: "var(--inv-danger)" }}
                    onClick={() => eliminarModelo(r)} title="Eliminar">
                    {Icon.trash}
                  </button>
                ) },
            ]}
          />
        </div>
      </div>
    </Modal>
  );
}

function AccionModal({ accion, onClose, onSubmit }) {
  const { tipo, camara } = accion;
  const [tipoDestino, setTipoDestino] = useState("VEHICULO");
  const [placa, setPlaca] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [motivo, setMotivo] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const titulo =
    tipo === "instalar" ? `Instalar cámara ${camara.serial}`
    : tipo === "retirar" ? `Retirar cámara ${camara.serial}`
    : `Descartar cámara ${camara.serial}`;

  const valido =
    tipo !== "instalar" ||
    (tipoDestino === "VEHICULO" ? placa.trim().length > 0 : descripcion.trim().length > 0);

  const enviar = () => {
    if (tipo === "instalar") {
      onSubmit({
        tipo: tipoDestino,
        placa: placa.trim() || undefined,
        descripcion: descripcion.trim() || undefined,
        observaciones: observaciones || undefined,
      });
    } else {
      onSubmit({ motivo: motivo || undefined, observaciones: observaciones || undefined });
    }
  };

  return (
    <Modal title={titulo} onClose={onClose}
      footer={
        <>
          <button className="inv-btn inv-btn-outline" onClick={onClose}>Cancelar</button>
          <button className="inv-btn" disabled={!valido} onClick={enviar}
            style={tipo === "descartar" ? { background: "var(--inv-danger)", color: "#fff" } : undefined}>
            {tipo === "instalar" ? "Instalar" : tipo === "retirar" ? "Retirar" : "Descartar"}
          </button>
        </>
      }
    >
      {tipo === "instalar" && (
        <>
          <div className="inv-field">
            <label>Destino</label>
            <InvSelect
              value={tipoDestino}
              options={[
                { value: "VEHICULO", label: "Vehículo (placa)" },
                { value: "SITIO", label: "Sitio / instalación fija" },
              ]}
              onChange={setTipoDestino}
              isClearable={false}
            />
          </div>
          {tipoDestino === "VEHICULO" ? (
            <div className="inv-field">
              <label>Placa</label>
              <input className="inv-input" value={placa} onChange={(e) => setPlaca(e.target.value.toUpperCase())} placeholder="ABC123" />
            </div>
          ) : null}
          <div className="inv-field">
            <label>{tipoDestino === "VEHICULO" ? "Detalle (opcional)" : "Descripción del sitio"}</label>
            <input className="inv-input" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
              placeholder={tipoDestino === "VEHICULO" ? "Empresa, ruta, ubicación en el vehículo…" : "Sede, bodega, oficina…"} />
          </div>
        </>
      )}
      {tipo !== "instalar" && (
        <div className="inv-field">
          <label>Motivo</label>
          <input className="inv-input" value={motivo} onChange={(e) => setMotivo(e.target.value)}
            placeholder={tipo === "retirar" ? "Cambio de vehículo, daño, fin de contrato…" : "Daño irreparable, obsoleta…"} />
        </div>
      )}
      <div className="inv-field">
        <label>Observaciones (opcional)</label>
        <textarea className="inv-input" rows={3} value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
      </div>
      {tipo === "retirar" && (
        <small style={{ color: "var(--text-muted)" }}>
          La cámara vuelve al inventario de la empresa; el retiro y su origen quedan en el historial.
        </small>
      )}
    </Modal>
  );
}

function HistorialModal({ camara, onClose }) {
  const [detalle, setDetalle] = useState(camara);

  useEffect(() => {
    let activo = true;
    CamarasService.get(camara._id)
      .then((d) => activo && d && setDetalle(d))
      .catch(() => {});
    return () => { activo = false; };
  }, [camara._id]);

  const historial = [...(detalle.historial || [])].sort(
    (a, b) => new Date(b.fecha) - new Date(a.fecha),
  );

  return (
    <Modal title={`Historial — ${camara.serial}`} onClose={onClose} wide
      footer={<button className="inv-btn inv-btn-outline" onClick={onClose}>Cerrar</button>}
    >
      <InvTable
        data={historial}
        rowsPerPage={10}
        emptyMessage="Sin movimientos"
        columns={[
          { key: "fecha", header: "Fecha", width: 130, render: (r) => fmtFechaHora(r.fecha) },
          { key: "accion", header: "Acción",
            render: (r) => <InvTag value={ACCION_LABEL[r.accion] || r.accion} severity="info" /> },
          { key: "transicion", header: "Transición",
            render: (r) => (r.estadoAnterior || r.estadoNuevo)
              ? `${ESTADO_LABEL[r.estadoAnterior] || r.estadoAnterior || "—"} → ${ESTADO_LABEL[r.estadoNuevo] || r.estadoNuevo || "—"}`
              : "—" },
          { key: "ubic", header: "Ubicación",
            render: (r) => r.ubicacionNueva || r.ubicacionAnterior || "—" },
          { key: "motivo", header: "Motivo / Obs.",
            render: (r) => [r.motivo, r.observaciones].filter(Boolean).join(" — ") || "—" },
        ]}
      />
    </Modal>
  );
}

function Modal({ title, children, footer, onClose, wide }) {
  return (
    <div className="inv-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="inv-modal" style={wide ? { maxWidth: 760, width: "94vw" } : undefined}>
        <div className="inv-modal-header">
          <h3>{title}</h3>
          <button className="inv-btn inv-btn-sm inv-btn-outline" onClick={onClose}>✕</button>
        </div>
        <div className="inv-modal-body">{children}</div>
        {footer && <div className="inv-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

function Kpi({ label, value, hint, variant }) {
  return (
    <div className={`inv-kpi ${variant || ""}`}>
      <span className="label">{label}</span>
      <span className="value">{value}</span>
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}

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
