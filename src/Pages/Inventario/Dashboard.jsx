import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { FilterMatchMode } from "primereact/api";
import { useInventarioAuth } from "../../Context/InventarioAuthContext";

const MARCAS = [
  { label: "Teltonika", value: "Teltonika" },
  { label: "Coban", value: "Coban" },
  { label: "Queclink", value: "Queclink" },
  { label: "Concox", value: "Concox" },
  { label: "Ruptela", value: "Ruptela" },
  { label: "Otra", value: "Otra" },
];

const ESTADOS = [
  { label: "Disponible", value: "Disponible" },
  { label: "Instalado", value: "Instalado" },
  { label: "En reparación", value: "En reparación" },
  { label: "Baja", value: "Baja" },
];

const estadoSeverity = {
  Disponible: "success",
  Instalado: "info",
  "En reparación": "warning",
  Baja: "danger",
};

const EMPTY_EQUIPO = { marca: "", imei: "", serial: "", estado: "Disponible" };

const styles = `
  .inv-dash {
    min-height: 100vh;
    background: linear-gradient(135deg, #0a2d6e 0%, #1565c0 40%, #f0f6ff 100%);
    padding: 24px;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  }
  .inv-dash-inner { max-width: 1300px; margin: 0 auto; }
  .inv-dash-header {
    background: #fff;
    border-radius: 14px;
    padding: 20px 28px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 12px;
  }
  .inv-dash-header h1 { color: #0a2d6e; font-size: 1.5rem; margin: 0 0 4px 0; }
  .inv-dash-header p { color: #666; margin: 0; font-size: 0.9rem; }
  .inv-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }
  .inv-stat-card {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 14px rgba(0,0,0,0.08);
    text-align: center;
    border-top: 4px solid #1565c0;
    transition: transform 0.2s;
  }
  .inv-stat-card:hover { transform: translateY(-3px); }
  .inv-stat-card.green { border-top-color: #2e7d32; }
  .inv-stat-card.blue { border-top-color: #1565c0; }
  .inv-stat-card.orange { border-top-color: #e65100; }
  .inv-stat-card.red { border-top-color: #c62828; }
  .inv-stat-num { font-size: 2.2rem; font-weight: 900; color: #0a2d6e; }
  .inv-stat-card.green .inv-stat-num { color: #2e7d32; }
  .inv-stat-card.orange .inv-stat-num { color: #e65100; }
  .inv-stat-card.red .inv-stat-num { color: #c62828; }
  .inv-stat-label { font-size: 0.8rem; color: #777; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }
  .inv-table-card {
    background: #fff;
    border-radius: 14px;
    padding: 24px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  }
  .inv-table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    flex-wrap: wrap;
    gap: 12px;
  }
  .inv-table-toolbar h2 { margin: 0; color: #0a2d6e; font-size: 1.15rem; }
  .inv-search-wrap { position: relative; }
  .inv-search-wrap i {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
  }
  .inv-search-wrap .p-inputtext {
    padding-left: 36px !important;
    border-radius: 8px;
    border: 1px solid #ddd;
    height: 38px;
    font-size: 0.9rem;
  }
  .inv-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .inv-form-field { display: flex; flex-direction: column; gap: 6px; }
  .inv-form-field label { font-weight: 700; font-size: 0.88rem; color: #5b6676; }
  .inv-form-field .p-inputtext,
  .inv-form-field .p-dropdown {
    width: 100%;
    border-radius: 8px;
    border: 1.5px solid #ccc;
    height: 42px;
  }
  .inv-form-field .p-inputtext:focus { border-color: #1565c0; box-shadow: 0 0 0 3px rgba(21,101,192,0.12); }
  @media (max-width: 600px) { .inv-form-grid { grid-template-columns: 1fr; } }
`;

let nextId = 1;

function makeId() {
  return `GPS-${String(nextId++).padStart(4, "0")}`;
}

const INITIAL_DATA = [
  { id: "GPS-0001", consecutivo: 1, marca: "Teltonika", imei: "358999089082907", serial: "TLT-2024-001", estado: "Disponible", fecha_registro: "2024-01-15" },
  { id: "GPS-0002", consecutivo: 2, marca: "Queclink", imei: "862531051234567", serial: "QL-2024-002", estado: "Instalado", fecha_registro: "2024-02-10" },
];
nextId = 3;

export default function InventarioDashboard() {
  const { isInventarioAuth, logoutInventario } = useInventarioAuth();
  const navigate = useNavigate();
  const toast = useRef(null);

  const [equipos, setEquipos] = useState(INITIAL_DATA);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedEquipo, setSelectedEquipo] = useState(null);
  const [form, setForm] = useState(EMPTY_EQUIPO);
  const [formErrors, setFormErrors] = useState({});
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  // Guard: redirect if not auth
  if (!isInventarioAuth) {
    navigate("/inventario");
    return null;
  }

  const user = JSON.parse(localStorage.getItem("inv_user") || "{}");
  const username = user.persona || user.username || "Admin";

  const total = equipos.length;
  const disponibles = equipos.filter((e) => e.estado === "Disponible").length;
  const instalados = equipos.filter((e) => e.estado === "Instalado").length;
  const reparacion = equipos.filter((e) => e.estado === "En reparación").length;
  const baja = equipos.filter((e) => e.estado === "Baja").length;

  const onGlobalFilter = (e) => {
    const val = e.target.value;
    setGlobalFilterValue(val);
    setFilters({ global: { value: val || null, matchMode: FilterMatchMode.CONTAINS } });
  };

  const openNew = () => {
    setForm(EMPTY_EQUIPO);
    setFormErrors({});
    setEditMode(false);
    setDialogVisible(true);
  };

  const openEdit = (equipo) => {
    setForm({ marca: equipo.marca, imei: equipo.imei, serial: equipo.serial, estado: equipo.estado });
    setSelectedEquipo(equipo);
    setFormErrors({});
    setEditMode(true);
    setDialogVisible(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!form.marca) errors.marca = "Seleccione una marca";
    if (!form.imei || form.imei.length < 10) errors.imei = "IMEI debe tener al menos 10 dígitos";
    if (!form.serial) errors.serial = "El serial es requerido";
    if (!form.estado) errors.estado = "Seleccione un estado";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    if (editMode) {
      setEquipos((prev) =>
        prev.map((e) =>
          e.id === selectedEquipo.id ? { ...e, ...form } : e
        )
      );
      toast.current.show({ severity: "success", summary: "Actualizado", detail: "Equipo actualizado correctamente" });
    } else {
      const newId = makeId();
      const newEquipo = {
        id: newId,
        consecutivo: equipos.length + 1,
        ...form,
        fecha_registro: new Date().toISOString().slice(0, 10),
      };
      setEquipos((prev) => [...prev, newEquipo]);
      toast.current.show({ severity: "success", summary: "Registrado", detail: "Equipo GPS agregado al inventario" });
    }
    setDialogVisible(false);
  };

  const handleDelete = (equipo) => {
    confirmDialog({
      message: `¿Eliminar el equipo ${equipo.serial} (${equipo.imei})?`,
      header: "Confirmar eliminación",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => {
        setEquipos((prev) => prev.filter((e) => e.id !== equipo.id));
        toast.current.show({ severity: "warn", summary: "Eliminado", detail: "Equipo removido del inventario" });
      },
    });
  };

  const estadoTemplate = (row) => (
    <Tag value={row.estado} severity={estadoSeverity[row.estado] || "secondary"} />
  );

  const accionesTemplate = (row) => (
    <div style={{ display: "flex", gap: 8 }}>
      <Button
        icon="pi pi-pencil"
        size="small"
        outlined
        severity="info"
        tooltip="Editar"
        onClick={() => openEdit(row)}
      />
      <Button
        icon="pi pi-trash"
        size="small"
        outlined
        severity="danger"
        tooltip="Eliminar"
        onClick={() => handleDelete(row)}
      />
    </div>
  );

  const dialogFooter = (
    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
      <Button label="Cancelar" icon="pi pi-times" outlined severity="secondary" onClick={() => setDialogVisible(false)} />
      <Button label={editMode ? "Guardar cambios" : "Registrar equipo"} icon="pi pi-check" onClick={handleSave} />
    </div>
  );

  return (
    <>
      <style>{styles}</style>
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="inv-dash">
        <div className="inv-dash-inner">
          {/* Header */}
          <div className="inv-dash-header">
            <div>
              <h1>📦 Inventario de Equipos GPS</h1>
              <p>Gestión de dispositivos de rastreo · Usuario: <strong>{username}</strong></p>
            </div>
            <Button
              label="Cerrar sesión"
              icon="pi pi-power-off"
              severity="secondary"
              outlined
              onClick={() => { logoutInventario(); navigate("/inventario"); }}
            />
          </div>

          {/* Stats */}
          <div className="inv-stats-grid">
            <div className="inv-stat-card blue">
              <div className="inv-stat-num">{total}</div>
              <div className="inv-stat-label">Total equipos</div>
            </div>
            <div className="inv-stat-card green">
              <div className="inv-stat-num">{disponibles}</div>
              <div className="inv-stat-label">Disponibles</div>
            </div>
            <div className="inv-stat-card">
              <div className="inv-stat-num" style={{ color: "#1565c0" }}>{instalados}</div>
              <div className="inv-stat-label">Instalados</div>
            </div>
            <div className="inv-stat-card orange">
              <div className="inv-stat-num">{reparacion}</div>
              <div className="inv-stat-label">En reparación</div>
            </div>
            <div className="inv-stat-card red">
              <div className="inv-stat-num">{baja}</div>
              <div className="inv-stat-label">Baja</div>
            </div>
          </div>

          {/* Tabla */}
          <div className="inv-table-card">
            <div className="inv-table-toolbar">
              <h2>Equipos registrados</h2>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <div className="inv-search-wrap">
                  <i className="pi pi-search" />
                  <InputText
                    value={globalFilterValue}
                    onChange={onGlobalFilter}
                    placeholder="Buscar por IMEI, serial, marca..."
                    style={{ width: 260 }}
                  />
                </div>
                <Button
                  label="Nuevo equipo"
                  icon="pi pi-plus"
                  onClick={openNew}
                />
              </div>
            </div>

            <DataTable
              value={equipos}
              filters={filters}
              globalFilterFields={["marca", "imei", "serial", "estado"]}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25]}
              sortField="consecutivo"
              sortOrder={1}
              emptyMessage="No hay equipos registrados"
              size="small"
              stripedRows
            >
              <Column field="consecutivo" header="#" sortable style={{ width: 60 }} />
              <Column field="marca" header="Marca" sortable />
              <Column field="imei" header="IMEI" />
              <Column field="serial" header="Serial" />
              <Column field="estado" header="Estado" body={estadoTemplate} sortable />
              <Column field="fecha_registro" header="Fecha registro" sortable />
              <Column header="Acciones" body={accionesTemplate} style={{ width: 110 }} />
            </DataTable>
          </div>
        </div>
      </div>

      {/* Dialog agregar/editar */}
      <Dialog
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        header={editMode ? "Editar equipo GPS" : "Registrar nuevo equipo GPS"}
        style={{ width: "520px" }}
        footer={dialogFooter}
        modal
      >
        <div className="inv-form-grid" style={{ marginTop: 8 }}>
          <div className="inv-form-field">
            <label>Marca *</label>
            <Dropdown
              value={form.marca}
              options={MARCAS}
              onChange={(e) => setForm((f) => ({ ...f, marca: e.value }))}
              placeholder="Seleccione marca"
            />
            {formErrors.marca && <small style={{ color: "#c62828" }}>{formErrors.marca}</small>}
          </div>

          <div className="inv-form-field">
            <label>Estado *</label>
            <Dropdown
              value={form.estado}
              options={ESTADOS}
              onChange={(e) => setForm((f) => ({ ...f, estado: e.value }))}
              placeholder="Seleccione estado"
            />
            {formErrors.estado && <small style={{ color: "#c62828" }}>{formErrors.estado}</small>}
          </div>

          <div className="inv-form-field">
            <label>IMEI *</label>
            <InputText
              value={form.imei}
              onChange={(e) => setForm((f) => ({ ...f, imei: e.target.value }))}
              placeholder="Ej: 358999089082907"
              maxLength={20}
            />
            {formErrors.imei && <small style={{ color: "#c62828" }}>{formErrors.imei}</small>}
          </div>

          <div className="inv-form-field">
            <label>Serial *</label>
            <InputText
              value={form.serial}
              onChange={(e) => setForm((f) => ({ ...f, serial: e.target.value }))}
              placeholder="Ej: TLT-2024-001"
            />
            {formErrors.serial && <small style={{ color: "#c62828" }}>{formErrors.serial}</small>}
          </div>
        </div>
      </Dialog>
    </>
  );
}
