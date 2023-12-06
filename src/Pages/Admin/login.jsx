import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminLogin = () => {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [recordarUsuario, setRecordarUsuario] = useState(false);

  const handleLogin = () => {
    // Aquí puedes realizar la lógica de autenticación
    console.log('Iniciar sesión con:', { usuario, clave, recordarUsuario });
  };

  return (
    <div className="container mt-5 p-3">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Bienvenido</h2>
              <h2 className="card-title text-center mb-4">Portal de administracion asegurar</h2>
              <form>
                <div className="form-group">
                  <label htmlFor="usuario">Usuario:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="usuario"
                    placeholder="Ingrese su usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="clave">Clave:</label>
                  <input
                    type="password"
                    className="form-control"
                    id="clave"
                    placeholder="Ingrese su clave"
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
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
                <button type="button" className="btn btn-primary btn-block" onClick={handleLogin}>
                  Iniciar sesión
                </button>
              </form>
              <div className="text-center mt-3">
                <Link to="/recuperar-clave">¿Olvidó su clave?</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
