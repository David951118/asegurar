import React, { useState, useEffect } from "react";
import BackgroundGradient from "../../Components/background";
import Footer from "../../Components/footer";

export default function Ubicacion() {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [placas, setPlacas] = useState([]);
  const [placaSeleccionada, setPlacaSeleccionada] = useState("");
  const [resultado, setResultado] = useState("");
  const [mostrarBotonGenerarLista, setMostrarBotonGenerarLista] = useState(false);
  const [tiempoValidez, setTiempoValidez] = useState("15 minutos"); // Valor predeterminado de 15 minutos
  const [error, setError] = useState(null);

  // Función para obtener la lista de vehículos
  const obtenerListaVehiculos = () => {
    if (usuario && clave) {
      fetch(`https://cellviapi.asegurar.com.co/cellvi/servicios_web/lista/${usuario}/${clave}`, {
        method: "GET",
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Contraseña incorrecta');
        }
        return response.json();
      })
      .then((data) => {
        setPlacas(data);
        setMostrarBotonGenerarLista(false);
        console.log(data);
      })
      .catch((error) => {
        setError(error.message);
        console.error("Error al obtener la lista de placas:", error);
      });
    }
  };

  useEffect(() => {
    if (mostrarBotonGenerarLista) {
      obtenerListaVehiculos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mostrarBotonGenerarLista]);

  const generarTexto = () => {
    // Función para convertir la selección de tiempo de validez a una fecha y hora máxima de apertura del enlace
    const convertirTiempoAFechaMaxima = (tiempo) => {
      const ahora = new Date();
      switch (tiempo) {
        case "15 minutos":
          return new Date(ahora.getTime() + 15 * 60000); // 15 minutos
        case "30 minutos":
          return new Date(ahora.getTime() + 30 * 60000); // 30 minutos
        case "1 hora":
          return new Date(ahora.getTime() + 60 * 60000); // 1 hora
        case "2 horas":
          return new Date(ahora.getTime() + 120 * 60000); // 2 horas
        case "3 horas":
          return new Date(ahora.getTime() + 180 * 60000); // 3 horas
        case "8 horas":
          return new Date(ahora.getTime() + 480 * 60000); // 8 horas
        default:
          return new Date(ahora.getTime() + 15 * 60000); // Por defecto, 15 minutos
      }
    };

    const placaEncontrada = placas.find((item) => item.placa === placaSeleccionada);
    if (placaEncontrada) {
      const { latitud, longitud, placa, ubicacion, velocidad } = placaEncontrada;
      const fechaMaximaApertura = convertirTiempoAFechaMaxima(tiempoValidez);
      const parametrosCodificados = encodeURIComponent(
        `${latitud}|${longitud}|${placa}|${ubicacion}|${velocidad}|${fechaMaximaApertura.toISOString()}`
      );

      setResultado(`https://www.asegurar.com.co/ubicacion/${parametrosCodificados}`);
    } else {
      setResultado("No se encontraron coordenadas para la placa seleccionada.");
    }
  };
  const copiarAlPortapapeles = () => {
    navigator.clipboard
      .writeText(resultado)
      .then(() => alert("Texto copiado al portapapeles"))
      .catch((error) =>
        console.error("Error al copiar al portapapeles:", error)
      );
  };

  const abrirEnlace = () => {
    window.open(resultado, "_blank");
  };

  let info = {
    title: "Administracion de ubicacion",
    titleDescription: "Aquí podrás compartir la ubicación de tu vehículo con otras personas.",
    titleLogin: "Ingresa tu usuario y clave de CELLVI y podrás compartir la ubicación.",
  };

  return (
    <div>
      <BackgroundGradient color1="#fff" color2="#fff">
        <div className="w-100 m-2">
          <div className="container-fluid w-100 container position-relative overflow-hidden text-center">
            <div className="row container">
              <div className="p-3 container justify-content-center">
                <div className="p-lg-5 mx-auto text-center row">
                  <h1 className="display-3 fw-bold text-center">
                    {info.title}
                  </h1>
                  <h3 className="fw-normal text-muted mb-3 text-center">
                    {info.titleDescription}
                  </h3>
                  <h3 className="fw-normal text-muted mb-3 text-center">
                    {info.titleLogin}
                  </h3>
                </div>
              </div>
            </div>
            <div className="row container">
              <div className="row justify-content-center">
                <div className="col-md-6">
                  <form>
                    <div className="mb-3">
                      <label htmlFor="usuario" className="form-label">
                        Usuario
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="usuario"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="clave" className="form-label">
                        Clave
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="clave"
                        value={clave}
                        onChange={(e) => setClave(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            obtenerListaVehiculos();
                          }
                        }}
                      />
                    </div>
                    {!placas.length && !mostrarBotonGenerarLista && (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setMostrarBotonGenerarLista(true)}
                      >
                        Generar lista de vehículos
                      </button>
                    )}
                    {placas.length > 0 && (
                      <div>
                        <div className="mb-3">
                          <label htmlFor="placa" className="form-label">
                            Placa Vehículo
                          </label>
                          <select
                            className="form-select"
                            id="placa"
                            value={placaSeleccionada}
                            onChange={(e) => setPlacaSeleccionada(e.target.value)}
                          >
                            <option value="">Seleccionar Placa</option>
                            {placas.map((reporte, index) => (
                              <option key={index} value={reporte.placa}>
                                {reporte.placa}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="tiempoValidez" className="form-label">
                            Tiempo de validez del enlace
                          </label>
                          <select
                            className="form-select"
                            id="tiempoValidez"
                            value={tiempoValidez}
                            onChange={(e) => setTiempoValidez(e.target.value)}
                          >
                            <option value="15 minutos">15 minutos</option>
                            <option value="30 minutos">30 minutos</option>
                            <option value="1 hora">1 hora</option>
                            <option value="2 horas">2 horas</option>
                            <option value="3 horas">3 horas</option>
                            <option value="8 horas">8 horas</option>
                          </select>
                        </div>
                        <div className="d-grid gap-2 mb-3">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={generarTexto}
                            disabled={!placaSeleccionada}
                          >
                            Generar link de ubicación
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={copiarAlPortapapeles}
                            disabled={!resultado}
                          >
                            Copiar texto
                          </button>
                          <button
                            type="button"
                            className="btn btn-info"
                            onClick={abrirEnlace}
                            disabled={!resultado}
                          >
                            Ir al enlace
                          </button>
                        </div>
                      </div>
                    )}
                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}
                  </form>
                </div>
              </div>
              {resultado && (
                <div className="row mt-3 justify-content-center">
                  <div className="col-md-6">
                    <div className="alert alert-success" role="alert">
                      {resultado}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </BackgroundGradient>
      <Footer />
    </div>
  );
}
