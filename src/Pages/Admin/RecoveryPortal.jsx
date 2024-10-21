import React, { useState } from "react";

export default function RecoveryPortal() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleRecovery = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/v1/auth/recovery",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        setMessage("Se ha enviado un enlace de recuperación a tu correo.");
      } else {
        setMessage("Error al enviar el enlace de recuperación.");
      }
    } catch (error) {
      setMessage("Hubo un error con la solicitud.");
    }
  };

  return (
    <div className="container mt-5 p-3 text-center">
      <div className="col-md-6">
        <h2>Recuperar contraseña</h2>
        {message && <div className="alert alert-info">{message}</div>}
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Escribe tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button className="btn btn-primary mt-3" onClick={handleRecovery}>
          Enviar enlace de recuperación
        </button>
      </div>
    </div>
  );
}
