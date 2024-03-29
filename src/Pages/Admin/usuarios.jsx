import React, { useState, useEffect } from "react";
import CreateUserModal from "../../Components/createUserModal";
import EditUserModal from "../../Components/editUserModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Adminusers = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [userEditable, setUserEditable] = useState([]);

  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, []);

  const openUserModal = () => {
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setUserEditable(user);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleCreateUser = (user) => {
    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
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
          <h1 className="col-md-8">Panel de Administración de usuarios</h1>
          <div className="col-md-4 d-flex justify-content-end align-items-center">
            <button className="btn btn-primary mx-3" onClick={openUserModal}>
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
                <th>No</th>
                <th>Nombre</th>
                <th>Cédula</th>
                <th>Placas</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.cedula}</td>
                  <td>
                    {user.placas &&
                      user.placas.map((placa, placaIndex) => (
                        <div key={placaIndex}>
                          <strong>{placa.placa}</strong>:{" "}
                          {/* Dejamos temporalmente vacías las facturas */}
                        </div>
                      ))}
                  </td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm mr-2 m-1"
                      onClick={() => openEditModal(user)}
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-1" />
                    </button>
                    <button
                      className="btn btn-danger btn-sm m-1"
                      onClick={() => handleDeleteUser(user.cedula)}
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
      <CreateUserModal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        handleCreateUser={handleCreateUser}
      />
      <EditUserModal
        user={userEditable}
        showEditModal={showEditModal}
        handleCloseEditModal={handleCloseEditModal}
        handleEditUser={handleEditUser}
      />
    </>
  );
};

export default Adminusers;