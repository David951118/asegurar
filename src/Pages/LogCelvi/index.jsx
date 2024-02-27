import React from "react";
import Title from "../../Components/title";
import BackgroundGradient from "../../Components/background";
import Footer from "../../Components/footer";
import YouTubePlayer from "../../Components/youtubePlayer";
import imageDescription from "../../Assets/Foto Portada/cellvi.jpg";

export default function LogCelvi() {
  const videoContacto = "https://youtu.be/anZdB5xSGWY?si=nLihplX2q-_kZjzJ.";
  let info = {
    title: "Login CELLVI",
    titleDescription:
      "Plataforma CELLVI: Central Especializada de Logistica y, Localizacion Vehicular Internacional ",
  };
  const imageHeaderStyle = {
    height: "auto",
  };

  const titleSecond = {
    title: "Como Ingresar",
    font: "40px", // Tamaño de fuente personalizado
    color: "grey", // Color de texto personalizado
    level: "h2",
  };

  const titleThirt = {
    title: "Ingresa aqui",
    font: "40px", // Tamaño de fuente personalizado
    color: "grey", // Color de texto personalizado
    level: "h2",
  };

  return (
    <div>
      <BackgroundGradient color1="#fff" color2="#fff">
        <div className="w-100">
          <div>
            <img
              src={imageDescription}
              alt="Quienes_somos"
              style={imageHeaderStyle}
              className="img-fluid"
            />
          </div>
          <div className="p-3 container justify-content-center">
            <div className="p-lg-5 mx-auto text-center row">
              <h1 className="display-3 fw-bold text-center">{info.title}</h1>
              <h3 className="fw-normal text-muted mb-3 text-center">
                {info.titleDescription}
              </h3>
            </div>
          </div>
          <div className="conatiner-fluid text-center miniaqua--marker">
            <Title item={titleSecond} />
          </div>
          <div className="p-3 container justify-content-center">
            <div className="p-lg-3 mx-auto row">
              <div className="col-md-6 pt-4 bg-body rounded">
                <div className="bg-light rounded text-center">
                  <div
                    className="mb-3"
                    style={{ maxWidth: "100%", height: "auto" }}
                  >
                    <YouTubePlayer url={videoContacto} />
                  </div>
                  <hr />
                </div>
              </div>
              <div className="col-md-6 py-4 p-3 mb-5 bg-body rounded">
                <div className="card">
                  <div className="card-body p-4">
                    <Title item={titleThirt} />
                    <iframe
                      title="Login Cellvi"
                      src="https://cellviweb.asegurar.com.co"
                      width="100%"
                      height="400"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BackgroundGradient>
      <Footer />
    </div>
  );
}
