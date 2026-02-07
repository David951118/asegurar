import React, { useMemo, useState } from "react";
import watermark from "../../Assets/Marca de agua 2.jpg";
import BrochureStyles from "./BrochureStyles";

const SECTIONS = [
  { id: "resumen", title: "Resumen" },
  { id: "arquitectura", title: "Arquitectura" },
  { id: "flujos", title: "Flujos / Workers" },
  { id: "seguridad", title: "Seguridad" },
  { id: "rbac", title: "Roles y Accesos (RBAC)" },
  { id: "api", title: "API" },
  { id: "modelos", title: "Modelos (MongoDB)" },
  { id: "despliegue", title: "Despliegue" },
  { id: "ops", title: "Operación" },
];

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function highlight(text, q) {
  if (!q) return text;
  const parts = String(text).split(new RegExp(`(${q})`, "gi"));
  return parts.map((p, i) =>
    p.toLowerCase() === q.toLowerCase() ? (
      <mark key={i} className="brochure__mark">
        {p}
      </mark>
    ) : (
      <React.Fragment key={i}>{p}</React.Fragment>
    )
  );
}

function Note({ tone = "info", children }) {
  const map = {
    info: "brochure__note--info",
    ok: "brochure__note--ok",
    warn: "brochure__note--warn",
    bad: "brochure__note--bad",
  };
  return (
    <div className={`brochure__note ${map[tone] || map.info}`}>{children}</div>
  );
}

function CodeBlock({ children }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // Copiar manual. No pasa nada.
    }
  };

  return (
    <div className="brochure__codewrap">
      <pre className="brochure__code">{children}</pre>
      <button type="button" onClick={copy} className="brochure__copy">
        {copied ? "Copiado " : "Copiar"}
      </button>
    </div>
  );
}

function safeJsonParse(value) {
  if (!value || typeof value !== "string") return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function parseJwt(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const payload = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(parts[1].length / 4) * 4, "=");
    const decoded = atob(payload);
    return safeJsonParse(decoded);
  } catch {
    return null;
  }
}

function getRoleFromStorage() {
  if (typeof window === "undefined" || !window.localStorage) return null;

  const directKeys = ["role", "ROL", "userRole"];
  for (const key of directKeys) {
    const value = window.localStorage.getItem(key);
    if (value) return value;
  }

  const jsonKeys = ["user", "usuario", "session"];
  for (const key of jsonKeys) {
    const raw = window.localStorage.getItem(key);
    const obj = safeJsonParse(raw);
    if (!obj || typeof obj !== "object") continue;
    const roleValue = obj.role || obj.rol || obj.tipo;
    if (roleValue) return roleValue;
  }

  const tokenKeys = ["token", "access_token", "jwt"];
  for (const key of tokenKeys) {
    const token = window.localStorage.getItem(key);
    const payload = parseJwt(token);
    if (!payload || typeof payload !== "object") continue;
    const roleValue = payload.role || payload.rol || payload.tipo;
    if (roleValue) return roleValue;
  }

  return null;
}

export default function RndcBrochureTI() {
  const [q, setQ] = useState("");
  const query = useMemo(() => q.trim().toLowerCase(), [q]);
  const [role, setRole] = useState("cliente"); // default seguro
  const isAdmin = role === "admin" || role === "administrador";
  const visibleSections = useMemo(() => {
    if (isAdmin) return SECTIONS;
    const publicIds = new Set(["resumen", "api"]);
    return SECTIONS.filter((s) => publicIds.has(s.id));
  }, [isAdmin]);

  React.useEffect(() => {
    const r = getRoleFromStorage();
    if (r) setRole(String(r).toLowerCase());
  }, []);

  const setRoleValue = (value) => {
    setRole(value);
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem("role", value);
    }
  };

  return (
    <div className="brochure">
      <BrochureStyles watermark={watermark} />
      {/* Topbar */}
      <div className="brochure__topbar print-hidden">
        <div className="brochure__topbar-inner">
          <div className="brochure__topbar-row">
            <div className="brochure__title">
              RNDC / Cellvi - Brochure TI
              <span className="brochure__title-sub">
                Documento interno de operacion
              </span>
              <span className="brochure__role">
                {isAdmin ? "ADMIN" : "CLIENTE"}
              </span>
              <div className="brochure__role-switch">
                <button
                  type="button"
                  className={`brochure__role-btn ${
                    !isAdmin ? "brochure__role-btn--active" : ""
                  }`}
                  onClick={() => setRoleValue("cliente")}
                >
                  Cliente
                </button>
                <button
                  type="button"
                  className={`brochure__role-btn ${
                    isAdmin ? "brochure__role-btn--active" : ""
                  }`}
                  onClick={() => setRoleValue("admin")}
                >
                  Administrador
                </button>
              </div>
            </div>

            <div className="brochure__actions">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar (RMM, RNMM, PM2, Mongo, worker...)"
                className="brochure__search"
              />
              <button
                onClick={() => window.print()}
                type="button"
                className="brochure__print"
              >
                Imprimir / PDF
              </button>
            </div>
          </div>

          <div className="brochure__nav">
            {visibleSections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollToId(s.id)}
                className="brochure__chip"
                type="button"
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="brochure__main">
        {/* Resumen */}
        <section id="resumen" className="brochure__section brochure__hero">
          <div className="brochure__hero-row">
            <div>
              <p className="brochure__eyebrow">Operación &amp; Soporte</p>
              <h1 className="brochure__h1">RNDC Dashboard — Brochure TI</h1>
            </div>
            <div className="brochure__stats">
              <div className="brochure__stat brochure__stat--ok">
                <div className="brochure__stat-label">Estado</div>
                <div className="brochure__stat-value">Operativo</div>
              </div>
              <div className="brochure__stat brochure__stat--warn">
                <div className="brochure__stat-label">SLA</div>
                <div className="brochure__stat-value">24/7</div>
              </div>
            </div>
          </div>

          <div className="brochure__metrics">
            {[
              ["Sync manifiestos", "Cada 15 min"],
              ["Monitoreo GPS", "Cada 5 min"],
              ["Envío RMM", "Cada 3 min"],
              ["RNMM (novedades)", "Cada 1 h"],
            ].map(([t, v]) => (
              <div key={t} className="brochure__metric">
                <div className="brochure__metric-label">
                  {highlight(t, query)}
                </div>
                <div className="brochure__metric-value">
                  {highlight(v, query)}
                </div>
              </div>
            ))}
          </div>

          <div className="brochure__notes" />
        </section>

        {isAdmin && (

          <>

        {/* Arquitectura */}
        <section id="arquitectura" className="brochure__section">
          <div className="brochure__section-header">
            <h2 className="brochure__h2">Arquitectura general</h2>
            <span className="brochure__tag">BFF · Workers · Mongo</span>
          </div>
          <p className="brochure__text">
            BFF + Middleware entre Cellvi y RNDC con persistencia local y
            ejecución por workers.
          </p>

          <div className="brochure__grid">
            <div className="brochure__card">
              <h3 className="brochure__h3">Componentes</h3>
              <ul className="brochure__list">
                <li>
                  {highlight(
                    "Backend Node/Express: JWT, proxy RNDC, API REST, workers.",
                    query
                  )}
                </li>
                <li>
                  {highlight(
                    "MongoDB: manifiestos, RMM/RNMM, sesiones, logs.",
                    query
                  )}
                </li>
                <li>
                  {highlight(
                    "Workers: sync, monitoreo, reportes, novedades.",
                    query
                  )}
                </li>
              </ul>
            </div>
            <div className="brochure__card">
              <h3 className="brochure__h3">Resultado</h3>
              <ul className="brochure__list">
                <li>
                  {highlight(
                    "Menos llamadas directas al RNDC (operación sobre copia local).",
                    query
                  )}
                </li>
                <li>{highlight("Trazabilidad: pendiente / enviado / error.", query)}</li>
                <li>
                  {highlight(
                    "Permisos por vehículo para control de acceso.",
                    query
                  )}
                </li>
              </ul>
            </div>
          </div>
        </section>

          </>

        )}

        {isAdmin && (

          <>

        {/* Flujos */}
        <section id="flujos" className="brochure__section">
          <div className="brochure__section-header">
            <h2 className="brochure__h2">Flujos / Workers</h2>
            <span className="brochure__tag">Cron · Reintentos · XML</span>
          </div>

          <div className="brochure__stack">
            {[
              {
                title: "1) Sync Manifiestos",
                file: "syncManifiestos.js",
                bullets: [
                  "Frecuencia: cada 15 minutos.",
                  "Consulta RNDC (proceso 41) y guarda manifiestos activos.",
                  "Valida placa en Cellvi → monitoreable true/false.",
                ],
              },
              {
                title: "2) Monitoreo de Vehículos",
                file: "monitorVehiculos.js",
                bullets: [
                  "Frecuencia: cada 5 minutos.",
                  "Consulta GPS en Cellvi y calcula distancia (haversine).",
                  "Llegada < 500m crea RMM; salida > 1km actualiza RMM.",
                ],
              },
              {
                title: "3) Reporte RMM",
                file: "reportRMM.js",
                bullets: [
                  "Frecuencia: cada 3 minutos.",
                  "Genera XML RNDC (ID 45) y reintenta pendientes/error.",
                  "RNDC exige llegada+salida; si no hay salida real, se estima.",
                ],
              },
              {
                title: "4) Detección RNMM",
                file: "detectRNMM.js",
                bullets: [
                  "Frecuencia: cada 1 hora.",
                  "Código 1: no llegó 24h después de la cita.",
                  "Código 2: placa no existe en Cellvi.",
                  "Código 3: sin GPS por tiempo prolongado.",
                ],
              },
              {
                title: "5) Reporte RNMM",
                file: "reportRNMM.js",
                bullets: [
                  "Frecuencia: cada 15 minutos.",
                  "Ventana RNDC: 24h a 36h después de la cita (proceso 46).",
                ],
              },
            ].map((w) => (
              <div key={w.title} className="brochure__card">
                <h3 className="brochure__h3">
                  {highlight(w.title, query)}{" "}
                  <span className="brochure__mono">{w.file}</span>
                </h3>
                <ul className="brochure__list">
                  {w.bullets.map((b) => (
                    <li key={b}>{highlight(b, query)}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

          </>

        )}

        {isAdmin && (

          <>

        {/* Seguridad */}
        <section id="seguridad" className="brochure__section">
          <h2 className="brochure__h2">Seguridad</h2>
          <div className="brochure__stack">
            <div className="brochure__card">
              <h3 className="brochure__h3">Separación de tokens</h3>
              <ul className="brochure__list">
                <li>{highlight("Frontend→Backend: JWT (roles/vehículos).", query)}</li>
                <li>{highlight("Backend→Cellvi: token admin solo servidor.", query)}</li>
                <li>
                  {highlight(
                    "Backend→RNDC: credenciales en .env (solo servidor).",
                    query
                  )}
                </li>
              </ul>
            </div>
          </div>
        </section>

          </>

        )}

        {isAdmin && (

          <>

        {/* RBAC */}
        <section id="rbac" className="brochure__section">
          <div className="brochure__section-header">
            <h2 className="brochure__h2">Roles y Accesos (RBAC)</h2>
          </div>

          <div className="brochure__grid">
            <div className="brochure__card">
              <h3 className="brochure__h3">
                Validación de rol (Frontend + Backend)
              </h3>
              <ul className="brochure__list">
                <li>
                  {highlight(
                    "Backend emite JWT con rol + vehiculosPermitidos",
                    query
                  )}
                </li>
                <li>
                  {highlight(
                    "Frontend oculta UI pero seguridad real es backend",
                    query
                  )}
                </li>
                <li>
                  {highlight(
                    "Middleware requireAuth + requireRole('admin')",
                    query
                  )}
                </li>
                <li>
                  {highlight(
                    "Filtro por vehículo en /manifiestos backend",
                    query
                  )}
                </li>
                <li>
                  {highlight("Header Authorization: Bearer <jwt>", query)}
                </li>
              </ul>
            </div>

            <div className="brochure__card">
              <h3 className="brochure__h3">Rol: CLIENTE</h3>
              <ul className="brochure__list">
                <li>{highlight("ver manifiestos permitidos", query)}</li>
                <li>{highlight("no logs/stats/sesiones/workers", query)}</li>
                <li>{highlight("no borrar", query)}</li>
              </ul>
              <CodeBlock>{`GET /api/manifiestos
# filtrado por vehiculosPermitidos`}</CodeBlock>
            </div>

            <div className="brochure__card">
              <h3 className="brochure__h3">Rol: ADMIN</h3>
              <ul className="brochure__list">
                <li>{highlight("manifiestos", query)}</li>
                <li>{highlight("logs/stats", query)}</li>
                <li>{highlight("borrar (ideal con auditoría)", query)}</li>
              </ul>
              <CodeBlock>{`GET /api/logs
GET /api/logs/stats
DELETE /api/manifiestos/:id`}</CodeBlock>
            </div>
          </div>
        </section>

          </>

        )}

        {/* API */}
        <section id="api" className="brochure__section">
          <h2 className="brochure__h2">API (resumen)</h2>
          <p className="brochure__text">
            Base URL: <code className="brochure__inline-code">/api</code>
          </p>
          {isAdmin ? (
            <div className="brochure__grid">
              <div className="brochure__card">
                <h3 className="brochure__h3">Auth</h3>
                <ul className="brochure__list">
                  <li>
                    <code className="brochure__inline-code">POST /auth/login</code>
                  </li>
                  <li>
                    <code className="brochure__inline-code">POST /auth/refresh</code>
                  </li>
                  <li>
                    <code className="brochure__inline-code">POST /auth/logout</code>
                  </li>
                  <li>
                    <code className="brochure__inline-code">GET /auth/me</code>
                  </li>
                </ul>
              </div>
              <div className="brochure__card">
                <h3 className="brochure__h3">Manifiestos / Logs</h3>
                <ul className="brochure__list">
                  <li>
                    <code className="brochure__inline-code">GET /manifiestos</code>
                  </li>
                  <li>
                    <code className="brochure__inline-code">
                      DELETE /manifiestos/:id
                    </code>{" "}
                    (admin)
                  </li>
                  <li>
                    <code className="brochure__inline-code">GET /logs</code>
                  </li>
                  <li>
                    <code className="brochure__inline-code">GET /logs/stats</code>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="brochure__grid">
              <div className="brochure__card">
                <h3 className="brochure__h3">Manifiestos</h3>
                <ul className="brochure__list">
                  <li>
                    <code className="brochure__inline-code">GET /manifiestos</code>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </section>

        {isAdmin && (

          <>

        {/* Modelos */}
        <section id="modelos" className="brochure__section">
          <div className="brochure__section-header">
            <h2 className="brochure__h2">Modelos de Datos (MongoDB)</h2>
            <span className="brochure__tag">Persistencia · Auditoría · Colas</span>
          </div>

          <p className="brochure__text">
            MongoDB es el “libro mayor” operativo: copia local de manifiestos + colas de envío (RMM/RNMM) + sesiones/auditoría.
          </p>

          <div className="brochure__stack">
            <div className="brochure__card">
              <h3 className="brochure__h3">
                UserSession <span className="brochure__mono">(sesiones JWT)</span>
              </h3>
              <ul className="brochure__list">
                <li>{highlight("token: hash del token (no almacenar JWT plano).", query)}</li>
                <li>{highlight("vehiculosPermitidos: array de placas visibles por el usuario.", query)}</li>
                <li>{highlight("expiresAt: TTL index para auto-borrado.", query)}</li>
              </ul>
              <Note tone="ok">
                Objetivo: invalidación remota (logout) y control de vigencia real del token.
              </Note>
            </div>

            <div className="brochure__card">
              <h3 className="brochure__h3">
                Manifiesto <span className="brochure__mono">(verdad del viaje)</span>
              </h3>
              <ul className="brochure__list">
                <li>{highlight("placa + datos conductor/vehículo.", query)}</li>
                <li>{highlight("puntosControl[] con estados (llegó/salió/pendiente).", query)}</li>
                <li>{highlight("esMonitoreable: true/false según validación Cellvi.", query)}</li>
                <li>{highlight("motivoNoMonitoreable: razón si no se puede trackear.", query)}</li>
              </ul>
            </div>

            <div className="brochure__card">
              <h3 className="brochure__h3">
                RegistroRMM <span className="brochure__mono">(cola de reportes)</span>
              </h3>
              <ul className="brochure__list">
                <li>{highlight("estado: pendiente | enviado | error.", query)}</li>
                <li>{highlight("fechaLlegada + fechaSalida (RNDC exige ambos).", query)}</li>
                <li>{highlight("salidaEstimada: true si la salida fue calculada.", query)}</li>
              </ul>
              <Note tone="warn">
                Regla: si no hay salida real, se calcula salida estimada (Llegada + Tiempo pactado o 60 min).
              </Note>
            </div>

            <div className="brochure__card">
              <h3 className="brochure__h3">
                RegistroRNMM <span className="brochure__mono">(cola de novedades)</span>
              </h3>
              <ul className="brochure__list">
                <li>{highlight("codigoNovedad: 1-5 según manual RNDC.", query)}</li>
                <li>{highlight("fechaLimiteReporte: cita + 36h (deadline).", query)}</li>
                <li>{highlight("estado: pendiente | enviado | error.", query)}</li>
              </ul>
            </div>
          </div>
        </section>

          </>

        )}

        {isAdmin && (

          <>

        {/* Despliegue */}
        <section id="despliegue" className="brochure__section">
          <h2 className="brochure__h2">Despliegue (Rocky Linux)</h2>

          <Note tone="info">
            Usa placeholders:{" "}
            <code className="brochure__inline-code">[SERVER_IP]</code>,{" "}
            <code className="brochure__inline-code">[RUTA_PROYECTO]</code>,{" "}
            <code className="brochure__inline-code">[DB_USER]</code>,{" "}
            <code className="brochure__inline-code">[DB_PASS]</code>,{" "}
            <code className="brochure__inline-code">[DB_NAME]</code>.
          </Note>

          <div className="brochure__stack">
            <div className="brochure__card">
              <h3 className="brochure__h3">1) Conectar + actualizar</h3>
              <CodeBlock>{`ssh root@[SERVER_IP]

sudo dnf update -y
sudo dnf install -y wget curl git vim tar`}</CodeBlock>
            </div>

            <div className="brochure__card">
              <h3 className="brochure__h3">2) Instalar Node.js 18</h3>
              <CodeBlock>{`curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install -y nodejs

node --version
npm --version`}</CodeBlock>
            </div>

            <div className="brochure__card">
              <h3 className="brochure__h3">3) Instalar MongoDB 7</h3>
              <CodeBlock>{`sudo nano /etc/yum.repos.d/mongodb-org-7.0.repo

[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/8/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-7.0.asc

sudo dnf install -y mongodb-org
sudo systemctl enable mongod
sudo systemctl start mongod
sudo systemctl status mongod`}</CodeBlock>
            </div>

            <div className="brochure__card">
              <h3 className="brochure__h3">4) Crear usuario DB + habilitar auth</h3>
              <CodeBlock>{`mongosh

use admin
db.createUser({
  user: "[DB_USER]",
  pwd: "[DB_PASS]",
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" }
  ]
})
exit

sudo nano /etc/mongod.conf

security:
  authorization: enabled

sudo systemctl restart mongod
sudo systemctl status mongod`}</CodeBlock>
            </div>

            <div className="brochure__card">
              <h3 className="brochure__h3">5) Probar autenticaci?n MongoDB</h3>
              <CodeBlock>{`mongosh "mongodb://[DB_USER]:[DB_PASS]@localhost:27017/admin"
show dbs
exit`}</CodeBlock>
            </div>

            <div className="brochure__card">
              <h3 className="brochure__h3">6) Crear base de datos inicial</h3>
              <CodeBlock>{`mongosh "mongodb://[DB_USER]:[DB_PASS]@localhost:27017/admin"

use [DB_NAME]

db.createCollection("manifiestos")
db.createCollection("registrosrmm")
db.createCollection("registrosrnmm")
db.createCollection("logs")
db.createCollection("usersessions")

show collections
exit`}</CodeBlock>
            </div>

            <div className="brochure__card">
              <h3 className="brochure__h3">7) Crear directorio de proyecto</h3>
              <CodeBlock>{`sudo mkdir -p [RUTA_PROYECTO]
sudo chown $USER:$USER [RUTA_PROYECTO]
cd [RUTA_PROYECTO]`}</CodeBlock>
            </div>

            <div className="brochure__card">
              <h3 className="brochure__h3">8) Transferir backend</h3>
              <ul className="brochure__list">
                <li>
                  {highlight(
                    "Puedes usar Git o WinSCP. Si usas Git, el .env se crea manualmente en el servidor.",
                    query
                  )}
                </li>
              </ul>
              <CodeBlock>{`cd [RUTA_PROYECTO]

# Si llega como .tar.gz:
tar -xzf apirndc.tar.gz
mv apirndc backend
cd backend`}</CodeBlock>
            </div>

            <div className="brochure__card">
              <h3 className="brochure__h3">9) Configurar .env + dependencias</h3>
              <CodeBlock>{`cd [RUTA_PROYECTO]/backend
nano .env

npm install --production
mkdir -p logs`}</CodeBlock>
            </div>

            <div className="brochure__card">
              <h3 className="brochure__h3">10) Instalar PM2</h3>
              <CodeBlock>{`sudo npm install -g pm2
pm2 --version`}</CodeBlock>
            </div>

            <div className="brochure__card">
              <h3 className="brochure__h3">11) Probar conexi?n Mongo (desde Node)</h3>
              <CodeBlock>{`cd [RUTA_PROYECTO]/backend

node -e "const mongoose=require('mongoose'); const cfg=require('dotenv').config(); const uri=(cfg.parsed&&cfg.parsed.MONGODB_URI)||process.env.MONGODB_URI; mongoose.connect(uri).then(()=>console.log('? MongoDB OK')).catch(e=>console.log('? Error:', e.message));"`}</CodeBlock>
            </div>

            <div className="brochure__card">
              <h3 className="brochure__h3">12) Iniciar backend con PM2</h3>
              <CodeBlock>{`cd [RUTA_PROYECTO]/backend

pm2 start ecosystem.config.js
pm2 status
pm2 logs rndc-backend --lines 30`}</CodeBlock>
            </div>

            <div className="brochure__card">
              <h3 className="brochure__h3">13) Persistencia PM2 (auto-start)</h3>
              <CodeBlock>{`pm2 save
pm2 startup systemd
# Ejecuta el comando que PM2 te muestre`}</CodeBlock>
            </div>

            <div className="brochure__card">
              <h3 className="brochure__h3">14) Health check</h3>
              <CodeBlock>{`curl http://localhost:3000/health

# Esperado:
# {"status":"OK","mongodb":"connected",...}`}</CodeBlock>
            </div>

            <div className="brochure__card">
              <h3 className="brochure__h3">15) Verificar servicios</h3>
              <CodeBlock>{`pm2 status
sudo systemctl status mongod
sudo systemctl status nginx

pm2 logs rndc-backend`}</CodeBlock>
              <Note tone="info">
                Nginx aplica si est?s sirviendo el frontend desde el servidor (recomendado en producci?n).
              </Note>
            </div>

            <div className="brochure__card">
              <h3 className="brochure__h3">16) Backup autom?tico MongoDB</h3>
              <CodeBlock>{`nano /home/$USER/backup-mongo.sh

#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mongodb"
mkdir -p $BACKUP_DIR

mongodump --uri="mongodb://[DB_USER]:[DB_PASS]@localhost:27017/[DB_NAME]" --out="$BACKUP_DIR/backup-$DATE"

# Mantener ?ltimos 7 d?as
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} \; 2>/dev/null

chmod +x /home/$USER/backup-mongo.sh
/home/$USER/backup-mongo.sh

crontab -e
# Agregar:
0 2 * * * /home/$USER/backup-mongo.sh`}</CodeBlock>
            </div>

            <div className="brochure__card">
              <h3 className="brochure__h3">17) Troubleshooting (r?pido)</h3>
              <CodeBlock>{`# Backend no conecta a MongoDB:
mongosh "mongodb://[DB_USER]:[DB_PASS]@localhost:27017/admin"
pm2 logs rndc-backend --err

# MongoDB no inicia:
sudo systemctl status mongod
sudo journalctl -u mongod -n 50`}</CodeBlock>
            </div>

            <div className="brochure__card">
              <h3 className="brochure__h3">18) Comandos ?tiles</h3>
              <CodeBlock>{`# Reiniciar todo
pm2 restart all
sudo systemctl restart nginx mongod

# Estados
pm2 status
sudo systemctl status mongod nginx

# Logs
pm2 logs rndc-backend
sudo tail -f /var/log/nginx/error.log

# Backup manual
mongodump --uri="mongodb://[DB_USER]:[DB_PASS]@localhost:27017/[DB_NAME]" --out=/tmp/backup-manual`}</CodeBlock>
            </div>
          </div>

          <Note tone="ok">
            Checklist producci?n: MongoDB con auth ? ? PM2 con auto-start ? ? Health OK ? ? Backup diario ? ?{" "}
            <code className="brochure__inline-code">NODE_ENV=production</code> ?
          </Note>
        </section>

          </>

        )}

        {isAdmin && (

          <>

        {/* Operación */}
        <section id="ops" className="brochure__section">
          <h2 className="brochure__h2">Operación (Soporte)</h2>
          <ul className="brochure__list brochure__list--compact">
            <li>{highlight("Procesos: pm2 status", query)}</li>
            <li>{highlight("Logs: pm2 logs rndc-backend --lines 200", query)}</li>
            <li>
              {highlight(
                "Mongo: systemctl status mongod / journalctl -u mongod -n 100",
                query
              )}
            </li>
            <li>{highlight("Reinicio: pm2 restart all", query)}</li>
          </ul>

          <div />
        </section>

          </>

        )}

        <footer className="brochure__footer">© Asegurar · RNDC/Cellvi · Brochure TI</footer>
      </main>
    </div>
  );
}
