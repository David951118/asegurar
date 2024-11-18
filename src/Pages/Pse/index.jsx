import React from "react";
import { Card } from "primereact/card";
// import { useNavigate } from "react-router-dom";
import Banco from "../../Assets/Portal de pagos/CIB.D-4e55a284.png";
import Prueba from "../../Assets/Portal de pagos/814004223.png"; // Asegúrate de tener la imagen del QR en tu proyecto
import Aliados from "../../Assets/Portal de pagos/qrInformacion.png";

// Componente para el encabezado
const Header = ({ image, height }) => {
  return (
    <div className="header-container text-center">
      <img
        src={image}
        alt="imagen"
        className="header-image img-fluid rounded-start"
        style={{ height }}
      />
    </div>
  );
};

// Componente para el pie de la tarjeta
const FooterCard = ({ link, disabled, title }) => {
  // const navigate = useNavigate();

  // const handleButtonClick = () => {
  //   if (!disabled) {
  //     navigate(link);
  //   }
  // };

  return (
    <div className="footer-container text-center">
      {/* <button
        type="button"
        className={`btn btn-lg ${
          disabled ? "btn-disabled" : "btn-primary-custom"
        }`}
        disabled={disabled}
        onClick={handleButtonClick}
      >
        {title}
      </button> */}
      <img
        src={Prueba}
        alt="QR de Bancolombia"
        className="img-fluid mb-2"
        style={{
          maxWidth: "100%",
          height: "auto",
          width: "clamp(150px, 50vw, 300px)",
        }}
      />
      <img
        src={Aliados}
        alt="Aliados de Bancolombia"
        className="img-fluid"
        style={{ maxWidth: "300px" }}
      />
      <div className="px-2 pt-3">
        <p>
          No te olvides enviar el certificado de consignacio a nuestro canal
          dedicado
        </p>
      </div>
    </div>
  );
};

const Pse = () => {
  const banco = Banco;
  return (
    <div className="pse-container text-center p-3">
      <div className="content-container">
        <div className="row justify-content-center m-3">
          <div className="col-md-6">
            <Card
              title="Pagos con QR de Bancolombia"
              subTitle="Ademas puedes pagar con Nequi"
              footer={
                <FooterCard
                  link="/portaldepagos/qrbancolombia"
                  disabled={false}
                  title="Escanea el código"
                />
              }
              header={<Header image={banco} height={"100%"} />}
              className="custom-card"
            >
              <p className="m-0 description">
                Escanea el código QR con la app Bancolombia y paga de forma
                directa y segura a nuestra empresa. Utilizando la app de
                Bancolombia, podrás realizar pagos instantáneos desde tu cuenta
                bancaria, sin necesidad de efectivo o tarjetas. Este método
                garantiza que tus transacciones se completen de manera rápida y
                confiable, con la protección y seguridad que esperas. Simplifica
                tu experiencia de pago y elige la opción más conveniente y
                segura al pagar tus compras con el QR de Bancolombia.
              </p>
              
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pse;
