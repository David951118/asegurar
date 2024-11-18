import React, { useState, useEffect, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreatePlacaModal = ({
  showModal,
  handleCloseModal,
  handleCreatePlaca,
}) => {
  const [placa, setPlaca] = useState("");
  const [fechaCorte, setFechaCorte] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isUserSelected, setIsUserSelected] = useState(false);
  const [cuotas, setCuotas] = useState(1); // Cuotas iniciales en 1
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch users
  const fetchUsers = useCallback(
    async (search) => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `http://localhost:4000/api/v1/customers/?name=${search}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener usuarios");
        }

        const usersData = await response.json();
        setFilteredUsers(usersData);
      } catch (err) {
        setError("Error al obtener usuarios");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (searchTerm && !isUserSelected) {
      const delayDebounceFn = setTimeout(() => {
        fetchUsers(searchTerm);
      }, 400);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setFilteredUsers([]);
    }
  }, [searchTerm, isUserSelected, fetchUsers]);

  const handleUserSelect = (user) => {
    setUserId(user.id);
    setSearchTerm(user.name);
    setFilteredUsers([]);
    setIsUserSelected(true);
  };

  const generarCuotas = (fechaInicial, numCuotas) => {
    const nuevasCuotas = Array.from({ length: numCuotas }, (_, i) => {
      const nuevaFecha = new Date(fechaInicial);
      nuevaFecha.setMonth(nuevaFecha.getMonth() + i);
      return {
        mes: i + 1,
        valor: 50000, // Valor de la cuota
        fechaCorte: nuevaFecha,
      };
    });
    setPagos(nuevasCuotas);
  };

  // Actualiza cuotas cuando cambian la fecha de corte o el número de cuotas
  useEffect(() => {
    if (fechaCorte && cuotas) {
      generarCuotas(fechaCorte, cuotas);
    }
  }, [fechaCorte, cuotas]);

  const handleCuotasChange = (e) => {
    const numCuotas = parseInt(e.target.value, 10);
    setCuotas(numCuotas);
  };

  // Actualiza la fecha de corte de una cuota específica
  const handleFechaCorteChange = (index, date) => {
    setPagos((prevPagos) =>
      prevPagos.map((pago, i) =>
        i === index ? { ...pago, fechaCorte: date } : pago
      )
    );
  };

  const handleCreatePlacaClick = () => {
    if (!placa || !userId || pagos.length === 0) {
      setErrorMessage("Por favor, completa todos los campos.");
      return;
    }

    const newPlaca = {
      plate: placa,
      customerId: userId,
      pagos,
    };

    handleCreatePlaca(newPlaca)
      .then(() => {
        setErrorMessage(null); // Limpiar mensaje de error si se crea exitosamente
        resetForm(); // Reiniciar el formulario después de crear la placa
      })
      .catch((error) => {
        setErrorMessage("Error al crear la placa"); // Mostrar error si ocurre un fallo
        resetForm(); // Reiniciar el formulario en caso de error
        handleCloseModal(); // Cerrar el modal si hay un error
      });
  };

  // Reiniciar el formulario
  const resetForm = () => {
    setPlaca("");
    setSearchTerm("");
    setIsUserSelected(false);
    setUserId(null);
    setCuotas(1);
    setFechaCorte(null);
    setPagos([]);
  };

  // Reiniciar los campos al cerrar el modal
  const handleClose = () => {
    resetForm();
    handleCloseModal(); // Cerrar el modal después de reiniciar el formulario
  };

  return (
    <div
      className={`modal fade ${showModal ? "show" : ""}`}
      tabIndex="-1"
      style={{ display: showModal ? "block" : "none", zIndex: "1050" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Crear una nueva placa</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="placa" className="form-label">
                  Placa
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="placa"
                  value={placa} // Bindear el valor
                  onChange={(e) => setPlaca(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="searchUser" className="form-label">
                  Buscar Usuario
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="searchUser"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsUserSelected(false);
                  }}
                />
                {loading && <p>Cargando...</p>}
                {error && <p className="text-danger">{error}</p>}
                {!isUserSelected && filteredUsers.length > 0 && (
                  <ul className="list-group mt-2">
                    {filteredUsers.map((user) => (
                      <li
                        key={user.id}
                        className="list-group-item list-group-item-action"
                        onClick={() => handleUserSelect(user)}
                      >
                        {user.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="row">
                <div className="mb-3 col">
                  <label htmlFor="cuotas" className="form-label">
                    Número de cuotas
                  </label>
                  <select
                    className="form-control"
                    id="cuotas"
                    value={cuotas}
                    onChange={handleCuotasChange}
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3 col">
                  <label htmlFor="fechaCorte" className="form-label">
                    Fecha de corte
                  </label>
                  <DatePicker
                    selected={fechaCorte}
                    onChange={(date) => setFechaCorte(date)}
                    dateFormat="dd/MM/yyyy"
                    className="form-control"
                  />
                </div>
              </div>

              {pagos.map((pago, index) => (
                <div key={index} className="mb-3 row">
                  <label>Cuota {index + 1}</label>
                  <div className="col">
                    <input
                      type="number"
                      value={pago.valor}
                      onChange={(e) =>
                        setPagos((prevPagos) =>
                          prevPagos.map((p, i) =>
                            i === index ? { ...p, valor: e.target.value } : p
                          )
                        )
                      }
                      className="form-control"
                    />
                  </div>
                  <div className="col">
                    <DatePicker
                      selected={pago.fechaCorte}
                      onChange={(date) => handleFechaCorteChange(index, date)}
                      dateFormat="dd/MM/yyyy"
                      className="form-control"
                    />
                  </div>
                </div>
              ))}
              <div>
                {/* Mostrar mensaje de error si existe */}
                {errorMessage && (
                  <div className="alert alert-danger">{errorMessage}</div>
                )}

                {/* Resto del modal */}
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={handleCreatePlacaClick}
            >
              Crear Placa
            </button>
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={handleClose}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePlacaModal;
