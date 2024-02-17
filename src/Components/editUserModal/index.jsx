import React, { useState, useEffect } from "react";

const EditUserModal = ({
  user,
  showEditModal,
  handleCloseEditModal,
  handleEditUser,
}) => {
  const [name, setName] = useState("");
  const [cedula, setCedula] = useState(0);
  const [celular, setCelular] = useState(0);
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");

  // Utilizamos useEffect para actualizar el estado local cuando la prop user cambie
  useEffect(() => {
    setName(user.name);
    setCedula(user.cedula);
    setCelular(user.celular);
    setEmail(user.email);
    setDireccion(user.direccion);
    setCiudad(user.ciudad);
  }, [user]); // Esta función se ejecutará cada vez que la prop user cambie

  const handleCreateUserClick = () => {
    const newUser = {
      name: name,
      cedula: cedula,
      celular: celular,
      email: email,
      direccion: direccion,
      ciudad: ciudad,
    };
    handleEditUser(newUser);
  };

  return (
    <div
      className={`modal fade ${showEditModal ? "show" : ""}`}
      tabIndex="-1"
      style={{
        display: showEditModal ? "block" : "none",
        zIndex: "1050",
      }}
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollabled">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Usuario</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleCloseEditModal}
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
                  value={name} // Utilizamos el valor del estado local
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
                  value={cedula} // Utilizamos el valor del estado local
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
                  value={celular}
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
                  value={email}
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
                  value={direccion}
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
                  value={ciudad}
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
              onClick={handleCloseEditModal}
            >
              Cerrar
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={handleCreateUserClick}
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;