import React, { useState, useCallback, useEffect } from "react";
import CreatePlacaModal from "../../Components/createPlacaModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import ConfirmDialogModal from "../../Components/confirmDialogModal"; // toDo hacer el cambio en la cantidad de coutas y crear la vista de pagos y acceso desde clickeo al pago yu coregir errores la tabla puede ser creada como un componente y hacer la edicion
import axios from "axios";

export default function Placas() {
  const [showPlacaModal, setShowPlacaModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [placas, setPlacas] = useState([]);
  const [placaEditable, setPlacaEditable] = useState([]);
  const [users, setUsers] = useState([]);
  const [plateToDelete, setPlateToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPlates(); // Llama a fetchPlates para cargar las placas al inicio
  }, [token]);

  const fetchCustomer = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/customers/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error fetching customer");
      }

      const customerData = await response.json();
      return customerData;
    } catch (error) {
      console.error("Error fetching customer:", error);
    }
  };

  const fetchPagosByPLateId = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/pagos/byPlate/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error fetching customer");
      }

      const plates = await response.json();
      return plates;
    } catch (error) {
      console.error("Error fetching customer:", error);
    }
  };

  // Mueve fetchPlates fuera del useEffect
  const fetchPlates = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:4000/api/v1/plates", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Usa el token almacenado en AuthContext
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching plates");
      }

      const platesData = await response.json();

      // Para cada placa, buscamos la información del cliente usando su ID
      const platesWithCustomerInfo = await Promise.all(
        platesData.map(async (plate) => {
          const customer = await fetchCustomer(plate.customerId);
          const pagos = await fetchPagosByPLateId(plate.id);
          return { ...plate, customer, pagos }; // Combina la placa con los datos del cliente
        })
      );

      setPlacas(platesWithCustomerInfo); // Guardamos el array resultante en el estado
      console.log(platesWithCustomerInfo)
    } catch (error) {
      console.error("Error fetching plates:", error);
    }
  }, [token]);

  const confirmDeleteUser = async () => {
    try {
      await axios.delete(
        `http://localhost:4000/api/v1/plates/${plateToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPlacas(placas.filter((placa) => placa.id !== plateToDelete.id)); // Elimina la placa del estado
      console.log(`Usuario ${plateToDelete.plate} eliminado con éxito`);
    } catch (error) {
      console.error("Error eliminando placa", error);
    } finally {
      setShowDeleteConfirm(false); // Cierra el modal de confirmación
    }
  };

  const cancelDeleteUser = () => {
    setShowDeleteConfirm(false); // Cierra el modal de confirmación sin borrar
  };
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

  const handleCreatePlaca = async (data) => {
    try {
      await axios.post(
        `http://localhost:4000/api/v1/plates`,
        data, // Asegúrate de pasar los datos en el formato correcto
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setShowPlacaModal(false); // Cierra el modal después de la creación
      fetchPlates(); // Refresca las placas
    } catch (error) {
      console.error("Error creating plate:", error);
    }
  };

  const handleEditUser = (editedUser) => {
    const updatedUsers = users.map((user) =>
      user.id === editedUser.id ? editedUser : user
    );
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    handleCloseEditModal();
  };

  const handleDeletePlate = (plate) => {
    setPlateToDelete(plate); // Almacena el usuario a eliminar
    setShowDeleteConfirm(true); // Muestra el modal de confirmación
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
                <th>Celular</th>
                <th>Cantidad de cuotas restantes</th>
                <th>Cantidad de cuotas pagadas</th>
                <th>Fecha de pago</th>
                <th>Valor cada cuota</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {placas.map((placa, index) => (
                <tr key={index}>
                  <td>{placa.plate}</td>
                  <td>{placa.customer.name}</td>
                  <td>{placa.customer.phone}</td>
                  <td>{placa.pagos.length}</td>
                  <td>{placa.pagos.length}</td>
                  <td>
                    {placa.pagos.length > 0 ? placa.pagos[0].fechaCorte : "N/A"}
                  </td>
                  <td>
                    {placa.pagos.length > 0 ? placa.pagos[0].valor : "N/A"}
                  </td>

                  <td>
                    <button
                      className="btn btn-warning btn-sm mr-2 m-1"
                      onClick={() => openEditModal(placa)}
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-1" />
                    </button>
                    <button
                      className="btn btn-danger btn-sm m-1"
                      onClick={() => handleDeletePlate(placa)}
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
        handleCreatePlaca={handleCreatePlaca}
        users={users}
      />
      <ConfirmDialogModal
        show={showDeleteConfirm}
        tipe={"Eliminacion"}
        cancel={cancelDeleteUser}
        confirm={confirmDeleteUser}
        data={plateToDelete}
      />
    </>
  );
}
