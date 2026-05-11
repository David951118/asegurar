import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useInventarioAuth } from "../../Context/InventarioAuthContext";
import { Icon, ToastProvider } from "./components";
import "./inventario.css";

const NAV = [
  { to: "/inventario/dashboard", label: "Dashboard", icon: Icon.grid, end: true },
  { to: "/inventario/equipos", label: "Equipos", icon: Icon.box, end: true },
  { to: "/inventario/equipos/inventario-central", label: "Inventario central", icon: Icon.box },
  { to: "/inventario/equipos/traslado", label: "Traslado de equipos", icon: Icon.refresh },
  { to: "/inventario/actividades", label: "Actividades", icon: Icon.list, end: true },
  { to: "/inventario/catalogos/marcas-modelos", label: "Marcas y modelos", icon: Icon.list },
  { to: "/inventario/catalogos/ciudades", label: "Ciudades", icon: Icon.list },
  { to: "/inventario/catalogos/tecnicos", label: "Técnicos", icon: Icon.user },
  { to: "/inventario/reportes/general", label: "Reporte general", icon: Icon.grid },
  { to: "/inventario/reportes/movimientos", label: "Movimientos", icon: Icon.refresh },
  { to: "/inventario/reportes/inventario-por-ciudad", label: "Inv. por ciudad", icon: Icon.grid },
  { to: "/inventario/devueltos", label: "Devueltos al cliente", icon: Icon.undo },
  { to: "/inventario/papelera", label: "Papelera", icon: Icon.trash },
];

export default function InventarioLayout({ title, subtitle, children }) {
  const { isInventarioAuth, logoutInventario } = useInventarioAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  useEffect(() => {
    if (!isInventarioAuth) {
      navigate("/inventario", { replace: true });
      return;
    }
    try {
      setUser(JSON.parse(localStorage.getItem("inv_user") || "{}"));
    } catch {
      setUser({});
    }
  }, [isInventarioAuth, navigate]);

  if (!isInventarioAuth) return null;

  const display = user.persona || user.username || "Admin";
  const initial = (display[0] || "A").toUpperCase();

  const handleLogout = () => {
    logoutInventario();
    navigate("/inventario", { replace: true });
  };

  return (
    <ToastProvider>
      <div className="inv-layout">
        <aside className="inv-sidebar">
          <div className="inv-brand">
            <h3>Inventario GPS</h3>
            <small>Asegurar Ltda.</small>
          </div>

          <nav className="inv-nav">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="inv-sidebar-footer">
            <div className="inv-user-row">
              <div className="avatar">{initial}</div>
              <div className="info">
                <b>{display}</b>
                <small>ROLE_ADMIN</small>
              </div>
            </div>
            <button
              className="inv-btn inv-btn-outline"
              style={{ width: "100%" }}
              onClick={handleLogout}
            >
              {Icon.signOut}
              Cerrar sesión
            </button>
          </div>
        </aside>

        <main className="inv-main">
          <header className="inv-topbar">
            <div>
              <h1>{title}</h1>
              {subtitle && <p>{subtitle}</p>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-muted)", fontSize: "0.85rem" }}>
              <span style={{ width: 16, height: 16, display: "inline-flex" }}>{Icon.user}</span>
              <span>Hola, <strong style={{ color: "var(--text-primary)" }}>{display.split(" ")[0]}</strong></span>
            </div>
          </header>
          <div className="inv-content">{children}</div>
        </main>
      </div>
    </ToastProvider>
  );
}
