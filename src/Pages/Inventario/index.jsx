import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInventarioAuth } from "../../Context/InventarioAuthContext";
import { Icon } from "./components";
import "./inventario.css";

export default function InventarioLogin() {
  const { isInventarioAuth, loginInventario } = useInventarioAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState({ username: false, password: false });

  useEffect(() => {
    if (isInventarioAuth) navigate("/inventario/dashboard");
  }, [isInventarioAuth, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setTouched({ username: true, password: true });
    if (!username || !password) return;

    setLoading(true);
    const result = await loginInventario(username, password);
    if (result.success) {
      navigate("/inventario/dashboard");
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="inv-login-page">
      <div className="inv-login-card">
        <div className="inv-login-head">
          <div className="ico">{Icon.box}</div>
          <h1>Inventario GPS</h1>
          <p>Portal de gestión de equipos · Solo administradores</p>
        </div>

        <form className="inv-login-form" onSubmit={handleLogin}>
          <div className="inv-field">
            <label htmlFor="inv-username">Usuario</label>
            <input
              id="inv-username"
              type="text"
              className="inv-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, username: true }))}
              disabled={loading}
              placeholder="Ingrese su usuario"
              autoComplete="username"
            />
            {touched.username && !username && (
              <small className="err">Este campo es requerido</small>
            )}
          </div>

          <div className="inv-field">
            <label htmlFor="inv-password">Contraseña</label>
            <div className="inv-pwd-wrap">
              <input
                id="inv-password"
                type={showPwd ? "text" : "password"}
                className="inv-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                disabled={loading}
                placeholder="Ingrese su contraseña"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle"
                onClick={() => setShowPwd((s) => !s)}
                aria-label={showPwd ? "Ocultar" : "Mostrar"}
                tabIndex={-1}
              >
                {showPwd ? Icon.eyeOff : Icon.eye}
              </button>
            </div>
            {touched.password && !password && (
              <small className="err">Este campo es requerido</small>
            )}
          </div>

          {error && <div className="inv-login-error">{error}</div>}

          <button
            type="submit"
            className="inv-btn"
            disabled={loading || !username || !password}
            style={{ marginTop: 4 }}
          >
            {loading ? <span className="inv-spinner" /> : Icon.signIn}
            {loading ? "Verificando..." : "Ingresar"}
          </button>
        </form>

        <div className="inv-login-foot">Powered by Asegurar Ltda.</div>
      </div>
    </div>
  );
}
