import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import RndcService from "../../Services/rndcApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";


const styles = `
  .rndc-login-page {
    min-height: 100vh;
    height: 100vh;
    width: 100%;
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .rndc-login-overlay {
    width: 100%;
    height: 100%;
    min-height: 100vh;
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.35) 45%,
      rgba(0, 51, 102, 0.2) 100%
    );
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .rndc-login-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    max-width: 1400px;
    gap: 60px;
    padding: 40px;
    align-items: center;
    justify-items: center;
  }

  .rndc-login-form-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 420px; /* tamaño estilo CELLVI */
    z-index: 10;
    animation: slideInLeft 0.7s ease-out;
  }

  .rndc-card {
    background: rgba(255, 255, 255, 0.98);
    border-radius: 25px;
    padding: 0;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
    width: 100%;
    overflow: hidden;
  }

  .rndc-card-header {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5fb 100%);
    padding: 24px 24px; /* compacto */
    text-align: center;
    border-bottom: none;
    position: relative;
  }

  .rndc-title {
    margin: 0 0 12px 0;
    font-size: 2rem; /* compacto */
    font-weight: 900;
    color: #0066cc;
    letter-spacing: 0.5px;
  }

  .rndc-subtitle {
    margin: 0;
    font-size: 0.95rem;
    color: #666;
    font-weight: 500;
  }

  .rndc-form-wrapper {
    padding: 24px 24px; /* compacto */
  }

  .rndc-form-header {
    text-align: center;
    margin-bottom: 22px;
  }

  .rndc-form-header h2 {
    margin: 0 0 8px 0;
    font-size: 1.35rem; /* compacto */
    font-weight: 800;
    color: #333;
  }

  .rndc-form-header p {
    margin: 0;
    font-size: 0.95rem;
    color: #666;
    font-weight: 500;
  }

  .rndc-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .rndc-field {
    position: relative;
    width: 100%;
  }

  .rndc-top-label {
    display: block;
    margin: 0 0 10px 0;
    font-weight: 700;
    color: #5b6676;
    font-size: 0.95rem;
  }

  .rndc-pill {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
  }

  .rndc-ic-left {
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    color: #0066cc;
    font-size: 1.2rem;
    z-index: 10;
    pointer-events: none;
  }

  /* Unificación: InputText + Password input */
  .rndc-pill .p-inputtext,
  .rndc-pill .p-password .p-password-input {
    width: 100% !important;
    height: 48px !important; /* compacto */
    border-radius: 999px !important;
    border: 2.5px solid #0066cc !important;
    font-size: 1rem !important;
    font-weight: 600 !important;
    color: #2b3440 !important;
    background: #ffffff !important;
    box-sizing: border-box !important;
    transition: all 0.35s ease !important;
    padding-left: 50px !important; /* espacio icono izquierdo */
  }

  .rndc-pill .p-inputtext:focus,
  .rndc-pill .p-password .p-password-input:focus {
    box-shadow: 0 0 0 5px rgba(0, 102, 204, 0.14) !important;
    transform: translateY(-2px) !important;
  }

  .rndc-pill .p-password {
    width: 100% !important;
    display: block !important;
    position: relative !important;
  }

  /* espacio para el ojo (toggle) */
  .rndc-pill .p-password .p-password-input {
    padding-right: 64px !important;
  }

  /* toggle centrado */
  .rndc-pill .p-password .p-password-toggle,
  .rndc-pill .p-password .p-password-toggle-mask {
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
  }

  .rndc-pill .p-password .p-password-toggle:hover,
  .rndc-pill .p-password .p-password-toggle-mask:hover {
    background: rgba(0, 102, 204, 0.08) !important;
  }

  .p-password-panel {
    display: none !important;
  }

  .rndc-field-error {
    margin-top: 10px;
    display: inline-block;
    padding: 10px 14px;
    border-radius: 8px;
    background: #ffd9d9;
    color: #b42323;
    font-weight: 700;
    font-size: 0.85rem;
    border: 1px solid rgba(180, 35, 35, 0.25);
  }

  .rndc-error-message {
    border-left: 5px solid #ef4444 !important;
    background: #fee2e2 !important;
    color: #991b1b !important;
    padding: 14px 18px !important;
    border-radius: 10px !important;
    font-weight: 600 !important;
    margin: 0 !important;
  }

  .rndc-btn-submit {
    padding: 16px 24px !important;
    font-size: 1.05rem !important;
    font-weight: 900 !important;
    border-radius: 1rem !important;
    background: linear-gradient(135deg, #2b6ea0 0%, #215f8b 100%) !important;
    border: none !important;
    color: white !important;
    text-transform: uppercase !important;
    letter-spacing: 1px !important;
    transition: all 0.4s ease !important;
    box-shadow: 0 10px 26px rgba(0, 102, 204, 0.25) !important;
    cursor: pointer !important;
    min-height: 48px !important;
    margin-top: 12px !important;
    width: 100% !important;
  }

  .rndc-btn-submit:hover:not(:disabled) {
    transform: translateY(-3px) !important;
    box-shadow: 0 14px 34px rgba(0, 102, 204, 0.35) !important;
  }

  .rndc-btn-submit:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .rndc-footer {
    background: #f8fafc;
    padding: 20px;
    text-align: center;
    border-top: 1px solid #e8eef5;
  }

  .rndc-footer-text {
    margin: 0;
    font-size: 0.9rem;
    color: #666;
    font-weight: 500;
  }

  .rndc-welcome-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 5;
    animation: slideInRight 0.7s ease-out;
  }

  .rndc-logo-decoration {
    width: 200px;
    height: 200px;
    filter: drop-shadow(0 4px 30px rgba(255, 193, 7, 0.5));
    object-fit: contain;
  }

  
.rndc-pill .p-password {
  position: relative !important;
}


.rndc-pill .p-password .p-password-toggle,
.rndc-pill .p-password .p-password-toggle-mask {
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

  color: #0066cc !important; /* AZUL */
}


.rndc-pill .p-password .p-password-toggle svg,
.rndc-pill .p-password .p-password-toggle-mask svg,
.rndc-pill .p-password .p-icon.p-password-show-icon,
.rndc-pill .p-password .p-icon.p-password-hide-icon {
  width: 16px !important;
  height: 16px !important;
  display: block !important;

  color: #0066cc !important;
  fill: #0066cc !important;
  stroke: #0066cc !important;

  transform: translateY(1px) !important; /* ajuste fino visual */
}


.rndc-pill .p-password .p-password-toggle:hover,
.rndc-pill .p-password .p-password-toggle-mask:hover {
  background: rgba(0, 102, 204, 0.08) !important;
}


.rndc-pill .p-password .p-password-input {
  padding-right: 64px !important;
}

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-80px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(80px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @media (max-width: 1024px) {
    .rndc-login-wrapper {
      grid-template-columns: 1fr;
    }
    .rndc-welcome-container {
      display: none;
    }
    .rndc-card {
      max-width: 450px;
    }
  }

  @media (max-width: 768px) {
    .rndc-login-wrapper {
      padding: 20px;
    }
    .rndc-card {
      max-width: 100%;
    }
    .rndc-form {
      gap: 16px;
    }
  }
`;

export default function RndcPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [touched, setTouched] = useState({ username: false, password: false });
  const usernameRequired = touched.username && !username;
  const passwordRequired = touched.password && !password;

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/rndc/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    setTouched({ username: true, password: true });
    if (!username || !password) return;

    setLoading(true);
    const result = await RndcService.login(username, password);

    if (result.success) {
      login();
      navigate("/rndc/dashboard");
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <>
      <style>{styles}</style>

      <div
        className="rndc-login-page"
        style={{ backgroundImage: "url(/fondo.png)" }}
      >
        <div className="rndc-login-overlay">
          <div className="rndc-login-wrapper">
            <div className="rndc-login-form-container">
              <div className="rndc-card">
                <div className="rndc-card-header">
                  <h1 className="rndc-title">Portal RNDC</h1>
                  <p className="rndc-subtitle">
                    Gestión y Monitoreo de Manifiestos
                  </p>
                </div>

                <div className="rndc-form-wrapper">
                  <div className="rndc-form-header">
                    <h2>Iniciar Sesión</h2>
                    <p>Usa tus credenciales de Cellvi</p>
                  </div>

                  <form onSubmit={handleLogin} className="rndc-form">
                    <div className="rndc-field">
                      <label className="rndc-top-label" htmlFor="username">
                        Usuario
                      </label>

                      <div className="rndc-pill">
                        <i className="pi pi-user rndc-ic-left" />
                        <InputText
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          disabled={loading}
                          placeholder="Ingrese su usuario"
                          onBlur={() =>
                            setTouched((t) => ({ ...t, username: true }))
                          }
                        />
                      </div>

                      {usernameRequired && (
                        <div className="rndc-field-error">
                          Este campo es requerido
                        </div>
                      )}
                    </div>

                    <div className="rndc-field">
                      <label className="rndc-top-label" htmlFor="password">
                        Contraseña
                      </label>

                      <div className="rndc-pill">
                        <i className="pi pi-lock rndc-ic-left" />

                        <Password
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          feedback={false}
                          toggleMask
                          disabled={loading}
                          placeholder="Ingrese su contraseña"
                          onBlur={() =>
                            setTouched((t) => ({ ...t, password: true }))
                          }
                          style={{ width: "100%" }}
                        />
                      </div>

                      {passwordRequired && (
                        <div className="rndc-field-error">
                          Este campo es requerido
                        </div>
                      )}
                    </div>

                    {error && (
                      <Message
                        severity="error"
                        text={error}
                        className="rndc-error-message"
                      />
                    )}

                    <Button
                      label={loading ? "Verificando..." : "Ingresar"}
                      icon={loading ? "pi pi-spin pi-spinner" : "pi pi-sign-in"}
                      type="submit"
                      disabled={loading || !username || !password}
                      className="rndc-btn-submit"
                    />
                  </form>
                </div>

                <div className="rndc-footer">
                  <p className="rndc-footer-text">Powered by Asegurar Ltda.</p>
                </div>
              </div>
            </div>

            <div className="rndc-welcome-container">
              <img
                src="/letraa.png"
                alt="Logo"
                className="rndc-logo-decoration"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}