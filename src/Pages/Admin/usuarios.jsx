import React, { useState, useEffect } from "react";
import CreateUserModal from "../../Components/createUserModal";
import EditUserModal from "../../Components/editUserModal";
import ConfirmDialogModal from "../../Components/confirmDialogModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";

const Adminusers = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [userEditable, setUserEditable] = useState('');
  const [userToDelete, setUserToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/v1/customers", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [token]);

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

  // Función para abrir la alerta de confirmación de borrado
  const handleDeleteUser = (user) => {
    setUserToDelete(user); // Almacena el usuario a eliminar
    setShowDeleteConfirm(true); // Muestra el modal de confirmación
  };

  // Función para confirmar el borrado del usuario
  const confirmDeleteUser = async () => {
    try {
      await axios.delete(
        `http://localhost:4000/api/v1/customers/${userToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Añade el Bearer token en los headers
          },
        }
      );
      // Actualizar el estado para eliminar el usuario borrado
      setUsers(users.filter((user) => user.id !== userToDelete.id));
      console.log(`Usuario ${userToDelete.name} eliminado con éxito`);
    } catch (error) {
      console.error("Error eliminando usuario", error);
    } finally {
      setShowDeleteConfirm(false); // Cierra el modal de confirmación
    }
  };

  // Función para cancelar el borrado
  const cancelDeleteUser = () => {
    setShowDeleteConfirm(false); // Cierra el modal de confirmación sin borrar
  };

  const handleCreateUser = async (newUser) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/customers",
        newUser,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Añade el Bearer token en los headers
          },
        }
      );

      if (response.status === 201) {
        // Usuario creado con éxito
        console.log("Usuario creado con éxito");

        // Aquí actualizas el estado con el nuevo usuario
        const updatedUsers = [...users, response.data];
        setUsers(updatedUsers);
      }
    } catch (error) {
      console.error("Error creando usuario", error);
    } finally {
      handleCloseModal(); // Cierra el modal después de intentar crear el usuario
    }
  };

  const handleEditUser = async (user) => {
    const id = user.id;
    const updatedUser = { ...user };
    delete updatedUser.id;

    try {
      const response = await axios.patch(
        `http://localhost:4000/api/v1/customers/${id}`,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Usuario editado con éxito", response.data);

      // Actualiza la lista de usuarios
      setUsers(
        (prevUsers) => prevUsers.map((u) => (u.id === id ? response.data : u)) // Actualiza el usuario editado
      );
    } catch (error) {
      console.error("Error editando usuario", error);
      console.error(updatedUser);
    } finally {
      handleCloseEditModal();
    }
  };

  return (
    <>
      <div className="container text-center p-5">
        <div className="row mb-3 align-items-center">
          <h1 className="col-md-8">Panel de Administración de Usuarios</h1>
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
                <th>Nit/CC</th>
                <th>Correo</th>
                <th>Placas</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{user?.name || "Nombre no disponible"}</td>
                    <td>{user?.idCard || "ID no disponible"}</td>
                    <td>{user?.user.email || "Correo no disponible"}</td>
                    <td>
                      {user?.placas?.map((placa, placaIndex) => (
                        <div key={placaIndex}>
                          <strong>{placa.placa}</strong>:
                        </div>
                      )) || "Placas no disponibles"}
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
                        onClick={() => handleDeleteUser(user)}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} className="mr-1" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No hay usuarios disponibles</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialogModal
        show={showDeleteConfirm}
        tipe={"Eliminacion"}
        cancel={cancelDeleteUser}
        confirm={confirmDeleteUser}
        data={userToDelete}
      />

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
