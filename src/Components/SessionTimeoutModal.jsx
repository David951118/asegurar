import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useAuth } from "../Context/AuthContext";

const SessionTimeoutModal = () => {
  const { showRenewalModal, renewSession, logout } = useAuth();

  const footer = (
    <div>
      <Button
        label="Cerrar Sesión"
        icon="pi pi-times"
        onClick={logout}
        className="p-button-text"
      />
      <Button
        label="Seguir Conectado"
        icon="pi pi-check"
        onClick={renewSession}
        autoFocus
      />
    </div>
  );

  return (
    <Dialog
      header="Sesión por expirar"
      visible={showRenewalModal}
      style={{ width: "50vw" }}
      footer={footer}
      onHide={() => {}} // Prevenir cerrar al hacer clic fuera
      closable={false}
    >
      <p className="m-0">
        Tu sesión está a punto de expirar por inactividad. ¿Deseas mantenerte
        conectado?
      </p>
    </Dialog>
  );
};

export default SessionTimeoutModal;
