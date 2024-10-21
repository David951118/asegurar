import React, { useState, useEffect } from "react";

export default function ConfirmDialogModal({
  show,
  tipe,
  cancel,
  confirm,
  data,
}) {
  const [message, setMessage] = useState("");
  const [messageDisplay, setMessageDisplay] = useState("");

  useEffect(() => {
    if (tipe === "Eliminacion") {
      setMessage("Confirmar eliminación");
      setMessageDisplay("Eliminar");
    } else if (tipe === "Edicion") {
      setMessage("Confirmar edición");
      setMessageDisplay("Editar");
    }
  }, [tipe]); 

  if (!show) {
    return null; 
  }

  return (
    <div className="modal show" style={{ display: "block" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{message}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={cancel}
            ></button>
          </div>
          <div className="modal-body">
            <p>¿Estás seguro de que deseas {messageDisplay} este elemento?</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={cancel}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => confirm(data)}
            >
              {messageDisplay}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
