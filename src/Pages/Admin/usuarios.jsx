import React, { useState } from "react";
import CreateUserModal from "../../Components/createUserModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Adminusers = () => {
  const [showModal, setShowModal] = useState(false);

  const openUserModal = () => {
    setShowModal(true);
  };

  const users = [
    {
      name: "David Sebastian Montes Zarama",
      cedula: 1085324760,
      placas: [
        {
          placa: "HQQ23G",
          facturas: [
            { valor: 300000, vencimiento: "10/12/2023" },
            { valor: 350000, vencimiento: "10/12/2023" },
          ],
        },
        {
          placa: "HQQ152",
          facturas: [
            { valor: 360000, vencimiento: "10/12/2023" },
            { valor: 800000, vencimiento: "10/12/2023" },
          ],
        },
        {
          placa: "HQQ232",
          facturas: [
            { valor: 800000, vencimiento: "10/12/2023" },
            { valor: 1000000, vencimiento: "10/12/2023" },
          ],
        },
      ],
    },
    {
      name: "David Sebastian Montes Zarama",
      cedula: 1085324760,
      placas: [
        {
          placa: "HQQ23G",
          facturas: [
            { valor: 300000, vencimiento: "10/12/2023" },
            { valor: 350000, vencimiento: "10/12/2023" },
          ],
        },
        {
          placa: "HQQ152",
          facturas: [
            { valor: 360000, vencimiento: "10/12/2023" },
            { valor: 800000, vencimiento: "10/12/2023" },
          ],
        },
        {
          placa: "HQQ232",
          facturas: [
            { valor: 800000, vencimiento: "10/12/2023" },
            { valor: 1000000, vencimiento: "10/12/2023" },
          ],
        },
      ],
    },
    {
      name: "David Sebastian Montes Zarama",
      cedula: 1085324760,
      placas: [
        {
          placa: "HQQ23G",
          facturas: [
            { valor: 300000, vencimiento: "10/12/2023" },
            { valor: 350000, vencimiento: "10/12/2023" },
          ],
        },
        {
          placa: "HQQ152",
          facturas: [
            { valor: 360000, vencimiento: "10/12/2023" },
            { valor: 800000, vencimiento: "10/12/2023" },
          ],
        },
        {
          placa: "HQQ232",
          facturas: [
            { valor: 800000, vencimiento: "10/12/2023" },
            { valor: 1000000, vencimiento: "10/12/2023" },
          ],
        },
      ],
    },
  ];
  return (
    <>
      <div className="container text-center p-5">
        <div className="row mb-3 align-items-center">
          <h1 className="col-md-8">Panel de Administración de usuarios</h1>
          <div className="col-md-4 d-flex justify-content-end align-items-center">
            <button className="btn btn-primary mx-3" onClick={openUserModal}>Agregar</button>
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
                    {user.placas.map((placa, placaIndex) => (
                      <div key={placaIndex}>
                        <strong>{placa.placa}</strong>:
                        {placa.facturas.map((factura, facturaIndex) => (
                          <div key={facturaIndex}>
                            Valor: {factura.valor}, Vencimiento:{" "}
                            {factura.vencimiento}
                          </div>
                        ))}
                      </div>
                    ))}
                  </td>
                  <td>
                    <button className="btn btn-warning btn-sm mr-2 m-1">
                      <FontAwesomeIcon icon={faEdit} className="mr-1" />
                    </button>
                    <button className="btn btn-danger btn-sm m-1">
                      <FontAwesomeIcon icon={faTrashAlt} className="mr-1" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <CreateUserModal showModal={showModal} setShowModal={setShowModal} />
    </>
  );
};

export default Adminusers;
