import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import RndcService from "../../Services/rndcApi";
import { useAuth } from "../../Context/AuthContext";

// Estilos CSS del Dashboard original
const styles = `
  .dashboard-container {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    min-height: 100vh;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .main-wrapper {
    max-width: 1400px;
    margin: 0 auto;
  }

  .dash-header {
    background: white;
    padding: 20px 30px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .dash-header h1 {
    color: #667eea;
    font-size: 28px;
    margin: 0 0 5px 0;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }

  .stat-card {
    background: white;
    padding: 25px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
    display: flex;
    flex-direction: column;
  }

  .stat-card:hover {
    transform: translateY(-5px);
  }

  .stat-card h3 {
    color: #666;
    font-size: 14px;
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .stat-value {
    font-size: 36px;
    font-weight: bold;
    color: #667eea;
  }

  .stat-label {
    font-size: 12px;
    color: #999;
    margin-top: 5px;
  }

  .custom-tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .custom-tab {
    background: white;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border: none;
    font-size: 14px;
  }

  .custom-tab:hover {
    background: #f0f0f0;
  }

  .custom-tab.active {
    background: #667eea;
    color: white;
  }

  .content-card {
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    min-height: 400px;
  }

  .filters {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    align-items: flex-end;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  .filter-group label {
      font-size: 12px; 
      font-weight: bold; 
      color: #666;
  }

  .filter-input {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      min-width: 150px;
  }
  
  .refresh-btn {
      background: #28a745; 
      color: white; 
      border: none; 
      padding: 8px 15px; 
      border-radius: 5px; 
      cursor: pointer;
      font-weight: bold;
      margin-left: auto;
  }
  
  .refresh-btn:hover { background: #218838; }

  /* Delete Button Fix */
  .delete-btn {
      background-color: #dc3545;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 36px;
      height: 36px;
  }
  .delete-btn:hover { background-color: #c82333; }
  .delete-btn i { font-size: 14px; }
`;

const getPlacasFilter = (username, vehiculos, roles = []) => {
  const superAdmins = ["admin", "asegurar", "soporte", "prueba", "desa"];
  if (
    roles.includes("ROLE_ADMIN") ||
    superAdmins.includes(username.toLowerCase())
  ) {
    return null;
  }
  if (roles.includes("ROLE_USER")) {
    if (!vehiculos || vehiculos.length === 0) return ["NINGUNA"];
    return vehiculos.map((v) => v.placa);
  }
  return ["NINGUNA"];
};

// Internal component for Expanded Row
function ManifiestoDetail({ manifiesto }) {
  const [ubicacion, setUbicacion] = useState(null);
  const [loadingLoc, setLoadingLoc] = useState(false);

  const fetchLocation = async () => {
    setLoadingLoc(true);
    try {
      const res = await RndcService.getUbicacionVehiculo(manifiesto.placa);
      console.log("Ubicacion response:", res);
      // Handle RNDC Proxy response structure
      let locationData = null;
      if (res.success && res.data) locationData = res.data;
      else if (res.lat && res.lng) locationData = res;

      setUbicacion(locationData);
    } catch (e) {
      console.error("Error fetching location:", e);
    } finally {
      setLoadingLoc(false);
    }
  };

  const formatDateTime = (fecha, hora) => {
    try {
      if (!fecha) return "";

      // Handle ISO date strings
      let dateObj;
      if (fecha.includes("T") || fecha.includes("Z")) {
        dateObj = new Date(fecha);
      } else {
        // Handle format like "2024-12-27" with time "10:30:00"
        const dateTimeStr = hora ? `${fecha}T${hora}` : fecha;
        dateObj = new Date(dateTimeStr);
      }

      // Check if valid date
      if (isNaN(dateObj.getTime())) {
        return `${fecha} ${hora || ""}`;
      }

      return dateObj.toLocaleString("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return `${fecha} ${hora || ""}`;
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        background: "#f8f9fa",
        borderLeft: "4px solid #667eea",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 15,
        }}
      >
        <h4 style={{ margin: 0, color: "#333" }}>
          📍 Puntos de Control - {manifiesto.placa}
        </h4>
        {manifiesto.esMonitoreable && (
          <Button
            label={loadingLoc ? "Buscando..." : "📡 Ver Ubicación Actual"}
            icon={loadingLoc ? "pi pi-spin pi-spinner" : "pi pi-map-marker"}
            onClick={fetchLocation}
            severity="info"
            outlined
            size="small"
          />
        )}
      </div>

      {ubicacion && (
        <div
          style={{
            background: "#d1ecf1",
            padding: 15,
            borderRadius: 6,
            marginBottom: 20,
            border: "1px solid #bee5eb",
          }}
        >
          <strong style={{ color: "#0c5460" }}>
            📍 Última Ubicación de {manifiesto.placa}:
          </strong>
          <br />
          <strong>Fecha:</strong>{" "}
          {new Date(ubicacion.momento).toLocaleString("es-CO")} <br />
          <strong>Velocidad:</strong> {ubicacion.velocidad} km/h |{" "}
          <strong>Evento:</strong>{" "}
          {typeof ubicacion.evento === "object"
            ? ubicacion.evento?.tipoEvento?.nombre || "Reporte"
            : ubicacion.evento}{" "}
          <br />
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${ubicacion.lat},${ubicacion.lng}`}
            target="_blank"
            rel="noreferrer"
            style={{
              color: "#007bff",
              fontWeight: "bold",
              marginTop: 8,
              display: "inline-block",
            }}
          >
            🗺️ Ver en Google Maps
          </a>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 15,
        }}
      >
        {manifiesto.puntosControl.map((p, i) => (
          <div
            key={i}
            className="point-card"
            style={{
              background: "white",
              padding: 15,
              borderRadius: 8,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              border: "1px solid #dee2e6",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontWeight: "bold", fontSize: 14 }}>
                Punto {p.codigoPunto}
              </span>
              <Tag
                value={p.estado?.toUpperCase() || "PENDIENTE"}
                severity={p.estado === "completado" ? "success" : "warning"}
              />
            </div>
            <div style={{ fontSize: 13, color: "#495057" }}>
              <p style={{ margin: "0 0 5px 0" }}>
                <strong>📍 {p.nombreMunicipio}</strong>
              </p>
              <p style={{ margin: "5px 0", fontSize: 12, color: "#6c757d" }}>
                Código: {p.codigoMunicipio || p.code}
              </p>
              <p style={{ margin: "5px 0" }}>
                <strong>Cita:</strong> {formatDateTime(p.fechaCita, p.horaCita)}
              </p>
              {p.radicadoRNDC && (
                <div
                  style={{
                    marginTop: 8,
                    padding: 5,
                    background: "#d4edda",
                    borderRadius: 4,
                  }}
                >
                  <strong style={{ color: "#155724", fontSize: 11 }}>
                    ✓ Radicado:
                  </strong>{" "}
                  <span style={{ color: "#155724", fontSize: 11 }}>
                    {p.radicadoRNDC}
                  </span>
                </div>
              )}
              {p.latitud && p.longitud && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${p.latitud},${p.longitud}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-block",
                    marginTop: 8,
                    color: "#007bff",
                    textDecoration: "none",
                    fontSize: 12,
                  }}
                >
                  🗺️ Ver en Mapa
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardRndc() {
  const { logout } = useAuth();

  // Load user data internally
  const [userData, setUserData] = useState({
    username: "",
    vehiculos: [],
    roles: [],
    persona: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("rndc_user") || "{}");
    setUserData({
      username: storedUser.username || "",
      vehiculos: storedUser.vehiculos || [],
      roles: storedUser.roles || [],
      persona: storedUser.persona || storedUser.username || "",
    });
  }, []);

  const username = userData.persona || userData.username;
  const vehiculos = userData.vehiculos;
  const roles = userData.roles;
  const onLogout = logout;
  // Check if user is admin
  const isAdmin =
    roles?.includes("ROLE_ADMIN") ||
    ["admin", "asegurar", "soporte", "prueba", "desa"].includes(
      username?.toLowerCase(),
    );

  const [activeTab, setActiveTab] = useState("manifiestos");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    monitoreables: 0,
    noMonitoreables: 0,
    rmmPendientes: 0,
  });
  const toast = useRef(null);

  const [manifiestos, setManifiestos] = useState([]);
  const [rmms, setRmms] = useState([]);
  const [logs, setLogs] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);

  // States for filters
  const [filters, setFilters] = useState({
    estado: "",
    monitoreable: "",
    placa: "",
    rmmEstado: "",
    logStatus: "",
    logTipo: "",
  });

  const [logModalVisible, setLogModalVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  // --- Handlers ---
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // --- Data Loading ---
  const loadStats = async () => {
    try {
      const res = await RndcService.getStats();
      let data = res.data || res;
      if (res.data && res.data.data) data = res.data.data;

      setStats({
        total: data.manifiestos?.total || 0,
        monitoreables: data.manifiestos?.monitoreables || 0,
        noMonitoreables: data.manifiestos?.noMonitoreables || 0,
        rmmPendientes: data.rmm?.pendientes || 0,
      });
    } catch (e) {
      console.error("Error loading stats", e);
    }
  };

  const loadManifiestos = async () => {
    setLoading(true);
    try {
      const placas = getPlacasFilter(username, vehiculos, roles);
      // Fetch all manifests for this user context (clean slate)
      const res = await RndcService.getManifiestos(placas, {});

      let data = [];
      if (Array.isArray(res)) data = res;
      else if (res.data && Array.isArray(res.data.manifiestos))
        data = res.data.manifiestos;
      else if (res.data && Array.isArray(res.data)) data = res.data;
      else if (res.manifiestos && Array.isArray(res.manifiestos))
        data = res.manifiestos;

      // Client-side Filtering
      if (filters.estado) {
        data = data.filter((m) => m.estado === filters.estado);
      }
      if (filters.monitoreable) {
        const isMonitoreable = filters.monitoreable === "true";
        data = data.filter((m) => m.esMonitoreable === isMonitoreable);
      }
      if (filters.placa) {
        data = data.filter((m) =>
          m.placa.toLowerCase().includes(filters.placa.toLowerCase()),
        );
      }

      setManifiestos(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadRMMs = async () => {
    setLoading(true);
    try {
      const apiFilters = {};
      if (filters.rmmEstado) apiFilters.estado = filters.rmmEstado;
      const res = await RndcService.getRMMs(apiFilters);

      let data = [];
      if (res.data && Array.isArray(res.data.rmms)) data = res.data.rmms;
      else if (res.rmms && Array.isArray(res.rmms)) data = res.rmms;
      else if (Array.isArray(res)) data = res;

      setRmms(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadLogs = async () => {
    setLoading(true);
    try {
      const apiFilters = {};
      if (filters.logStatus) apiFilters.status = filters.logStatus;
      if (filters.logTipo) apiFilters.tipo = filters.logTipo;
      const res = await RndcService.getLogs(apiFilters);

      let data = [];
      if (res.data && Array.isArray(res.data.logs)) data = res.data.logs;
      else if (res.logs && Array.isArray(res.logs)) data = res.logs;
      else if (Array.isArray(res)) data = res;

      setLogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadAlertas = async () => {
    try {
      const res = await RndcService.getLogs({ tipo: "registro_rmm" });
      let data = [];
      if (res.data && Array.isArray(res.data.logs)) data = res.data.logs;
      else if (res.logs && Array.isArray(res.logs)) data = res.logs;
      else if (Array.isArray(res)) data = res;
      setAlertas(data);
    } catch (e) {
      console.error(e);
    }
  };

  // --- Effects ---
  useEffect(() => {
    loadStats();
    if (activeTab === "manifiestos") loadManifiestos();
    if (activeTab === "rmm") loadRMMs();
    if (activeTab === "logs" && isAdmin) loadLogs();
    if (activeTab === "alertas" && isAdmin) loadAlertas();

    const interval = setInterval(() => {
      loadStats();
    }, 30000);
    return () => clearInterval(interval);
  }, [activeTab, username, roles, filters]);

  // --- Actions ---
  const handleReintentar = async (id) => {
    try {
      await RndcService.reintentarRMM(id);
      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Marcado para reintento",
      });
      loadRMMs();
      loadStats();
    } catch (e) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Falló el reintento",
      });
    }
  };

  const handleDelete = (id) => {
    console.log("Intentando borrar ID:", id); // Debug
    confirmDialog({
      message:
        "¿Estás seguro de que deseas borrar este manifiesto permanentemente?",
      header: "Confirmar Eliminación",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          await RndcService.deleteManifiesto(id);
          toast.current.show({
            severity: "success",
            summary: "Borrado",
            detail: "Manifiesto eliminado",
          });
          // Reload data
          if (activeTab === "manifiestos") loadManifiestos();
          loadStats();
        } catch (e) {
          console.error("Error borrando:", e);
          // Si es error 404, probablemente ya no existe, así que actualizamos la lista
          if (e.response && e.response.status === 404) {
            toast.current.show({
              severity: "warn",
              summary: "Aviso",
              detail: "El manifiesto no fue encontrado (quizás ya se borró).",
            });
            if (activeTab === "manifiestos") loadManifiestos();
            loadStats();
          } else {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: "Error al borrar (Revisar consola)",
            });
          }
        }
      },
    });
  };

  const handleDeleteWithContext = () => {
    confirmDialog({
      message:
        '¿Estás seguro de BORRAR TODOS los manifiestos con alerta "Vehículo no existe en Cellvi"? Esta acción no se puede deshacer.',
      header: "LIMPIEZA MASIVA",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: async () => {
        setLoading(true);
        try {
          // Get all manifests first to filter
          const placas = getPlacasFilter(username, vehiculos, roles);
          const res = await RndcService.getManifiestos(placas, {});
          let data = Array.isArray(res) ? res : res.data || [];

          // Filter using the ENGLISH message returned by backend
          const toDelete = data.filter((m) =>
            m.motivoNoMonitoreable?.includes(
              "Vehicle does not exist in Cellvi",
            ),
          );

          if (toDelete.length === 0) {
            toast.current.show({
              severity: "info",
              summary: "Info",
              detail: "No se encontraron registros para borrar.",
            });
            return;
          }

          let deletedCount = 0;
          for (const m of toDelete) {
            await RndcService.deleteManifiesto(m._id);
            deletedCount++;
          }

          toast.current.show({
            severity: "success",
            summary: "Limpieza Completada",
            detail: `Se eliminaron ${deletedCount} registros.`,
          });
          loadManifiestos();
          loadStats();
        } catch (e) {
          console.error(e);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Ocurrió un error en la limpieza masiva.",
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Template for Expanded Row
  const rowExpansionTemplate = (data) => {
    return <ManifiestoDetail manifiesto={data} />;
  };

  return (
    <div className="dashboard-container">
      <style>{styles}</style>
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="main-wrapper">
        <header className="dash-header">
          <div>
            <h1>🚛 Dashboard RNDC2</h1>
            <p style={{ color: "#666", margin: 0 }}>
              Sistema de Monitoreo de Manifiestos y Vehículos -{" "}
              <strong>{username}</strong>
            </p>
          </div>
          <Button
            label="Cerrar Sesión"
            icon="pi pi-power-off"
            severity="secondary"
            outlined
            onClick={onLogout}
          />
        </header>

        {/* Estadísticas */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Manifiestos</h3>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">En base de datos</div>
          </div>
          <div className="stat-card">
            <h3>Monitoreables</h3>
            <div className="stat-value" style={{ color: "#28a745" }}>
              {stats.monitoreables}
            </div>
            <div className="stat-label">Vehículos asignados</div>
          </div>
          <div className="stat-card">
            <h3>No Monitoreables</h3>
            <div className="stat-value" style={{ color: "#dc3545" }}>
              {stats.noMonitoreables}
            </div>
            <div className="stat-label">Vehículos no asignados</div>
          </div>
          <div className="stat-card">
            <h3>RMMs Pendientes</h3>
            <div className="stat-value" style={{ color: "#ffc107" }}>
              {stats.rmmPendientes}
            </div>
            <div className="stat-label">Por enviar al RNDC</div>
          </div>
        </div>

        {/* Tabs - Reverted to HTML buttons for better visibility */}
        <div className="custom-tabs">
          <button
            className={`custom-tab ${
              activeTab === "manifiestos" ? "active" : ""
            }`}
            onClick={() => setActiveTab("manifiestos")}
          >
            📋 Manifiestos
          </button>
          <button
            className={`custom-tab ${activeTab === "rmm" ? "active" : ""}`}
            onClick={() => setActiveTab("rmm")}
          >
            📤 RMMs
          </button>
          {isAdmin && (
            <button
              className={`custom-tab ${
                activeTab === "alertas" ? "active" : ""
              }`}
              onClick={() => setActiveTab("alertas")}
            >
              🚨 Alertas
            </button>
          )}
          {isAdmin && (
            <button
              className={`custom-tab ${activeTab === "logs" ? "active" : ""}`}
              onClick={() => setActiveTab("logs")}
            >
              🐛 Bitácora
            </button>
          )}
        </div>

        {/* Contenido */}
        <div className="content-card">
          {activeTab === "manifiestos" && (
            <div>
              <div className="filters">
                <div className="filter-group">
                  <label>Estado</label>
                  <select
                    className="filter-input"
                    value={filters.estado}
                    onChange={(e) =>
                      handleFilterChange("estado", e.target.value)
                    }
                  >
                    <option value="">Todos</option>
                    <option value="activo">Activo</option>
                    <option value="completado">Completado</option>
                    <option value="anulado">Anulado</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Monitoreable</label>
                  <select
                    className="filter-input"
                    value={filters.monitoreable}
                    onChange={(e) =>
                      handleFilterChange("monitoreable", e.target.value)
                    }
                  >
                    <option value="">Todos</option>
                    <option value="true">Sí</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Placa</label>
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="Buscar Placa..."
                    value={filters.placa}
                    onChange={(e) =>
                      handleFilterChange("placa", e.target.value)
                    }
                  />
                </div>
                <Button
                  label="Actualizar"
                  icon="pi pi-refresh"
                  severity="success"
                  onClick={loadManifiestos}
                  style={{ marginLeft: "auto" }}
                />
                {isAdmin && (
                  <Button
                    label="Borrar Errores Cellvi"
                    icon="pi pi-trash"
                    severity="danger"
                    outlined
                    style={{ marginLeft: 10 }}
                    onClick={handleDeleteWithContext}
                  />
                )}
              </div>
              <DataTable
                value={manifiestos}
                paginator
                rows={10}
                loading={loading}
                emptyMessage="No hay datos disponibles."
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowExpansionTemplate}
                dataKey="_id"
              >
                <Column expander style={{ width: "3em" }} />
                <Column
                  field="numManifiesto"
                  header="Manifiesto"
                  body={(r) => <strong>{r.numManifiesto}</strong>}
                  sortable
                ></Column>
                <Column field="placa" header="Placa" sortable></Column>
                <Column
                  field="estado"
                  header="Estado"
                  body={(r) => (
                    <Tag
                      value={r.estado?.toUpperCase()}
                      severity={
                        r.estado === "activo"
                          ? "info"
                          : r.estado === "completado"
                            ? "success"
                            : "danger"
                      }
                    />
                  )}
                ></Column>
                <Column
                  field="esMonitoreable"
                  header="Monitoreable"
                  body={(r) =>
                    r.esMonitoreable ? (
                      <Tag severity="success" value="SÍ" icon="pi pi-check" />
                    ) : (
                      <div>
                        <Tag severity="danger" value="NO" icon="pi pi-times" />
                        {r.motivoNoMonitoreable && (
                          <small
                            style={{
                              display: "block",
                              color: "#dc3545",
                              marginTop: 3,
                              fontSize: 10,
                            }}
                          >
                            {r.motivoNoMonitoreable}
                          </small>
                        )}
                      </div>
                    )
                  }
                ></Column>
                <Column field="puntosControl.length" header="Puntos"></Column>
                {isAdmin && (
                  <Column
                    header="Acciones"
                    body={(r) => (
                      <Button
                        icon="pi pi-trash"
                        severity="danger"
                        rounded
                        onClick={() => handleDelete(r._id || r.id)}
                        tooltip="Borrar Permanentemente"
                      />
                    )}
                  ></Column>
                )}
              </DataTable>
            </div>
          )}

          {activeTab === "rmm" && (
            <div>
              <div className="filters">
                <div className="filter-group">
                  <label>Estado</label>
                  <select
                    className="filter-input"
                    value={filters.rmmEstado}
                    onChange={(e) =>
                      handleFilterChange("rmmEstado", e.target.value)
                    }
                  >
                    <option value="">Todos</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="reportado">Reportado</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                <Button
                  label="Actualizar"
                  icon="pi pi-refresh"
                  severity="success"
                  onClick={loadRMMs}
                  style={{ marginLeft: "auto" }}
                />
              </div>
              <DataTable
                value={rmms}
                paginator
                rows={10}
                loading={loading}
                emptyMessage="No hay RMMs."
              >
                <Column field="numPlaca" header="Placa" sortable></Column>
                <Column field="codigoPuntoControl" header="Punto"></Column>
                <Column
                  header="Llegada"
                  body={(r) => `${r.fechaLlegada} ${r.horaLlegada}`}
                ></Column>
                <Column
                  field="estado"
                  header="Estado"
                  body={(r) => (
                    <Tag
                      value={r.estado?.toUpperCase()}
                      severity={
                        r.estado === "reportado"
                          ? "success"
                          : r.estado === "error"
                            ? "danger"
                            : "warning"
                      }
                    />
                  )}
                ></Column>
                <Column field="radicadoRNDC" header="Radicado"></Column>
                <Column
                  header="Acciones"
                  body={(r) => (
                    <div style={{ display: "flex", gap: 5 }}>
                      {r.estado === "error" && (
                        <Button
                          label="Reintentar"
                          icon="pi pi-refresh"
                          severity="danger"
                          size="small"
                          onClick={() => handleReintentar(r._id)}
                        />
                      )}
                      <Button
                        icon="pi pi-file"
                        severity="info"
                        size="small"
                        outlined
                        onClick={() => {
                          setSelectedLog({
                            requestPayload: JSON.stringify(r, null, 2),
                            responsePayload: r.respuestaRNDC || "N/A",
                          });
                          setLogModalVisible(true);
                        }}
                        tooltip="Ver Detalles"
                      />
                    </div>
                  )}
                ></Column>
              </DataTable>
            </div>
          )}

          {activeTab === "alertas" && isAdmin && (
            <div>
              <div className="filters">
                <Button
                  label="Actualizar"
                  icon="pi pi-refresh"
                  severity="success"
                  onClick={loadAlertas}
                />
              </div>
              <p style={{ marginBottom: 15, color: "#666" }}>
                Confirmaciones exactas (XML) de tus reportes de LLEGADA y
                SALIDA.
              </p>
              <DataTable
                value={alertas}
                paginator
                rows={15}
                sortField="timestamp"
                sortOrder={-1}
                loading={loading}
              >
                <Column
                  field="timestamp"
                  header="Fecha"
                  body={(r) => new Date(r.timestamp).toLocaleString("es-CO")}
                  sortable
                ></Column>
                <Column header="Placa" field="metadata.numplaca"></Column>
                <Column field="tipo" header="Tipo"></Column>
                <Column
                  header="Estado"
                  body={(r) => (
                    <Tag
                      value={r.status}
                      severity={r.status === "success" ? "success" : "danger"}
                    />
                  )}
                ></Column>
                <Column field="duration" header="Duración (ms)"></Column>
                <Column
                  header="Detalle Técnico"
                  body={(r) => (
                    <Button
                      label="Ver"
                      size="small"
                      outlined
                      onClick={() => {
                        setSelectedLog(r);
                        setLogModalVisible(true);
                      }}
                    />
                  )}
                ></Column>
              </DataTable>
            </div>
          )}

          {activeTab === "logs" && isAdmin && (
            <div>
              <div className="filters">
                <div className="filter-group">
                  <label>Estado</label>
                  <select
                    className="filter-input"
                    value={filters.logStatus}
                    onChange={(e) =>
                      handleFilterChange("logStatus", e.target.value)
                    }
                  >
                    <option value="">Todos</option>
                    <option value="success">Success</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Tipo</label>
                  <select
                    className="filter-input"
                    value={filters.logTipo}
                    onChange={(e) =>
                      handleFilterChange("logTipo", e.target.value)
                    }
                  >
                    <option value="">Todos</option>
                    <option value="sync_manifiestos">Sync Manifiestos</option>
                    <option value="registro_rmm">Registro RMM</option>
                    <option value="consulta_ruteo">Consulta Ruteo</option>
                  </select>
                </div>
                <Button
                  label="Actualizar"
                  icon="pi pi-refresh"
                  severity="success"
                  onClick={loadLogs}
                  style={{ marginLeft: "auto" }}
                />
              </div>
              <DataTable
                value={logs}
                paginator
                rows={15}
                sortField="timestamp"
                sortOrder={-1}
                loading={loading}
                emptyMessage="No hay logs"
              >
                <Column
                  field="timestamp"
                  header="Hora"
                  body={(r) => new Date(r.timestamp).toLocaleString("es-CO")}
                  sortable
                ></Column>
                <Column
                  field="tipo"
                  header="Tipo"
                  style={{ maxWidth: "150px" }}
                ></Column>
                <Column
                  field="status"
                  header="Estado"
                  body={(r) => (
                    <Tag
                      value={r.status}
                      severity={r.status === "success" ? "success" : "danger"}
                    />
                  )}
                ></Column>
                <Column
                  field="duration"
                  header="Duración"
                  body={(r) => (r.duration ? `${r.duration}ms` : "N/A")}
                ></Column>
                <Column
                  header="Detalle Técnico"
                  body={(r) => (
                    <Button
                      label="Ver"
                      icon="pi pi-eye"
                      size="small"
                      outlined
                      onClick={() => {
                        setSelectedLog(r);
                        setLogModalVisible(true);
                      }}
                    />
                  )}
                ></Column>
              </DataTable>
            </div>
          )}
        </div>
      </div>

      {/* Modal Log */}
      <Dialog
        visible={logModalVisible}
        style={{ width: "70vw" }}
        onHide={() => setLogModalVisible(false)}
        header="Detalle Técnico de Comunicación"
      >
        {selectedLog && (
          <div>
            <h4>Petición / Datos Enviados</h4>
            <pre
              style={{
                background: "#f4f4f4",
                padding: 10,
                overflow: "auto",
                maxHeight: 300,
                fontSize: 11,
              }}
            >
              {selectedLog.requestPayload}
            </pre>
            <h4>Respuesta / Datos Recibidos</h4>
            <pre
              style={{
                background: "#f4f4f4",
                padding: 10,
                overflow: "auto",
                maxHeight: 300,
                fontSize: 11,
              }}
            >
              {selectedLog.responsePayload}
            </pre>
          </div>
        )}
      </Dialog>
    </div>
  );
}
