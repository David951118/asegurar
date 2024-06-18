import React, { useState } from "react";

const PSEForm = () => {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [validated, setValidated] = useState(false);
  const [placas, setPlacas] = useState([]);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState([]);

  const obtenerListaVehiculos = () => {
    if (usuario && clave) {
      fetch(
        `https://cellviapi.asegurar.com.co/cellvi/servicios_web/lista/${usuario}/${clave}`,
        {
          method: "GET",
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Contraseña incorrecta");
          }
          return response.json();
        })
        .then((data) => {
          setPlacas(data);
          setIsAuthenticated(true); // Cambiar el estado a autenticado
        })
        .catch((error) => {
          setError(error.message);
          console.error("Error al obtener la lista de placas:", error);
        });
    }
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      obtenerListaVehiculos();
    }
    setValidated(true);
  };

  const handleSubmidData = () => {
  };

  if (isAuthenticated) {
    return (
      <div className="container mt-5">
        <h3 className="text-center">Lista de Vehículos</h3>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Placa</th>
              <th>Selecciona mes</th>
              <th>Valor</th>
              <th>Pagar</th>
            </tr>
          </thead>
          <tbody>
            {placas.map((vehiculo) => (
              <tr key={vehiculo.placa}>
                <td>{vehiculo.placa}</td>
                <td>
                  <select className="form-select">
                    <option value="">Seleccionar</option>
                    <option value="pago1">Junio</option>
                    <option value="pago2">Julio</option>
                    <option value="pago2">Agosto</option>
                  </select>
                </td>
                <td>
                  <t>200.000</t>
                </td>
                <td>
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`check-${vehiculo.placa}`}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`check-${vehiculo.placa}`}
                    >
                      Seleccionar
                    </label>
                  </div>
                </td>
              </tr>
            ))}
            <tr>
              <td>Total</td>
              <td></td>
              <td>800.000</td>
              <td>
                <button className="btn btn-primary">PAGAR</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col">
          <div className="card">
            <div className="card-header">
              <p className="text-center h3">
                Acá puedes pagar en línea, tus saldos asociados al servicio de
                rastreo de tus vehiculos.
              </p>
            </div>
            <div className="card-body">
              <p className="h5">
                Ingresa tu usuario y clave de CELLVI aqui para validar tu
                identidad y comenzar el proceso de pago.
              </p>
              <form
                noValidate
                validated={validated.toString()}
                onSubmit={handleSubmit}
              >
                <div className="mb-3">
                  <label htmlFor="usuario" className="form-label">
                    Usuario
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="usuario"
                    required
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                  />
                  <div className="invalid-feedback">
                    Por favor, ingrese su usuario.
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="clave" className="form-label">
                    Clave
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="clave"
                    required
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                  />
                  <div className="invalid-feedback">
                    Por favor, ingrese su clave.
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">
                  Iniciar Sesión
                </button>
                {error && (
                  <div className="alert alert-danger mt-3">{error}</div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PSEForm;
