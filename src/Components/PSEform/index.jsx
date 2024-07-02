import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { FilterMatchMode } from "primereact/api";

const PSEForm = () => {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [validated, setValidated] = useState(false);
  const [placas, setPlacas] = useState([]);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [displayModal, setDisplayModal] = useState(false);
  const [selectedPlaca, setSelectedPlaca] = useState(null);
  const [selectedMes, setSelectedMes] = useState(null);
  const [meses, setMeses] = useState([]);
  const [valor, setValor] = useState(0);
  const [editingPago, setEditingPago] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      const currentDate = new Date();
      const newMeses = [];
      for (let i = 1; i <= 5; i++) {
        const newDate = new Date();
        newDate.setMonth(currentDate.getMonth() + i);
        newMeses.push({
          label: newDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          }),
          value: newDate.toISOString().slice(0, 7),
          valor: Math.floor(Math.random() * (100000 - 50000 + 1)) + 50000,
        });
      }
      setMeses(newMeses);
    }
  }, [isAuthenticated]);

  const obtenerListaVehiculos = () => {
    if (usuario && clave) {
      fetch(
        `https://cellviapi.asegurar.com.co/cellvi/servicios_web/lista/${usuario}/${clave}`,
        {
          method: "GET",
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Contraseña incorrecta");
          }
          return response.json();
        })
        .then((data) => {
          setPlacas(data);
          setIsAuthenticated(true);
        })
        .catch((error) => {
          setError(error.message);
          console.error("Error al obtener la lista de placas:", error);
        });
    }
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      obtenerListaVehiculos();
    }
    setValidated(true);
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const openModal = () => {
    setSelectedPlaca(null);
    setSelectedMes(null);
    setValor(0);
    setEditingPago(null);
    setDisplayModal(true);
  };

  const closeModal = () => {
    setDisplayModal(false);
  };

  const handleAgregarPago = () => {
    const newPago = {
      placa: selectedPlaca,
      mes: selectedMes.label,
      valor: selectedMes.valor,
    };
    confirmDialog({
      message: "¿Desea agregar este pago?",
      header: "Confirmación",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        setData([...data, newPago]);
        closeModal();
      },
    });
  };

  const handleEditPago = (pago) => {
    setSelectedPlaca(pago.placa);
    const mes = meses.find((m) => m.label === pago.mes);
    setSelectedMes(mes);
    setValor(pago.valor);
    setEditingPago(pago);
    setDisplayModal(true);
  };

  const handleUpdatePago = () => {
    const updatedPago = {
      placa: selectedPlaca,
      mes: selectedMes.label,
      valor: selectedMes.valor,
    };
    confirmDialog({
      message: "¿Desea actualizar este pago?",
      header: "Confirmación",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        setData(data.map((p) => (p === editingPago ? updatedPago : p)));
        closeModal();
      },
    });
  };

  const handleDeletePago = (pago) => {
    confirmDialog({
      message: "¿Desea eliminar este pago?",
      header: "Confirmación",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        setData(data.filter((p) => p !== pago));
      },
    });
  };

  const renderHeader = () => {
    return (
      <div className="table-header">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Buscar globalmente"
          />
        </span>
      </div>
    );
  };

  const header = renderHeader();

  const totalValue = data.reduce((acc, pago) => acc + pago.valor, 0);

  if (isAuthenticated) {
    return (
      <div className="container mt-5">
        <h3 className="text-center">Lista de Vehículos</h3>
        <Button
          label="Agregar Pago"
          icon="pi pi-plus"
          onClick={openModal}
          className="mb-3"
        />
        <DataTable
          value={data}
          paginator
          rows={10}
          dataKey="placa"
          filters={filters}
          filterDisplay="row"
          globalFilterFields={["placa", "mes", "valor"]}
          // header={header}
          emptyMessage="No se encontraron pagos."
        >
          <Column
            field="placa"
            header="Placa"
            filter
            filterPlaceholder="Buscar placa"
            style={{ minWidth: "10rem" }}
          />
          <Column
            field="mes"
            header="Mes a pagar"
            style={{ minWidth: "10rem" }}
          />
          <Column field="valor" header="Valor" style={{ minWidth: "10rem" }} />
          <Column
            header="Acciones"
            body={(rowData) => (
              <div>
                <Button
                  icon="pi pi-pencil"
                  className="p-button-rounded p-button-success mr-2"
                  onClick={() => handleEditPago(rowData)}
                />
                <Button
                  icon="pi pi-trash"
                  className="p-button-rounded p-button-danger"
                  onClick={() => handleDeletePago(rowData)}
                />
              </div>
            )}
            style={{ minWidth: "10rem" }}
          />
        </DataTable>
        <div className="text-right mt-3">
          <strong>Total:</strong> {totalValue}
        </div>
        <Dialog
          header="Agregar Pago"
          visible={displayModal}
          style={{ width: "50vw" }}
          onHide={closeModal}
        >
          <div className="p-fluid">
            <div className="p-field">
              <label htmlFor="placa">Placa</label>
              <Dropdown
                id="placa"
                value={selectedPlaca}
                options={placas.map((p) => ({
                  label: p.placa,
                  value: p.placa,
                }))}
                onChange={(e) => setSelectedPlaca(e.value)}
                placeholder="Seleccione una placa"
              />
            </div>
            <div className="p-field">
              <label htmlFor="mes">Mes</label>
              <Dropdown
                id="mes"
                value={selectedMes}
                options={meses}
                onChange={(e) => setSelectedMes(e.value)}
                placeholder="Seleccione un mes"
              />
            </div>
            <div className="p-field">
              <label htmlFor="valor">Valor</label>
              <InputNumber
                id="valor"
                value={selectedMes ? selectedMes.valor : 0}
                disabled
              />
            </div>
            <div className="p-field">
              <Button
                label={editingPago ? "Actualizar" : "Agregar"}
                icon="pi pi-check"
                onClick={editingPago ? handleUpdatePago : handleAgregarPago}
              />
            </div>
          </div>
        </Dialog>
        <ConfirmDialog />
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col">
          <div className="card">
            <div className="card-header">
              <p className="text-center h3">
                Acá puedes pagar en línea, tus saldos asociados al servicio de
                rastreo de tus vehiculos.
              </p>
            </div>
            <div className="card-body">
              <p className="h5">
                Ingresa tu usuario y clave de CELLVI aqui para validar tu
                identidad y comenzar el proceso de pago.
              </p>
              <form
                noValidate
                validated={validated.toString()}
                onSubmit={handleSubmit}
              >
                <div className="form-group">
                  <label htmlFor="usuario">Usuario:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="clave">Clave:</label>
                  <input
                    type="password"
                    className="form-control"
                    id="clave"
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" label="Ingresar" />
              </form>
              {error && <div className="alert alert-danger">{error}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PSEForm;
