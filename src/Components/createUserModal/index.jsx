import React, { useState } from "react";

const CreateUserModal = ({ showModal, handleCloseModal, handleCreateUser }) => {
  const [name, setName] = useState("");
  const [cedula, setCedula] = useState(0);
  const [celular, setCelular] = useState(0);
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");

  const handleCreateUserClick = () => {
    const newUser = {
      name: name,
      cedula: cedula,
      celular: celular,
      email: email,
      direccion: direccion,
      ciudad: ciudad,
    };
    handleCreateUser(newUser);
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
            <h5 className="modal-title">Crear un nuevo usuario</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleCloseModal}
            ></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Nombre
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="cedula" className="form-label">
                  Cedula
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="cedula"
                  onChange={(e) => setCedula(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="celular" className="form-label">
                  Celular
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="celular"
                  onChange={(e) => setCelular(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="direccion" className="form-label">
                  Direccion
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="direccion"
                  onChange={(e) => setDireccion(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="ciudad" className="form-label">
                  Ciudad
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="Ciudad"
                  onChange={(e) => setCiudad(e.target.value)}
                />
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
              onClick={handleCreateUserClick} // Llamando a la función para crear el usuario
            >
              Crear usuario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;
