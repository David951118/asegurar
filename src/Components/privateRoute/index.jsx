import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const PrivateRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? element : <Navigate to="/admin-login" />;
};

export default PrivateRoute;
