import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Message } from "primereact/message";
import RndcService from "../../Services/rndcApi";
import DashboardRndc from "./Dashboard"; // Componente que crearemos a continuación
import BackgroundGradient from "../../Components/background";
import Title from "../../Components/title";

export default function RndcPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userVehiculos, setUserVehiculos] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [roles, setRoles] = useState([]);
  const [persona, setPersona] = useState("");

  // Verificar si hay sesión activa al cargar
  useEffect(() => {
    const storedUser = localStorage.getItem("rndc_user");
    const storedVehiculos = localStorage.getItem("rndc_vehiculos");
    const storedRoles = localStorage.getItem("rndc_roles");
    const storedPersona = localStorage.getItem("rndc_persona");

    if (storedUser) {
      setCurrentUser(storedUser);
      setUserVehiculos(JSON.parse(storedVehiculos || "[]"));
      setRoles(JSON.parse(storedRoles || "[]"));
      setPersona(storedPersona || storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await RndcService.login(username, password);

    if (result.success) {
      // Guardar sesión
      localStorage.setItem("rndc_token", result.token);
      localStorage.setItem("rndc_user", result.username);
      localStorage.setItem("rndc_vehiculos", JSON.stringify(result.vehiculos));
      localStorage.setItem("rndc_roles", JSON.stringify(result.roles || []));
      localStorage.setItem("rndc_persona", result.persona);

      setCurrentUser(result.username);
      setUserVehiculos(result.vehiculos);
      setRoles(result.roles || []);
      setPersona(result.persona);
      setIsAuthenticated(true);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("rndc_token");
    localStorage.removeItem("rndc_user");
    localStorage.removeItem("rndc_vehiculos");
    localStorage.removeItem("rndc_roles");
    localStorage.removeItem("rndc_persona");
    setIsAuthenticated(false);
    setUserVehiculos([]);
    setRoles([]);
    setPersona("");
    setCurrentUser("");
  };

  // Si está autenticado, mostramos el Dashboard
  if (isAuthenticated) {
    return (
      <DashboardRndc
        username={persona} // Usamos persona como nombre a mostrar
        vehiculos={userVehiculos}
        roles={roles}
        onLogout={handleLogout}
      />
    );
  }

  // Si no, mostramos el Login
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
