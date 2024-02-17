import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import BackgroundGradient from "../../Components/background";
import Footer from "../../Components/footer";

const UbicacionDetalle = () => {
  const { coords } = useParams();
  const [latitud, longitud, placa] = coords.split("&");

  let info = {
    title: "Visualización de ubicación",
    titleDescription: `El vehículo con placa ${placa} se encuentra en Latitud: ${latitud} y Longitud: ${longitud}`,
  };

  useEffect(() => {
    const initMap = () => {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: parseFloat(latitud), lng: parseFloat(longitud) },
        zoom: 13,
      });

      // Agregar marcador
      new window.google.maps.Marker({
        position: { lat: parseFloat(latitud), lng: parseFloat(longitud) },
        map,
      });
    };

    // Verificar si la API de Google Maps ya está cargada
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC6quxArYbSqYysx-9lSnga5roPbelHxj4&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      // Si la API ya está cargada, inicializar el mapa directamente
      initMap();
    }
  }, [latitud, longitud]); // Agregar initMap al array de dependencias

  const initMap = () => {
    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: parseFloat(latitud), lng: parseFloat(longitud) },
      zoom: 13,
    });

    // Agregar marcador
    new window.google.maps.Marker({
      position: { lat: parseFloat(latitud), lng: parseFloat(longitud) },
      map,
    });
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
                </div>
              </div>
            </div>
            <div className="row container">
              <div className="col-md-12">
                <div id="map" style={{ height: "400px", width: "100%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </BackgroundGradient>
      <Footer />
    </div>
  );
};

export default UbicacionDetalle;
