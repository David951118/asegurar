import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false); // Para controlar si el cambio fue exitoso
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validar que las contraseñas sean iguales y cumplan los requisitos de seguridad
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    // Aquí se puede validar la seguridad de la contraseña
    const passwordRequirements = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/;
    if (!passwordRequirements.test(password)) {
      setError(
        "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial."
      );
      return;
    }

    // Lógica para enviar la petición al backend
    try {
      const tokena = new URLSearchParams(window.location.search).get("token");
      console.log(tokena);
      const response = await fetch(
        "http://localhost:4000/api/v1/auth/change-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: new URLSearchParams(window.location.search).get("token"),
            newPassword: password,
          }),
        }
      );

      if (response.ok) {
        setSuccess(true); // Contraseña cambiada con éxito
      } else {
        setError("Error al cambiar la contraseña");
      }
    } catch (error) {
      setError("Error en la petición");
    }
  };

  return (
    <div>
      <h2>Cambiar Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <label>Nueva Contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>Confirmar Contraseña:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Cambiar Contraseña</button>
      </form>

      {success && (
        <div>
          <p>Contraseña cambiada exitosamente</p>
          <button onClick={() => navigate("/admin-login")}>
            Ir a Iniciar Sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default ChangePassword;
