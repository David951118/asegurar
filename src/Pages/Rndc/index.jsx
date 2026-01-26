import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Message } from "primereact/message";
import RndcService from "../../Services/rndcApi";
import BackgroundGradient from "../../Components/background";
import Title from "../../Components/title";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

export default function RndcPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/rndc/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await RndcService.login(username, password);

    if (result.success) {
      login(); // Updates global state
      navigate("/rndc/dashboard");
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <BackgroundGradient color1="#ffffff" color2="#f0f2f5">
      <div className="flex align-items-center justify-content-center min-vh-100 p-4">
        <div className="container" style={{ maxWidth: "450px" }}>
          <div className="text-center mb-5">
            <Title
              item={{ title: "Portal RNDC", level: "h1", color: "#333" }}
            />
            <p className="text-muted">Gestión y Monitoreo de Manifiestos</p>
          </div>

          <Card className="shadow-lg border-0" style={{ borderRadius: "1rem" }}>
            <div className="text-center mb-4">
              <h3 className="font-bold text-gray-700">Iniciar Sesión</h3>
              <small className="text-gray-500">
                Usa tus credenciales de Cellvi
              </small>
            </div>

            <form onSubmit={handleLogin} className="p-fluid">
              <div className="field mb-4">
                <span className="p-float-label">
                  <InputText
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-100 p-3"
                  />
                  <label htmlFor="username">Usuario</label>
                </span>
              </div>

              <div className="field mb-4">
                <span className="p-float-label">
                  <Password
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    feedback={false}
                    toggleMask
                    className="w-100"
                    inputClassName="w-100 p-3"
                  />
                  <label htmlFor="password">Contraseña</label>
                </span>
              </div>

              {error && (
                <Message
                  severity="error"
                  text={error}
                  className="w-100 mb-3"
                  style={{ justifyContent: "flex-start" }}
                />
              )}

              <Button
                label={loading ? "Verificando..." : "Ingresar"}
                icon={loading ? "pi pi-spin pi-spinner" : "pi pi-sign-in"}
                type="submit"
                disabled={loading}
                className="w-100 p-3 font-bold"
                style={{ background: "var(--primary-color)", border: "none" }}
              />
            </form>

            <div className="text-center mt-3">
              <small className="text-muted">Powered by Asegurar Ltda.</small>
            </div>
          </Card>
        </div>
      </div>
    </BackgroundGradient>
  );
}
