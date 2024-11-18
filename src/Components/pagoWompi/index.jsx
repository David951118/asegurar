import React, { useEffect, useRef } from "react";

const PagoWompi = ({ total, reference, signatureIntegrity }) => {
  const scriptContainer = useRef(null);

  useEffect(() => {
    // Crear el script dinámicamente
    const script = document.createElement("script");
    script.src = "https://checkout.wompi.co/widget.js";
    script.async = true;
    script.setAttribute("data-render", "button"); // Carga el botón de pago
    script.setAttribute(
      "data-public-key",
      "pub_test_G2H0ycNDrlRYsJlJ2TkRUiwFZ7A0svIi"
    );
    script.setAttribute("data-currency", "COP");
    script.setAttribute("data-amount-in-cents", total * 100); // Total en centavos
    script.setAttribute("data-reference", reference); // Referencia única de la transacción
    script.setAttribute("data-signature-integrity", signatureIntegrity); // Integridad de la firma

    // Crear una variable para referenciar el contenedor del DOM actual
    const container = scriptContainer.current;

    // Añadir el script al contenedor del DOM
    if (container) {
      container.appendChild(script);
    }

    // Limpiar el script cuando el componente se desmonte
    return () => {
      if (container) {
        container.innerHTML = ""; // Eliminar el script al desmontar el componente
      }
    };
  }, [total, reference, signatureIntegrity]); // Dependencias para actualizar el script cuando cambian los valores

  return (
    <div>
      <h2>Realiza tu pago con Wompi</h2>
      <form>
        {/* Aquí se renderiza el botón de pago de Wompi */}
        <div ref={scriptContainer}></div>
      </form>
    </div>
  );
};

export default PagoWompi;
