import React, { useState } from 'react';
import PSEForm from '../../Components/PSEform';
import Result from '../../Components/PSEform/Result'; //cobro de wompi es del 2,65 mas 700  +iva 

const Pse = () => {
  const [paymentAmount, setPaymentAmount] = useState(null);

  const handlePayment = (amount) => {
    // Aquí podrías realizar la lógica de integración con PSE
    // Por ahora, simplemente almacenaremos el monto en el estado
    setPaymentAmount(amount);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">PSE Integration Example</h1>
      <div className="row justify-content-center">
        <div className="col-md-6">
          {!paymentAmount ? (
            <PSEForm onSubmit={handlePayment} />
          ) : (
            <Result amount={paymentAmount} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Pse;