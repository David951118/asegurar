import React, { useState, useEffect } from "react";
import Portafolio from "./Portafolio";
import AtencionImg from "../../Assets/Tarjetas de servicios/atencion.jpg";
import ServicioImg from "../../Assets/Tarjetas de servicios/servicio.jpg";
import EquipoImg from "../../Assets/Tarjetas de servicios/equipo.jpg";
import GarantiaImg from "../../Assets/Tarjetas de servicios/garantia.jpg";
import UniversalidadImg from "../../Assets/Tarjetas de servicios/universalidad.png";
import ResponsabilidadImg from "../../Assets/Tarjetas de servicios/responsabilidad.jpg";
import AmabilidadImg from "../../Assets/Tarjetas de servicios/amabilidad.jpg";
import RapidezImg from "../../Assets/Tarjetas de servicios/rapidez.jpg";

export default function Services() {
  const [expandedBar, setExpandedBar] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 425);
  const [autoChange, setAutoChange] = useState(true);

  const barsData = [
    {
      letra: "A",
      color: "#fff",
      titulo: "Atención",
      foto: AtencionImg,
      descripcion:
        "Brindamos atención personalizada y dedicada a cada cliente, asegurándonos de satisfacer sus necesidades de manera excepcional.",
    },
    {
      letra: "S",
      color: "#0051a8",
      titulo: "Servicio",
      foto: ServicioImg,
      descripcion:
        "Nuestros servicios están diseñados para superar las expectativas, ofreciendo soluciones eficientes y de alta calidad.",
    },
    {
      letra: "E",
      color: "#fff",
      titulo: "Equipo de trabajo",
      foto: EquipoImg,
      descripcion:
        "Somos un equipo de trabajo, que trabaja en equipo, para la consecucion de nuestros objetivos estrategicos.",
    },
    {
      letra: "G",
      color: "#fff",
      titulo: "Garantía",
      foto: GarantiaImg,
      descripcion:
        "Ofrecemos garantías sólidas para brindar tranquilidad a los usuarios, respaldando la calidad de nuestros productos y servicios.",
    },
    {
      letra: "U",
      color: "#fff",
      titulo: "Universalidad",
      foto: UniversalidadImg,
      descripcion:
        "Nos esforzamos por ser universalmente accesibles, proporcionando soluciones que satisfagan las necesidades de los usuarios.",
    },
    {
      letra: "R",
      color: "#fff",
      titulo: "Responsabilidad",
      foto: ResponsabilidadImg,
      descripcion:
        "Nos comprometemos con la responsabilidad en todas nuestras acciones y decisiones, guiados por la transparencia y la ética empresarial.",
    },
    {
      letra: "A",
      color: "#fff",
      titulo: "Amabilidad",
      foto: AmabilidadImg,
      descripcion:
        "La amabilidad está en el corazón de nuestra empresa, creando un ambiente cálido y acogedor para nuestros clientes.",
    },
    {
      letra: "R",
      color: "#fff",
      titulo: "Rapidez",
      foto: RapidezImg,
      descripcion:
        "Nos destacamos por nuestra rapidez y oportunidad para proporcionar soluciones eficientes, ahorrando tiempo valioso a nuestros clientes.",
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 425);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleBarClick = (index) => {
    setExpandedBar(index);
    setAutoChange(false); // Detener el cambio automático cuando el usuario interactúa
    setTimeout(() => {
      setAutoChange(true); // Reiniciar el cambio automático después de 5 segundos
    }, 5000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (autoChange) {
        setExpandedBar((prevIndex) => (prevIndex + 1) % barsData.length);
      }
    }, 5000); // Cambiar automáticamente cada 5 segundos

    return () => clearInterval(interval);
  }, [autoChange, barsData.length]);

  return !isMobile ? (
    <div>
      <div className="aqua--marker">
        <div className="container align-items-center d-flex custom-pointer p-5">
          {barsData.map((bar, index) => (
            <div
              key={index}
              className="col"
              onClick={() => handleBarClick(index)}
            >
              <div className="w-100 d-flex align-items-center">
                <div className="letra-circle-container">
                  <div
                    className={`letra-circle ${
                      expandedBar === index ? "selected" : ""
                    }`}
                  >
                    {bar.letra}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="container d-flex p-1">
          <div className="card mb-3 bg-transparent">
            <div className="row g-0">
              <div className="col-md-4 img-container--service">
                <img
                  src={barsData[expandedBar].foto}
                  alt={barsData[expandedBar].titulo}
                  className="img-fluid--service rounded-start"
                />
              </div>
              <div className="col-md-8">
                <div className="aling-items-center m-3">
                  <p className="letra-carta-titulo text-center">
                    {barsData[expandedBar].titulo}
                  </p>
                  <p className="letra-carta-texto">
                    {barsData[expandedBar].descripcion}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Portafolio />
    </div>
  ) : (
    <div>
      <Portafolio />
    </div>
  );
}
