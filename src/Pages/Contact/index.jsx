import React from "react";
import Title from "../../Components/title";
import BackgroundGradient from "../../Components/background";
import Footer from "../../Components/footer";
import YouTubePlayer from "../../Components/youtubePlayer";
import Map from "../../Components/map";
import PlanCard from "../../Components/planCard";
import planImage from "../../Assets/Planes/1.jpg";
import planImage2 from "../../Assets/Planes/2.jpg";
import planImage3 from "../../Assets/Planes/3.jpg";
import planImage4 from "../../Assets/Planes/4.jpg";
import planImage5 from "../../Assets/Planes/5.jpg";
import planImage6 from "../../Assets/Planes/6.jpg";
import imageDescription from "../../Assets/Foto Portada/1.jpg"; //todo marca de agua falta enviaro

export default function Contact() {
  const videoContacto =
    "https://www.youtube.com/watch?v=mgg9wt_Pll0&ab_channel=ASEGURARLTDA.";
  let info = {
    title: "Contacto",
    titleDescription:
      "Llámanos, escríbenos o visítanos, estaremos encantados de atenderte.",
  };
  const imageHeaderStyle = {
    height: "auto",
  };
  const title = {
    title: "Nuestros planes",
    font: "48px", // Tamaño de fuente personalizado
    color: "grey", // Color de texto personalizado
    level: "h2",
  };
  const titleSecond = {
    title: "Como llegar",
    font: "48px", // Tamaño de fuente personalizado
    color: "grey", // Color de texto personalizado
    level: "h2",
  };
  const titlethirt = {
    title: "Ponte en contacto",
    font: "35px", // Tamaño de fuente personalizado
    color: "grey", // Color de texto personalizado
    level: "h2",
  };
  const aliados = [
    {
      src: planImage,
      title: "PLAN PREMIUM:",
      description:
        "Compra de equipo de transmisión de datos, mano obra, accesorios de instalación y año de servicio prepago",
      mensaje: "Necesito asesoria sobre el Plan Premium",
    },
    {
      src: planImage2,
      title: "PLAN ESTÁNDAR",
      description:
        "Compra de equipo de transmisión de datos, mano de obra y accesorios de instalación y servicio de monitoreo mes prepago.",
      mensaje: "Necesito asesoria sobre el Plan Standar",
    },
    {
      src: planImage3,
      title: "PLAN CON EQUIPO EN COMODATO",
      description:
        "ASEGURAR LTDA, suministra equipo de transmisión de datos en comodato, mano obra, accesorios de instalación y año de servicio prepago.",
      mensaje: "Necesito asesoria sobre el Plan con equipo en comodato",
    },
    {
      src: planImage4,
      title: "PLAN HOMOLOGACION DE EQUIPO DE DATOS",
      description:
        "Cuando el vehículo tiene instalado un equipo de transmisión de datos con otras empresas de monitoreo, si la unidad es compatible con nuestra plataforma, se reprograma y queda vinculada a la red de ASEGURAR LTDA.",
      mensaje:
        "Necesito asesoria sobre el Plan homologacion de equipo de datos",
    },
    {
      src: planImage5,
      title: "PLANES SERVICIOS ESPECIALES",
      description:
        "Cuando se requiere la instalación de accesorios adicionales para monitoreo de carro tanques, grúas, volquetas, furgones, maquinaria amarilla",
      mensaje: "Necesito asesoria sobre el Plan de servicios especiales",
    },
    {
      src: planImage6,
      title: "Contacta con nuestro asesor",
      description: "Click para informacion de los planes",
      mensaje:
        "Necesito hablar con un asesor",
    },
  ];

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
            <div className="p-lg-6 mx-auto text-center row">
              <h1 className="display-3 fw-bold text-center">{info.title}</h1>
              <h3 className="fw-normal text-muted mb-3 text-center">
                {info.titleDescription}
              </h3>
              <div className="d-flex gap-3 justify-content-center lead fw-normal">
                <a className="btn btn-secondary icon-link" href="#planes">
                  Planes
                </a>
                <a className="btn btn-secondary icon-link" href="#contacto">
                  Contacto
                </a>
              </div>
            </div>
            <div
              className="p-lg-3 mx-auto row justify-content-center"
              id="planes"
            >
              <div className="mt-3">
                <Title item={title} />
                <div className="row">
                  {aliados.map((item, index) => (
                    <div key={index} className="col-md-6 mb-3">
                      <PlanCard
                        title={item.title}
                        description={item.description}
                        image={item.src}
                        mensaje={item.mensaje}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="conatiner-fluid text-center miniaqua--marker">
            <Title item={titleSecond} />
          </div>
          <div className="p-3 container justify-content-center" id="contacto">
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
                  <div
                    className="mt-3 mb-3"
                    style={{ maxWidth: "100%", height: "auto" }}
                  >
                    <Map />
                  </div>
                </div>
              </div>
              <div className="col-md-6 py-4 p-3 mb-5 bg-body rounded">
                <form id="contactForm" className="shadow p-3">
                  <Title item={titlethirt} />
                  <div className="mb-3">
                    <label className="form-label" htmlFor="name">
                      Nombre
                    </label>
                    <input
                      className="form-control"
                      id="name"
                      type="text"
                      placeholder="Nombre"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="emailAddress">
                      Direccion de email
                    </label>
                    <input
                      className="form-control"
                      id="emailAddress"
                      type="email"
                      placeholder="Email"
                    />
                  </div>

                  <div className="mb-3 ">
                    <label className="form-label text-start" htmlFor="message">
                      Mensaje
                    </label>
                    <textarea
                      className="form-control"
                      id="message"
                      type="text"
                      placeholder="Mensaje"
                      style={{ height: "10rem" }}
                    ></textarea>
                  </div>

                  <div className="d-grid">
                    <button className="btn btn-primary btn-lg" type="submit">
                      Enviar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </BackgroundGradient>
      <Footer />
    </div>
  );
}
