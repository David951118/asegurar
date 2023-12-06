import React, { useState } from "react";

const CreateUserModal = ({ showModal, setShowModal }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [razon, setRazon] = useState("");

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleWhatsAppClick = (message) => {
    const phoneNumber = "573187500962";
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;

    window.open(whatsappUrl, "_blank");
  };

  const sendMessage = () => {
    const message = `Hola, soy ${name}. Necesito información sobre ${razon}, mi email es ${email}.`;
    handleWhatsAppClick(message);
    handleCloseModal();
    setName("");
    setRazon("");
    setEmail("");
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
                <label htmlFor="name" className="form-label">
                  Tengo interés en ...
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="razon"
                  onChange={(e) => setRazon(e.target.value)}
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
              onClick={sendMessage}
            >
              Enviar a WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;
