import React, { useState, useEffect } from "react";
import Portafolio from "./portafolio"; //todo cambar la p por P

export default function Services() {
  const [expandedBar, setExpandedBar] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 425);

  const barsData = [
    {
      letra: "A",
      color: "#fff",
      titulo: "Atención",
      foto: "https://cdn.pixabay.com/photo/2022/08/09/03/10/call-center-7374023_640.png",
      descripcion:
        "Brindamos atención personalizada y dedicada a cada cliente, asegurándonos de satisfacer sus necesidades de manera excepcional.",
    },
    {
      letra: "S",
      color: "#0051a8",
      titulo: "Servicio",
      foto: "https://media.licdn.com/dms/image/C4E12AQE7YmyCussFTg/article-cover_image-shrink_600_2000/0/1531828200432?e=2147483647&v=beta&t=EbzglSexGNFoVwQUsgds0PPPi6H0HdlVrP7RccvZN5I",
      descripcion:
        "Nuestros servicios están diseñados para superar las expectativas, ofreciendo soluciones eficientes y de alta calidad.",
    },
    {
      letra: "E",
      color: "#fff",
      titulo: "Experiencia",
      foto: "https://cdn-icons-png.flaticon.com/512/4814/4814852.png",
      descripcion:
        "Creamos una experiencia única para cada cliente, garantizando momentos memorables en cada interacción.",
    },
    {
      letra: "G",
      color: "#fff",
      titulo: "Garantía",
      foto: "https://static.vecteezy.com/system/resources/previews/011/654/817/original/warranty-icon-transparent-warranty-free-png.png",
      descripcion:
        "Ofrecemos garantías sólidas para brindar tranquilidad a nuestros clientes, respaldando la calidad de nuestros productos y servicios.",
    },
    {
      letra: "U",
      color: "#fff",
      titulo: "Universalidad",
      foto: "https://cdn-icons-png.flaticon.com/512/2051/2051943.png",
      descripcion:
        "Nos esforzamos por ser universalmente accesibles, proporcionando soluciones que benefician a diversos públicos.",
    },
    {
      letra: "R",
      color: "#fff",
      titulo: "Responsabilidad",
      foto: "https://cdn-icons-png.flaticon.com/512/2654/2654572.png",
      descripcion:
        "Nos comprometemos con la responsabilidad en todas nuestras acciones y decisiones, guiados por la transparencia y la ética empresarial.",
    },
    {
      letra: "A",
      color: "#fff",
      titulo: "Amabilidad",
      foto: "https://images.vexels.com/media/users/3/158040/isolated/preview/ceb5cf4a02d45fa49dc671e7d2014c32-icono-de-trazo-de-apreton-de-manos.png",
      descripcion:
        "La amabilidad está en el corazón de nuestra empresa, creando un ambiente cálido y acogedor para nuestros clientes.",
    },
    {
      letra: "R",
      color: "#fff",
      titulo: "Rapidez",
      foto: "https://images.vexels.com/media/users/3/205237/isolated/preview/ed7b0a564fc695b0b91c4ac1276c661d-icono-de-trazo-de-servicio-al-cliente.png",
      descripcion:
        "Nos destacamos por nuestra rapidez en proporcionar soluciones eficientes, ahorrando tiempo valioso a nuestros clientes.",
    },
  ];

  const handleBarClick = (index) => {
    setExpandedBar(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Cambiar automáticamente cada 5 segundos
      setExpandedBar((prevIndex) => (prevIndex + 1) % barsData.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [barsData.length]);

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
              <div className="col-md-4 p-4">
                <img
                  src={barsData[expandedBar].foto}
                  alt={barsData[expandedBar].titulo}
                  className="img-fluid rounded-start"
                />
              </div>
              <div className="col-md-8">
                <div className="aling-items-center">
                  <p className="letra-carta-titulo text-center mb-4">
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
