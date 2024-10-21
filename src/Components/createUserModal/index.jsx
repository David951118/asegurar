import React, { useState } from "react";

const CreateUserModal = ({ showModal, handleCloseModal, handleCreateUser }) => {
  const [name, setName] = useState("");
  const [idCard, setIdCard] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [userCellvi, setUserCellvi] = useState("");
  const [direction, setDirection] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [natural, setNatural] = useState(true);
  const [password, setPassword] = useState("");

  const handleCreateUserClick = () => {
    const newUser = {
      isActive,
      natural,
      name,
      idCard,
      userCellvi,
      direction,
      phone,
      user: {
        email,
        password,
        role: "customer", // O "customer", dependiendo del rol seleccionado
      },
    };
    console.log(newUser)
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
            <h5 className="modal-title">Crear un nuevo cliente</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleCloseModal}
            ></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="isActive" className="form-label">
                  Activo
                </label>
                <select
                  className="form-select"
                  id="isActive"
                  onChange={(e) => setIsActive(e.target.value === "true")}
                >
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="isNatural" className="form-label">
                  Tipo de cliente
                </label>
                <select
                  className="form-select"
                  id="isNatural"
                  onChange={(e) => setNatural(e.target.value === "true")}
                >
                  <option value="true">Natural</option>
                  <option value="false">Jurídica</option>
                </select>
              </div>
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
                <label htmlFor="idCard" className="form-label">
                  Cédula/NIT
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="idCard"
                  onChange={(e) => setIdCard(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="userCellvi" className="form-label">
                  Usuario de CELLVI
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="userCellvi"
                  onChange={(e) => setUserCellvi(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="direction" className="form-label">
                  Dirección
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="direction"
                  onChange={(e) => setDirection(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">
                  Teléfono
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="phone"
                  onChange={(e) => setPhone(e.target.value)}
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
                <label htmlFor="password" className="form-label">
                  Contraseña temporal
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
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
              onClick={handleCreateUserClick}
            >
              Crear cliente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;
