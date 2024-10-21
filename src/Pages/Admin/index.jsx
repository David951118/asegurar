import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token"); // Eliminar token de localStorage
    navigate("/admin-login"); // Redirigir a login
  };
  return (
    <div className="container text-center p-5">
      <h1 className="mb-3">Panel de Administración</h1>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <i className="bi bi-person-plus text-primary fs-2 mb-3"></i>
              <h5 className="card-title">Administracion de clientes</h5>
              <Link to="/admin/users" className="btn btn-primary">
                Ir
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <i className="bi bi-person-check text-warning fs-2 mb-3"></i>
              <h5 className="card-title">Administracion de Placas</h5>
              <Link to="/admin/placas" className="btn btn-warning">
                Ir
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <i className="bi bi-person-check text-warning fs-2 mb-3"></i>
              <h5 className="card-title">Administracion de Vista Home</h5>
              <Link to="/admin/placas" className="btn btn-success">
                Ir
              </Link>
            </div>
          </div>
        </div>
        <div className="p-5">
          <button onClick={handleLogout} className="btn btn-danger">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
