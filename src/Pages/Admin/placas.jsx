import React, { useState, useEffect } from "react";
import CreatePlacaModal from "../../Components/createPlacaModal";
import EditUserModal from "../../Components/editUserModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function Placas() {
  const [showPlacaModal, setShowPlacaModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [placas, setPlacas] = useState([]);
  const [placaEditable, setPlacaEditable] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const storedPlacas = localStorage.getItem("placas");
    if (storedPlacas) {
      setPlacas(JSON.parse(storedPlacas));
    }
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, []);

  const openPlacaModal = () => {
    setShowPlacaModal(true);
  };

  const openEditModal = (placa) => {
    setPlacaEditable(placa);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowPlacaModal(false);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleCreatePlaca = (placa) => {
    const updatedplacas = [...placas, placa];
    setUsers(updatedplacas);
    localStorage.setItem("placas", JSON.stringify(updatedplacas));
    handleCloseModal();
  };

  const handleEditUser = (editedUser) => {
    const updatedUsers = users.map((user) =>
      user.id === editedUser.id ? editedUser : user
    );
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    handleCloseEditModal();
  };

  const handleDeleteUser = (cedula) => {
    const updatedUsers = users.filter((user) => user.cedula !== cedula);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  return (
    <>
      <div className="container text-center p-5">
        <div className="row mb-3 align-items-center">
          <h1 className="col-md-8">
            Adminstracion de placa y asignación de pagos
          </h1>
          <div className="col-md-4 d-flex justify-content-end align-items-center">
            <button className="btn btn-primary mx-3" onClick={openPlacaModal}>
              Agregar
            </button>
            <Link to="/admin" className="btn btn-success">
              Volver
            </Link>
          </div>
        </div>
        <div className="row border">
          <table className="table table-striped table-hover">
            <thead>
              <tr className="table-primary">
                <th>Placa</th>
                <th>Usuario asignado</th>
                <th>Tipo de vehículo</th>
                <th>Tipo de Plan</th>
                <th>Fin del plan</th>
                <th>Fecha de pago</th>
                <th>Estado</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {placas.map((placa, index) => (
                <tr key={index}>
                  <td>{placa.placa}</td>
                  <td>{placa.user}</td>
                  <td>{placa.tipo}</td>
                  <td>{placa.plan}</td>
                  <td>{placa.finPlan}</td>
                  <td>{placa.fechaPago}</td>
                  <td>{placa.estado}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm mr-2 m-1"
                      onClick={() => openEditModal(placa)}
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-1" />
                    </button>
                    <button
                      className="btn btn-danger btn-sm m-1"
                      onClick={() => handleDeleteUser(placa.cedula)}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} className="mr-1" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <CreatePlacaModal
        showModal={showPlacaModal}
        handleCloseModal={handleCloseModal}
        handleCreateUser={handleCreatePlaca}
        users={users}
      />
      <EditUserModal
        user={placaEditable}
        showEditModal={showEditModal}
        handleCloseEditModal={handleCloseEditModal}
        handleEditUser={handleEditUser}
      />
    </>
  );
}
