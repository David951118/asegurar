import React, { useState } from "react";
import PSEForm from "../../Components/PSEform";
import Result from "../../Components/PSEform/Result"; 
import image from "../../Assets/Untitled.jpg";

const Portal = () => {
  const [paymentAmount, setPaymentAmount] = useState(null);

  const handlePayment = (amount) => {

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
    </div>
  );
};

export default Portal;
