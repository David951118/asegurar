import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { useNavigate } from "react-router-dom";
import { useInventarioAuth } from "../../Context/InventarioAuthContext";

const styles = `
  .inv-login-page {
    min-height: 100vh;
    width: 100%;
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .inv-login-overlay {
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(90deg, rgba(0,0,0,0.45) 45%, rgba(10,45,110,0.25) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .inv-login-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    max-width: 1200px;
    gap: 60px;
    padding: 40px;
    align-items: center;
    justify-items: center;
  }
  .inv-form-container {
    width: 100%;
    max-width: 420px;
    animation: invSlideIn 0.7s ease-out;
  }
  .inv-card {
    background: rgba(255,255,255,0.99);
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.28);
    width: 100%;
  }
  .inv-card-header {
    background: linear-gradient(135deg, #0a2d6e 0%, #1565c0 100%);
    padding: 28px 24px;
    text-align: center;
  }
  .inv-card-icon {
    width: 64px;
    height: 64px;
    background: rgba(255,255,255,0.15);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 14px;
    font-size: 1.8rem;
    color: #ffd54f;
  }
  .inv-title {
    margin: 0 0 6px 0;
    font-size: 1.7rem;
    font-weight: 900;
    color: #fff;
  }
  .inv-subtitle {
    margin: 0;
    font-size: 0.9rem;
    color: rgba(255,255,255,0.75);
    font-weight: 500;
  }
  .inv-form-wrapper {
    padding: 28px 24px;
  }
  .inv-form-header {
    text-align: center;
    margin-bottom: 24px;
  }
  .inv-form-header h2 {
    margin: 0 0 6px 0;
    font-size: 1.2rem;
    font-weight: 800;
    color: #333;
  }
  .inv-form-header p {
    margin: 0;
    font-size: 0.88rem;
    color: #888;
  }
  .inv-form { display: flex; flex-direction: column; gap: 18px; }
  .inv-field { position: relative; width: 100%; }
  .inv-top-label {
    display: block;
    margin: 0 0 8px 0;
    font-weight: 700;
    color: #5b6676;
    font-size: 0.9rem;
  }
  .inv-pill {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
  }
  .inv-ic-left {
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    color: #1565c0;
    font-size: 1.1rem;
    z-index: 10;
    pointer-events: none;
  }
  .inv-pill .p-inputtext,
  .inv-pill .p-password .p-password-input {
    width: 100% !important;
    height: 48px !important;
    border-radius: 999px !important;
    border: 2.5px solid #1565c0 !important;
    font-size: 1rem !important;
    font-weight: 600 !important;
    color: #2b3440 !important;
    background: #fff !important;
    box-sizing: border-box !important;
    transition: all 0.3s ease !important;
    padding-left: 50px !important;
  }
  .inv-pill .p-inputtext:focus,
  .inv-pill .p-password .p-password-input:focus {
    box-shadow: 0 0 0 5px rgba(21,101,192,0.14) !important;
  }
  .inv-pill .p-password { width: 100% !important; display: block !important; position: relative !important; }
  .inv-pill .p-password .p-password-input { padding-right: 64px !important; }
  .inv-pill .p-password .p-password-toggle,
  .inv-pill .p-password .p-password-toggle-mask {
    position: absolute !important;
    right: 18px !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    width: 42px !important;
    height: 42px !important;
    border-radius: 999px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    cursor: pointer !important;
    z-index: 30 !important;
    color: #1565c0 !important;
  }
  .inv-pill .p-password .p-icon { width: 16px !important; height: 16px !important; color: #1565c0 !important; fill: #1565c0 !important; }
  .p-password-panel { display: none !important; }
  .inv-field-error {
    margin-top: 8px;
    display: inline-block;
    padding: 8px 12px;
    border-radius: 8px;
    background: #ffd9d9;
    color: #b42323;
    font-weight: 700;
    font-size: 0.82rem;
  }
  .inv-error-message {
    border-left: 5px solid #ef4444 !important;
    background: #fee2e2 !important;
    color: #991b1b !important;
    padding: 12px 16px !important;
    border-radius: 10px !important;
    font-weight: 600 !important;
  }
  .inv-btn-submit {
    padding: 15px 24px !important;
    font-size: 1rem !important;
    font-weight: 900 !important;
    border-radius: 1rem !important;
    background: linear-gradient(135deg, #0a2d6e 0%, #1565c0 100%) !important;
    border: none !important;
    color: white !important;
    text-transform: uppercase !important;
    letter-spacing: 1px !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 10px 26px rgba(21,101,192,0.25) !important;
    cursor: pointer !important;
    min-height: 48px !important;
    margin-top: 10px !important;
    width: 100% !important;
  }
  .inv-btn-submit:hover:not(:disabled) {
    transform: translateY(-2px) !important;
    box-shadow: 0 14px 34px rgba(21,101,192,0.35) !important;
  }
  .inv-btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
  .inv-card-footer {
    background: #f8fafc;
    padding: 18px;
    text-align: center;
    border-top: 1px solid #e8eef5;
    font-size: 0.85rem;
    color: #888;
  }
  .inv-welcome {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
    text-align: center;
    animation: invSlideRight 0.7s ease-out;
  }
  .inv-welcome h2 {
    font-size: 2.2rem;
    font-weight: 900;
    margin-bottom: 16px;
    line-height: 1.2;
  }
  .inv-welcome p {
    font-size: 1.05rem;
    color: rgba(255,255,255,0.8);
    max-width: 380px;
    line-height: 1.7;
  }
  .inv-feature {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 14px;
    background: rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 10px 16px;
    font-size: 0.9rem;
    color: rgba(255,255,255,0.9);
  }
  .inv-feature i { color: #ffd54f; }
  @keyframes invSlideIn {
    from { opacity: 0; transform: translateX(-60px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes invSlideRight {
    from { opacity: 0; transform: translateX(60px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @media (max-width: 900px) {
    .inv-login-wrapper { grid-template-columns: 1fr; }
    .inv-welcome { display: none; }
  }
  @media (max-width: 480px) {
    .inv-login-wrapper { padding: 20px; }
    .inv-card { max-width: 100%; }
  }
`;

export default function InventarioLogin() {
  const { isInventarioAuth, loginInventario } = useInventarioAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState({ username: false, password: false });

  const usernameRequired = touched.username && !username;
  const passwordRequired = touched.password && !password;

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
    <>
      <style>{styles}</style>
      <div className="inv-login-page" style={{ backgroundImage: "url(/fondo.png)" }}>
        <div className="inv-login-overlay">
          <div className="inv-login-wrapper">
            {/* Formulario */}
            <div className="inv-form-container">
              <div className="inv-card">
                <div className="inv-card-header">
                  <div className="inv-card-icon">
                    <i className="pi pi-box" />
                  </div>
                  <h1 className="inv-title">Inventario GPS</h1>
                  <p className="inv-subtitle">Portal de gestión de equipos</p>
                </div>

                <div className="inv-form-wrapper">
                  <div className="inv-form-header">
                    <h2>Iniciar Sesión</h2>
                    <p>Solo acceso para administradores</p>
                  </div>

                  <form onSubmit={handleLogin} className="inv-form">
                    <div className="inv-field">
                      <label className="inv-top-label" htmlFor="inv-username">
                        Usuario
                      </label>
                      <div className="inv-pill">
                        <i className="pi pi-user inv-ic-left" />
                        <InputText
                          id="inv-username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          disabled={loading}
                          placeholder="Ingrese su usuario"
                          onBlur={() => setTouched((t) => ({ ...t, username: true }))}
                        />
                      </div>
                      {usernameRequired && (
                        <div className="inv-field-error">Este campo es requerido</div>
                      )}
                    </div>

                    <div className="inv-field">
                      <label className="inv-top-label" htmlFor="inv-password">
                        Contraseña
                      </label>
                      <div className="inv-pill">
                        <i className="pi pi-lock inv-ic-left" />
                        <Password
                          id="inv-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          feedback={false}
                          toggleMask
                          disabled={loading}
                          placeholder="Ingrese su contraseña"
                          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                          style={{ width: "100%" }}
                        />
                      </div>
                      {passwordRequired && (
                        <div className="inv-field-error">Este campo es requerido</div>
                      )}
                    </div>

                    {error && (
                      <Message
                        severity="error"
                        text={error}
                        className="inv-error-message"
                      />
                    )}

                    <Button
                      label={loading ? "Verificando..." : "Ingresar"}
                      icon={loading ? "pi pi-spin pi-spinner" : "pi pi-sign-in"}
                      type="submit"
                      disabled={loading || !username || !password}
                      className="inv-btn-submit"
                    />
                  </form>
                </div>

                <div className="inv-card-footer">
                  Powered by Asegurar Ltda. &nbsp;|&nbsp; Solo usuarios ROLE_ADMIN
                </div>
              </div>
            </div>

            {/* Panel derecho decorativo */}
            <div className="inv-welcome">
              <h2>Gestión de Equipos GPS</h2>
              <p>
                Administre el inventario completo de dispositivos GPS de su
                flota: marcas, seriales, IMEI y estados en tiempo real.
              </p>
              <div className="inv-feature">
                <i className="pi pi-check-circle" />
                Control de marcas: Teltonika, Coban, Queclink y más
              </div>
              <div className="inv-feature">
                <i className="pi pi-check-circle" />
                Registro por IMEI, serial y consecutivo
              </div>
              <div className="inv-feature">
                <i className="pi pi-check-circle" />
                Estado: Disponible, Instalado, En reparación, Baja
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
