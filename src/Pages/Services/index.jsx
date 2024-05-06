import React, { useState, useEffect } from "react";
import Portafolio from "./portafolio";
// import AtencionImg from "../../Assets/Tarjetas de servicios/atencion.jpg";
// import ServicioImg from "../../Assets/Tarjetas de servicios/servicio.jpg";
// import EquipoImg from "../../Assets/Tarjetas de servicios/equipo.jpg";
// import GarantiaImg from "../../Assets/Tarjetas de servicios/garantia.jpg";
// import UniversalidadImg from "../../Assets/Tarjetas de servicios/universalidad.png";
// import ResponsabilidadImg from "../../Assets/Tarjetas de servicios/responsabilidad.jpg";
// import AmabilidadImg from "../../Assets/Tarjetas de servicios/amabilidad.jpg";
// import RapidezImg from "../../Assets/Tarjetas de servicios/rapidez.jpg";
// Ajustar fotos del carrusel

export default function Services() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 425);
  // const barsData = [
  //   {
  //     letra: "A",
  //     color: "#fff",
  //     titulo: "Atención",
  //     foto: AtencionImg,
  //     descripcion:
  //       "Brindamos atención personalizada y dedicada a cada cliente, asegurándonos de satisfacer sus necesidades de manera excepcional.",
  //   },
  //   {
  //     letra: "S",
  //     color: "#0051a8",
  //     titulo: "Servicio",
  //     foto: ServicioImg,
  //     descripcion:
  //       "Nuestros servicios están diseñados para superar las expectativas, ofreciendo soluciones eficientes y de alta calidad.",
  //   },
  //   {
  //     letra: "E",
  //     color: "#fff",
  //     titulo: "Equipo de trabajo",
  //     foto: EquipoImg,
  //     descripcion:
  //       "Somos un equipo de trabajo, que trabaja en equipo, para la consecucion de nuestros objetivos estrategicos.",
  //   },
  //   {
  //     letra: "G",
  //     color: "#fff",
  //     titulo: "Garantía",
  //     foto: GarantiaImg,
  //     descripcion:
  //       "Ofrecemos garantías sólidas para brindar tranquilidad a los usuarios, respaldando la calidad de nuestros productos y servicios.",
  //   },
  //   {
  //     letra: "U",
  //     color: "#fff",
  //     titulo: "Universalidad",
  //     foto: UniversalidadImg,
  //     descripcion:
  //       "Nos esforzamos por ser universalmente accesibles, proporcionando soluciones que satisfagan las necesidades de los usuarios.",
  //   },
  //   {
  //     letra: "R",
  //     color: "#fff",
  //     titulo: "Responsabilidad",
  //     foto: ResponsabilidadImg,
  //     descripcion:
  //       "Nos comprometemos con la responsabilidad en todas nuestras acciones y decisiones, guiados por la transparencia y la ética empresarial.",
  //   },
  //   {
  //     letra: "A",
  //     color: "#fff",
  //     titulo: "Amabilidad",
  //     foto: AmabilidadImg,
  //     descripcion:
  //       "La amabilidad está en el corazón de nuestra empresa, creando un ambiente cálido y acogedor para nuestros clientes.",
  //   },
  //   {
  //     letra: "R",
  //     color: "#fff",
  //     titulo: "Rapidez",
  //     foto: RapidezImg,
  //     descripcion:
  //       "Nos destacamos por nuestra rapidez y oportunidad para proporcionar soluciones eficientes, ahorrando tiempo valioso a nuestros clientes.",
  //   },
  // ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 425);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return !isMobile ? (
    <div className="aqua--marker">
      {/* <div className="container text-center">
        <div className="container--service-prop">
          {barsData.map((item, idx) => (
            <div className="service--prop-item" key={idx}>
              <span className="letter">{item.letra}</span>
              <div className="title--service">{item.titulo}</div>
              <div className="description--service">{item.descripcion}</div>
            </div>
          ))}
        </div>
      </div> */}
      <Portafolio />
    </div>
  ) : (
    <div>
      <Portafolio />
    </div>
  );
}
