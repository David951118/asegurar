import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import image from "../../Assets/Wompi_ContraccionPrincipal.png";
import { MDBInput, MDBRadio } from "mdb-react-ui-kit";

export default function Login() {
  const [cedula, setCedula] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [clienteData, setClienteData] = useState(null); // Guardar la info del cliente
  const [opciones, setOpciones] = useState([]);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState("");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Función para manejar la validación de la cédula
  const handleLoginCedula = async (event) => {
    event.preventDefault();
    setErrorMessage(""); // Limpiar mensaje de error

    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/customers/validateId/${cedula}`,
        { method: "GET" }
      );

      if (response.ok) {
        const data = await response.json();
        // Verifica que `data` es un objeto antes de actualizar el estado
        if (data && typeof data === "object") {
          setUser(data)
          setClienteData(data);
          generarPregunta(data); // Generar una pregunta sobre el teléfono
        } else {
          console.error("Formato de datos inesperado:", data);
          setErrorMessage("Error al procesar los datos.");
        }
      } else if (response.status === 401) {
        setErrorMessage("Cédula incorrecta.");
      } else {
        console.error("Error en la autenticación, código:", response.status);
        setErrorMessage("Error en la autenticación.");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Hubo un error con la solicitud.");
    }
  };

  // Generar una pregunta de seguridad preguntando por el teléfono
  const generarPregunta = (data) => {
    console.log(data);
    const opcionesAleatorias = [];
    const campoCorrecto = data[0].phone;

    // Agregar la opción correcta (número de teléfono del cliente)
    opcionesAleatorias.push(campoCorrecto);

    // Generar 3 opciones incorrectas
    for (let i = 0; i < 3; i++) {
      opcionesAleatorias.push(generarOpcionIncorrecta());
    }

    // Mezclar las opciones para que no siempre esté en el mismo lugar
    const opcionesMezcladas = opcionesAleatorias.sort(
      () => 0.5 - Math.random()
    );
    setOpciones(opcionesMezcladas);
  };

  // Función para generar una opción incorrecta de teléfono
  const generarOpcionIncorrecta = () => {
    return `317${Math.floor(1000000 + Math.random() * 9000000)}`;
  };

  // Enviar la respuesta seleccionada para validación
  const validarRespuesta = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/v1/auth/login-by-cedula",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cedula: clienteData[0].idCard,
            securityAnswer: respuestaSeleccionada,
          }),
        }
      );
      console.log(response);

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        navigate("/portaldepagos/wompi/portal", { state: { user: user } });
      } else {
        setErrorMessage("Respuesta incorrecta.");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Error en la validación de seguridad.");
    }
  };

  return (
    <div className="container py-4">
      <div
        className=" text-center row p-4 rounded"
        style={{ background: "#FAFAFA" }}
      >
        <div className="col-md-6 rounded" style={{ background: "#B0F2AE" }}>
          <img src={image} alt={"imagen"} className="img img-fluid mt-5" />
          <p>
            Este es nuestro portal de pagos WOMPI, primero vamos a validar tu
            identidad profavor ingresa tu numero de cedula o NIT y responmde la
            pregunta de seguridad para validar tu informacion.
          </p>
        </div>
        <div className="col-md-6 mt-5 ">
          <h1>Autenticación de Usuario</h1>
          {!clienteData ? (
            <form onSubmit={handleLoginCedula}>
              <div className="form-group text-center">
                <label htmlFor="usuario">Ingresa tu número de cédula</label>
                <div
                  style={{ width: "300px", margin: "0 auto" }}
                  className="p-2"
                >
                  <MDBInput
                    label="No. Cedula"
                    type="text"
                    id="cedula"
                    placeholder="Ingrese su cédula"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary mt-4">
                Validar cédula
              </button>
              {errorMessage && (
                <p className="text-danger mt-2">{errorMessage}</p>
              )}
            </form>
          ) : (
            <div className="text-center">
              {/* <div className="text-center align-items-center d-flex flex-column"> */}
              <h3>¿Cuál es tu número de teléfono?</h3>
              <div className="col-md-5 d-flex justify-content-center">
                <div className="d-flex flex-column align-items-center">
                  {opciones.map((opcion, index) => (
                    <div key={index} className="my-2">
                      <MDBRadio
                        name="respuesta"
                        id={`opcion-${index}`}
                        label={opcion}
                        value={opcion}
                        onChange={(e) =>
                          setRespuestaSeleccionada(e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={validarRespuesta}
                className="btn btn-secondary mt-3"
              >
                Enviar respuesta
              </button>
              {errorMessage && (
                <p className="text-danger mt-2">{errorMessage}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
