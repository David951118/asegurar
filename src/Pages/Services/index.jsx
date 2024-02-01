import React, { useState, useEffect } from "react";
import Footer from "../../Components/footer";
import Portafolio from "./portafolio";

export default function Services() {
  const [expandedBar, setExpandedBar] = useState(0);

  const barsData = [
    {
      letra: "A",
      color: "#fff",
      titulo: "Atención",
      foto: "",
      descripcion:
        "Brindamos atención personalizada y dedicada a cada cliente, asegurándonos de satisfacer sus necesidades de manera excepcional.",
    },
    {
      letra: "S",
      color: "#0051a8",
      titulo: "Servicio",
      foto: "",
      descripcion:
        "Nuestros servicios están diseñados para superar las expectativas, ofreciendo soluciones eficientes y de alta calidad.",
    },
    {
      letra: "E",
      color: "#fff",
      titulo: "Experiencia",
      foto: "",
      descripcion:
        "Creamos una experiencia única para cada cliente, garantizando momentos memorables en cada interacción.",
    },
    {
      letra: "G",
      color: "#fff",
      titulo: "Garantía",
      foto: "",
      descripcion:
        "Ofrecemos garantías sólidas para brindar tranquilidad a nuestros clientes, respaldando la calidad de nuestros productos y servicios.",
    },
    {
      letra: "U",
      color: "#fff",
      titulo: "Universalidad",
      foto: "",
      descripcion:
        "Nos esforzamos por ser universalmente accesibles, proporcionando soluciones que benefician a diversos públicos.",
    },
    {
      letra: "R",
      color: "#fff",
      titulo: "Responsabilidad",
      foto: "",
      descripcion:
        "Nos comprometemos con la responsabilidad en todas nuestras acciones y decisiones, guiados por la transparencia y la ética empresarial.",
    },
    {
      letra: "A",
      color: "#fff",
      titulo: "Amabilidad",
      foto: "",
      descripcion:
        "La amabilidad está en el corazón de nuestra empresa, creando un ambiente cálido y acogedor para nuestros clientes.",
    },
    {
      letra: "R",
      color: "#fff",
      titulo: "Rapidez",
      foto: "",
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

  return (
    <div>
      <div
        // style={{
        //   backgroundImage:
        //     "linear-gradient(135deg, rgba(255, 255, 255, 0.57) 34%, rgba(230, 245, 182, 0.48) 95%)",
        // }}
        className="aqua--marker"
      >
        <div className="container align-items-center d-flex custom-pointer">
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
                  src="https://mdbcdn.b-cdn.net/wp-content/uploads/2020/06/vertical.webp"
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
      <Footer />
    </div>
  );
}
