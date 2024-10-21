import React, { useState } from "react";
import { Link } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recordarUsuario, setRecordarUsuario] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Estado para el mensaje de error

  const handleLogin = async () => {
    setErrorMessage(""); // Limpiar el mensaje de error antes de cada intento

    try {
      const response = await fetch("http://localhost:4000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Autenticación exitosa:", data);

        // Guarda el token JWT en localStorage
        localStorage.setItem("token", data.token);

        // Redirigir al dashboard
        window.location.href = "/admin";
      } else if (response.status === 401) {
        // Si el servidor responde con un 401, mostramos un mensaje de error
        setErrorMessage("Usuario o contraseña incorrectos.");
      } else {
        console.error("Error en la autenticación, código:", response.status);
        setErrorMessage("Error en la autenticación.");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Hubo un error con la solicitud.");
    }
  };

  return (
    <div className="container mt-5 p-3">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Bienvenido</h2>
              <h2 className="card-title text-center mb-4">
                Portal de administración ASEGURAR LTDA
              </h2>
              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}
              <form>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Ingrese su email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Clave:</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Ingrese su clave"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="recordarUsuario"
                    checked={recordarUsuario}
                    onChange={() => setRecordarUsuario(!recordarUsuario)}
                  />
                  <label className="form-check-label" htmlFor="recordarUsuario">
                    Recordar usuario
                  </label>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={handleLogin}
                >
                  Iniciar sesión
                </button>
              </form>
              <div className="text-center mt-3">
                <Link to="/recuperar-contrasena">¿Olvidó su clave?</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
