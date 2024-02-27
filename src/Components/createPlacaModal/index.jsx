import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreatePlacaModal = ({
  showModal,
  handleCloseModal,
  handleCreatePlaca,
  users,
}) => {
  console.log(users);
  const [placa, setPlaca] = useState("");
  const [user, setUser] = useState("");
  const [tipo, setTipo] = useState("");
  const [plan, setPlan] = useState("");
  const [finPlan, setFinPlan] = useState();
  const [fechaPago, setFechaPago] = useState();
  const [estado, setEstado] = useState();

  const tipoVehiculo = [
    { id: 0, titulo: "Vehiculo de carga" },
    { id: 1, titulo: "Vehiculo de transporte" },
    { id: 2, titulo: "Maquinaria Amarilla" },
  ];

  const tipoPlan = [
    { id: 0, titulo: "Plan Premium" },
    { id: 1, titulo: "Plan Standar" },
    { id: 2, titulo: "Comodato" },
  ];

  const tipoEstado = [
    { id: 0, titulo: "Activo" },
    { id: 1, titulo: "Inactivo" },
    { id: 2, titulo: "Mora" },
  ];

  const handleDatePlanChange = (date) => {
    setFinPlan(date);
  };

  const handleDatePagoChange = (date) => {
    setFechaPago(date);
  };

  const handleCreatePlacaClick = () => {
    const newPlaca = {
      placa: placa,
      user: user,
      tipo: tipo,
      plan: plan,
      finPlan: finPlan,
      fechaPago: fechaPago,
      estado: estado,
    };
    handleCreatePlaca(newPlaca);
  };

  return (
    <div
      className={`modal fade ${showModal ? "show" : ""}`}
      tabIndex="-1"
      style={{
        display: showModal ? "block" : "none",
        zIndex: "1050",
      }}
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollabled">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Crear una nueva placa</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleCloseModal}
            ></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="placa" className="form-label">
                  Placa
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="placa"
                  onChange={(e) => setPlaca(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="ususario" className="form-label">
                  Asigna un usuario
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="ususario"
                  onChange={(e) => setUser(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="tipoVehiculo" className="form-label">
                  Selecciona tipo de vehículo
                </label>
                <select
                  className="form-select"
                  id="tipoVehiculo"
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <option value="">Seleccionar tipo</option>
                  {tipoVehiculo.map((tipo) => (
                    <option key={tipo.id} value={tipo.titulo}>
                      {tipo.titulo}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="tipoPlan" className="form-label">
                  Selecciona un plan
                </label>
                <select
                  className="form-select"
                  id="tipoPlan"
                  onChange={(e) => setPlan(e.target.value)}
                >
                  <option value="">Seleccionar tipo</option>
                  {tipoPlan.map((tipo) => (
                    <option key={tipo.id} value={tipo.titulo}>
                      {tipo.titulo}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="finPlan" className="form-label">
                  Selecciona la fecha del fin
                </label>
                <br />
                <DatePicker
                  selected={finPlan}
                  onChange={handleDatePlanChange}
                  dateFormat="dd/MM/yyyy"
                  id="finPlan"
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="fechaPago" className="form-label">
                  Selecciona la fecha de pago
                </label>
                <br />
                <DatePicker
                  selected={fechaPago}
                  onChange={handleDatePagoChange}
                  dateFormat="dd/MM/yyyy"
                  id="fechaPago"
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="estado" className="form-label">
                  Asigna un estado
                </label>
                <select
                  className="form-select"
                  id="estado"
                  onChange={(e) => setEstado(e.target.value)}
                >
                  <option value="">Seleccionar estado</option>
                  {tipoEstado.map((tipo) => (
                    <option key={tipo.id} value={tipo.titulo}>
                      {tipo.titulo}
                    </option>
                  ))}
                </select>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={handleCloseModal}
            >
              Cerrar
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={handleCreatePlacaClick}
            >
              Crear Placa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePlacaModal;
