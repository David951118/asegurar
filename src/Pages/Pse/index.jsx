import React, { useState } from "react";
import PSEForm from "../../Components/PSEform";
import Result from "../../Components/PSEform/Result"; //cobro de wompi es del 2,65 mas 700  +iva
import image from "../../Assets/Untitled.jpg";
import Footer from "../../Components/footer";

const Pse = () => {
  const [paymentAmount, setPaymentAmount] = useState(null);
  const obtenerTiempoPago = (date) => {
    // Obtener la fecha y hora actual
    let tiempoActual = date;
    // Añadir 15 minutos
    tiempoActual.setMinutes(tiempoActual.getMinutes() + 15);
    // Convertir a cadena de texto en formato ISO 8601
    let tiempoPago = tiempoActual.toISOString();
    return tiempoPago;
  };

  const handlePayment = (amount) => {
    let referenciaPago = "0001ae22";
    let tiempoPago = obtenerTiempoPago(new Date());

    setPaymentAmount(amount);
  };

  return (
    <div>
      <div className="container mt-5 p-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            {!paymentAmount ? (
              <PSEForm onSubmit={handlePayment} />
            ) : (
              <Result amount={paymentAmount} />
            )}
          </div>
          <div className="col-md-4 text-center">
            {!paymentAmount ? (
              <img src={image} alt={"imagen"} className="img img-fluid mt-5" />
            ) : (
              <Result amount={paymentAmount} />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Pse;
