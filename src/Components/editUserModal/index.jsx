import React, { useState, useEffect } from "react";

const EditUserModal = ({ user, showEditModal, handleCloseEditModal, handleEditUser }) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [idCard, setIdCard] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [userCellvi, setUserCellvi] = useState("");
  const [direction, setDirection] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [natural, setNatural] = useState(true);

  // Actualiza los campos cuando el modal se abre y el usuario se pasa como prop
  useEffect(() => {
     console.log(user,'Usuaeio')
    if (user) {
      setId(user.id)
      setName(user.name || "");
      setIdCard(user.idCard || "");
      setPhone(user.phone || "");
      setEmail(user.user.email || "");
      setUserCellvi(user.userCellvi || "");
      setDirection(user.direction || "");
      setIsActive(user.isActive || true);
      setNatural(user.natural || true);
    }
  }, [user]);

  const handleEditUserClick = () => {
    const updatedUser = {
      id,
      isActive,
      natural,
      name,
      idCard,
      userCellvi,
      direction,
      phone,
      user: {
        email,
        role: "customer",
      },
    };
    handleEditUser(updatedUser);
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
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar usuario</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleCloseEditModal}
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
                  value={isActive}
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
                  value={natural}
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
                  value={name}
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
                  value={idCard}
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
                  value={userCellvi}
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
                  value={direction}
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
                  value={phone}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
              onClick={handleEditUserClick}
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
