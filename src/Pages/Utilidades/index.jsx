import React, { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import RndcService from "../../Services/rndcApi";
import EstudioContenido from "../Rndc/Estudio";

/**
 * /utilidades — herramientas internas de Asegurar (sin enlaces públicos).
 * Login propio contra el backend (JWT); tras autenticar, valida que el usuario
 * tenga rol ADMIN y muestra el Estudio de Contenido (Instagram + Blog).
 */

const styles = `
  .util-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #0a2d6e 0%, #114a9e 55%, #1565c0 100%);
    padding: 24px;
  }
  .util-card {
    width: min(400px, 100%);
    background: #fff;
    border-radius: 18px;
    padding: 36px 32px;
    box-shadow: 0 24px 70px rgba(0,0,0,0.35);
  }
  .util-card h1 {
    font-size: 1.35rem;
    font-weight: 900;
    color: #0a2d6e;
    margin: 0 0 4px;
  }
  .util-card .sub {
    font-size: 0.85rem;
    color: #667;
    margin: 0 0 24px;
  }
  .util-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: #fff6d6;
    border: 1px solid #ffd54f;
    color: #8a6d00;
    border-radius: 999px;
    padding: 4px 14px;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    margin-bottom: 16px;
  }
  .util-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
  .util-field label { font-size: 0.82rem; font-weight: 700; color: #333; }
  .util-field .p-inputtext, .util-field .p-password { width: 100%; }
  .util-error {
    background: #fdecea;
    border: 1px solid #f5c6c3;
    color: #b3261e;
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 0.83rem;
    margin-bottom: 14px;
  }
`;

export default function Utilidades() {
  const [autenticado, setAutenticado] = useState(
    () => !!localStorage.getItem("rndc_token"),
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [ingresando, setIngresando] = useState(false);

  const ingresar = async (e) => {
    e?.preventDefault();
    if (!username.trim() || !password) {
      setError("Ingrese usuario y contraseña");
      return;
    }
    setIngresando(true);
    setError("");
    try {
      const r = await RndcService.login(username.trim(), password);
      if (!r.success) {
        setError(r.error || "Credenciales incorrectas");
        return;
      }
      // Solo ADMIN de la plataforma puede usar las utilidades
      if (!(r.roles || []).includes("ROLE_ADMIN")) {
        await RndcService.logout();
        setError("Esta sección es exclusiva del administrador de Asegurar.");
        return;
      }
      setAutenticado(true);
    } catch {
      setError("No fue posible conectar con el servidor");
    } finally {
      setIngresando(false);
    }
  };

  const salir = async () => {
    await RndcService.logout();
    setUsername("");
    setPassword("");
    setError("");
    setAutenticado(false);
  };

  if (autenticado) {
    return <EstudioContenido onSalir={salir} />;
  }

  return (
    <div className="util-page">
      <style>{styles}</style>
      <form className="util-card" onSubmit={ingresar}>
        <span className="util-badge">
          <i className="pi pi-lock" /> Uso interno
        </span>
        <h1>Utilidades Asegurar</h1>
        <p className="sub">Estudio de contenido: publicaciones y blog</p>

        {error && <div className="util-error">{error}</div>}

        <div className="util-field">
          <label htmlFor="util-user">Usuario</label>
          <InputText
            id="util-user"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoFocus
          />
        </div>
        <div className="util-field">
          <label htmlFor="util-pass">Contraseña</label>
          <Password
            id="util-pass"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            feedback={false}
            toggleMask
            inputStyle={{ width: "100%" }}
          />
        </div>

        <Button
          type="submit"
          label={ingresando ? "Ingresando…" : "Ingresar"}
          icon={ingresando ? "pi pi-spin pi-spinner" : "pi pi-sign-in"}
          disabled={ingresando}
          style={{ width: "100%" }}
        />
      </form>
    </div>
  );
}
