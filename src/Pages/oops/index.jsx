import React from "react";
import { Link } from "react-router-dom";

const OopsPage = () => (
  <div className="container p-5 ">
    <div className="shadow m-5 p-5">
      <h1>Oops, página equivocada</h1>
      <p>La página que estás buscando no existe.</p>
      <Link to="/">Volver al inicio</Link>
    </div>
  </div>
);

export default OopsPage;
