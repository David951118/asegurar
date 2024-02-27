import React from "react";
import { useParams, Link } from "react-router-dom";
import BackgroundGradient from "../../Components/background";
import Footer from "../../Components/footer";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const UbicacionDetalle = () => {
  const containerStyle = {
    width: "100%",
    height: "400px",
  };
  const { coords } = useParams();
  const [latitud, longitud, placa, ubicacion, velocidad, fechaMaximaApertura] =
    coords.split("|");

  const isEnlaceValido = React.useCallback(() => {
    const ahora = new Date().getTime();
    return ahora < Date.parse(fechaMaximaApertura);
  }, [fechaMaximaApertura]);

  const center = { lat: parseFloat(latitud), lng: parseFloat(longitud) };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
  });

  // eslint-disable-next-line
  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <div>
      <BackgroundGradient color1="#fff" color2="#fff">
        <div className="w-100 m-2 aqua--marker">
          <div className="container-fluid w-100 container position-relative overflow-hidden text-center">
            <div className="row container">
              <div className="container justify-content-center">
                <div className="p-lg-5 mx-auto text-center row">
                  {isEnlaceValido() ? (
                    <>
                      <h1 className="display-3 fw-bold text-center">
                        Visualización de ubicación
                      </h1>
                      <table className="table table-striped table-hover table-bordered">
                        <thead className="table-dark">
                          <tr>
                            <td>Clase</td>
                            <td>Informacion</td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="">
                            <td>Placa del vehículo:</td>
                            <td>{placa}</td>
                          </tr>
                          <tr>
                            <td>Latitud:</td>
                            <td>{latitud}</td>
                          </tr>
                          <tr>
                            <td>Longitud:</td>
                            <td>{longitud}</td>
                          </tr>
                          <tr>
                            <td>Ubicación:</td>
                            <td>{ubicacion}</td>
                          </tr>
                          <tr>
                            <td>Velocidad:</td>
                            <td>{velocidad}</td>
                          </tr>
                          <tr>
                            <td>Fecha máxima de apertura del enlace:</td>
                            <td>
                              {new Date(
                                Date.parse(fechaMaximaApertura)
                              ).toLocaleString()}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="col-md-12">
                        <GoogleMap
                          mapContainerStyle={containerStyle}
                          center={center}
                          zoom={15}
                          onLoad={onLoad}
                          onUnmount={onUnmount}
                        >
                          <Marker position={center} />
                        </GoogleMap>
                      </div>
                    </>
                  ) : (
                    <div className="alert alert-danger" role="alert">
                      El enlace ha expirado.
                    </div>
                  )}
                  <div className="mt-3">
                    <Link to="/" className="btn btn-primary">
                      Volver al inicio
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BackgroundGradient>
      <Footer />
    </div>
  ) : null;
};

export default UbicacionDetalle;
