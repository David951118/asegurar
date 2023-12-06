import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="container text-center p-5">
      <h1 className="mb-3">Panel de Administración</h1>
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <i className="bi bi-person-plus text-primary fs-2 mb-3"></i>
              <h5 className="card-title">Administracion de clientes</h5>
              <Link to="/admin/users  " className="btn btn-primary">
                Ir
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <i className="bi bi-person-check text-warning fs-2 mb-3"></i>
              <h5 className="card-title">Administracion de blog</h5>
              <Link to="/crear-cuenta" className="btn btn-warning">
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
              <Link to="/crear-cuenta" className="btn btn-success">
                Ir
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
