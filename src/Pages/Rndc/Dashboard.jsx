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
    background: linear-gradient(13deg, #0c508f 0%, #ffffff 100%);
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
    color: #094aa0;
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
    color: #094aa0;
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
    background: #094aa0;
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

  .manualOverlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    z-index: 9999;
    overflow: hidden;
  }

  .manualModal {
    width: min(980px, 100%);
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(15, 23, 42, 0.25);
    border: 1px solid rgba(148, 163, 184, 0.35);
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .manualHeader {
    position: sticky;
    top: 0;
    background: #fff;
    padding: 14px 16px;
    border-bottom: 1px solid rgba(148, 163, 184, 0.25);
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 2;
  }

  .manualTitle {
    font-weight: 800;
    font-size: 18px;
    color: #0f172a;
    margin: 0;
  }

  .manualChip {
    margin-left: 10px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #094aa0;
    background: rgba(9, 74, 160, 0.08);
    border: 1px solid rgba(9, 74, 160, 0.2);
    padding: 4px 8px;
    border-radius: 999px;
  }

  .manualBody {
    padding: 16px;
    overflow-y: auto;
    max-height: 75vh;
  }

  .manualBody h1 {
    font-size: 20px;
    margin: 0 0 10px;
    font-weight: 900;
    color: #0f172a;
  }

  .manualBody h2 {
    font-size: 16px;
    margin: 18px 0 8px;
    font-weight: 900;
    color: #0f172a;
  }

  .manualBody h3 {
    font-size: 14px;
    margin: 14px 0 6px;
    font-weight: 800;
    color: #0f172a;
  }

  .manualBody p {
    margin: 8px 0;
    line-height: 1.55;
    color: #0f172a;
  }

  .manualBody ul {
    margin: 8px 0 8px 18px;
  }

  .manualBody li {
    margin: 6px 0;
  }

  .manualBody hr {
    border: none;
    border-top: 1px solid rgba(148, 163, 184, 0.35);
    margin: 16px 0;
  }

  .manualBody code {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 8px;
    background: rgba(226, 232, 240, 0.7);
    border: 1px solid rgba(148, 163, 184, 0.25);
  }

  .manualNote {
    margin: 12px 0;
    padding: 12px 12px;
    border-radius: 12px;
    background: rgba(219, 234, 254, 0.6);
    border: 1px solid rgba(147, 197, 253, 0.7);
  }

  .manualDialog .p-dialog-header,
  .manualDialog .p-dialog-content {
    padding: 0;
  }

  .manualDialog .p-dialog-header,
  .manualDialog .p-dialog-content,
  .manualDialog .p-dialog {
    overflow: hidden;
  }
`;

const MANUAL_USUARIO = `#  Manual de Usuario - Dashboard RNDC

Bienvenido al sistema de monitoreo de manifiestos RNDC. Esta guía le ayudará a usar la plataforma para supervisar el estado de su flota y el cumplimiento de los reportes al Ministerio de Transporte.

##  Acceso al Sistema

1.  Ingrese a la dirección web proporcionada por soporte (ej. \`https://www.asegurar.com.co/rndc\`).
2.  Use sus **credenciales de Cellvi** (El mismo Usuario y Contraseña que usa para rastrear sus vehículos).
3.  Haga clic en **Ingresar**.

> **Nota:** No necesita crear un usuario nuevo. Su cuenta de Cellvi funciona automáticamente.

---

##  Pantalla Principal (Dashboard)

Al ingresar, verá un resumen ejecutivo en la parte superior con 4 indicadores:

- **Total Manifiestos:** Cantidad total de viajes activos descargados del RNDC para su cuenta.
- **Monitoreables:** Viajes donde el vehículo SÍ está registrado en Cellvi y tiene GPS activo. Estos se reportan automáticamente.
- **No Monitoreables:** Viajes donde la placa del RNDC no coincide con ningún vehículo en su cuenta de Cellvi. **¡Atención!** Estos viajes requieren revisión manual ya que no tenemos GPS para ellos.
- **RMMs Pendientes:** Reportes en cola esperando ser transmitidos al servidor del Ministerio.

---

##  Pestaña: Manifiestos

Es la vista principal donde gestiona sus viajes.

###  Filtros

Use la barra gris superior para encontrar viajes específicos:

- **Placa:** Escriba las letras o números de la placa.
- **Estado:** Filtre por \`ACTIVO\` (en viaje), \`CUMPLIDO\` (terminado) o \`ANULADO\`.
- **Monitoreable:** Seleccione "Sí" para ver solo los que se están reportando automáticamente.

### Detalle del Viaje

Haga clic en la flecha **( > )** a la izquierda de cada fila para desplegar la información detallada:

1.  **Botón "Ver Ubicación Actual":** Muestra la última posición GPS conocida del vehículo, velocidad y enlace directo a Google Maps.
2.  **Lista de Puntos de Control:** Muestra las ciudades por donde debe pasar el vehículo.
    - **Etiqueta Verde (COMPLETADO):** El vehículo ya pasó y se reportó al RNDC. Muestra el número de Radicado.
    - **Etiqueta Amarilla (PENDIENTE):** El vehículo aún no ha llegado a este punto.
    - **Mapa:** Enlace para ver la ubicación exacta del punto de control en el mapa.

---

##  Pestaña: RMMs (Reportes de Monitoreo)

Esta pestaña es una auditoría técnica de los envíos al ministerio. Úsela para verificar cumplimiento.

- **Estado Enviado (Verde):** El ministerio recibió y aprobó el reporte de llegada/salida.
- **Estado Error (Rojo):** Hubo un problema. Ponga el mouse sobre el ícono de error para ver el mensaje del RNDC (ej. "Conductor no corresponde").
- **Acciones:**
  - **Reintentar:** Si ve un error de conexión, use este botón para intentar enviar de nuevo.

---

##  Pestaña: Bitácora / Alertas (Solo Admin)

Aquí se muestran las **Novedades (RNMM)** generadas automáticamente.

- **Código 1:** El vehículo no llegó al punto de control 24 horas después de la cita.
- **Código 2:** La placa del manifiesto no existe en nuestra plataforma de rastreo.

Estas novedades se reportan automáticamente al RNDC para evitar sanciones por falta de información.

---

## Preguntas Frecuentes

**¿Por qué un manifiesto dice "No Monitoreable"?**
Significa que la placa escrita en el manifiesto del RNDC no existe exactamente igual en su cuenta de Cellvi. Verifique que el vehículo esté creado en la plataforma de rastreo.

**¿Cuánto tarda en aparecer un nuevo manifiesto aquí?**
El sistema consulta al RNDC cada **15 minutos**. Si acaba de crear el manifiesto en la página del ministerio, espere al próximo ciclo de sincronización.

**¿Qué pasa si el conductor apaga el GPS?**
Si el GPS no reporta, el sistema no puede detectar la llegada. Si pasan 24 horas de la cita sin reporte, el sistema generará automáticamente una **Novedad RNMM** indicando que el vehículo no apareció, para cumplir con la normativa vigilar.

**¿La sesión caduca?**
Sí. Por seguridad, la sesión se cierra automáticamete tras un tiempo de inactividad. Si ve un mensaje de "¿Sigues ahí?", confirme para continuar trabajando sin perder sus filtros.

---

**Soporte Técnico:** Contacte al área de sistemas si detecta errores persistentes en color rojo.
`;

const renderInline = (text, keyPrefix) => {
  if (!text) return null;
  const parts = [];
  let i = 0;
  while (i < text.length) {
    if (text[i] === "`") {
      const end = text.indexOf("`", i + 1);
      if (end !== -1) {
        parts.push(
          <code key={`${keyPrefix}-code-${i}`}>{text.slice(i + 1, end)}</code>,
        );
        i = end + 1;
        continue;
      }
    }
    if (text[i] === "*" && text[i + 1] === "*") {
      const end = text.indexOf("**", i + 2);
      if (end !== -1) {
        parts.push(
          <strong key={`${keyPrefix}-strong-${i}`}>
            {text.slice(i + 2, end)}
          </strong>,
        );
        i = end + 2;
        continue;
      }
    }
    let next = text.length;
    const nextCode = text.indexOf("`", i);
    const nextStrong = text.indexOf("**", i);
    if (nextCode !== -1) next = Math.min(next, nextCode);
    if (nextStrong !== -1) next = Math.min(next, nextStrong);
    parts.push(
      <React.Fragment key={`${keyPrefix}-text-${i}`}>
        {text.slice(i, next)}
      </React.Fragment>,
    );
    i = next;
  }
  return parts;
};

const renderManual = (text) => {
  const lines = String(text || "").split(/\r?\n/);
  const blocks = [];
  let listItems = [];
  const flushList = () => {
    if (listItems.length) {
      blocks.push(
        <ul key={`ul-${blocks.length}`} className="manualUl">
          {listItems.map((item, idx) => (
            <li key={`li-${idx}`} className="manualLi">
              {renderInline(item, `li-${blocks.length}-${idx}`)}
            </li>
          ))}
        </ul>,
      );
      listItems = [];
    }
  };

  lines.forEach((rawLine, idx) => {
    const line = rawLine.trim();
    if (!line) {
      flushList();
      return;
    }
    if (line === "---") {
      flushList();
      blocks.push(<hr key={`hr-${idx}`} className="manualHr" />);
      return;
    }
    if (line.startsWith("# ")) {
      flushList();
      blocks.push(
        <h1 key={`h1-${idx}`} className="manualH1">
          {renderInline(line.slice(2).trim(), `h1-${idx}`)}
        </h1>,
      );
      return;
    }
    if (line.startsWith("## ")) {
      flushList();
      blocks.push(
        <h2 key={`h2-${idx}`} className="manualH2">
          {renderInline(line.slice(3).trim(), `h2-${idx}`)}
        </h2>,
      );
      return;
    }
    if (line.startsWith("### ")) {
      flushList();
      blocks.push(
        <h3 key={`h3-${idx}`} className="manualH3">
          {renderInline(line.slice(4).trim(), `h3-${idx}`)}
        </h3>,
      );
      return;
    }
    if (line.startsWith("- ")) {
      listItems.push(line.slice(2).trim());
      return;
    }
    if (line.startsWith("> ")) {
      flushList();
      blocks.push(
        <div key={`note-${idx}`} className="manualNote">
          {renderInline(line.slice(2).trim(), `note-${idx}`)}
        </div>,
      );
      return;
    }
    flushList();
    blocks.push(
      <p key={`p-${idx}`} className="manualP">
        {renderInline(line, `p-${idx}`)}
      </p>,
    );
  });

  flushList();
  return blocks;
};

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
  const [openManual, setOpenManual] = useState(false);
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
          <button
            className={`custom-tab ${openManual ? "active" : ""}`}
            onClick={() => setOpenManual(true)}
          >
            📖 Manual
          </button>
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

      <Dialog
        visible={openManual}
        style={{ width: "70vw", maxWidth: 980 }}
        onHide={() => setOpenManual(false)}
        header={
          <div className="manualHeader">
            <div style={{ display: "flex", alignItems: "center" }}>
              <span className="manualTitle">Manual de Usuario</span>
              <span className="manualChip">Manual RNDC</span>
            </div>
            <Button
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => setOpenManual(false)}
              aria-label="Cerrar"
            />
          </div>
        }
        className="manualDialog"
      >
        <div className="manualBody">{renderManual(MANUAL_USUARIO)}</div>
      </Dialog>
    </div>
  );
}
