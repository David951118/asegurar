import React from "react";
import item2 from "../../Assets/Portafolio Asegurar imagenes/1.jpeg";
import item3 from "../../Assets/Portafolio Asegurar imagenes/2.jpeg";
import item4 from "../../Assets/Portafolio Asegurar imagenes/3.jpeg";
import item5 from "../../Assets/Portafolio Asegurar imagenes/4.jpeg";
import item6 from "../../Assets/Portafolio Asegurar imagenes/5.jpeg";
import item7 from "../../Assets/Portafolio Asegurar imagenes/6.jpeg";
import item8 from "../../Assets/Portafolio Asegurar imagenes/7.jpeg";
import item9 from "../../Assets/Portafolio Asegurar imagenes/8.jpeg";
import item10 from "../../Assets/Portafolio Asegurar imagenes/9.jpeg";
import item11 from "../../Assets/Portafolio Asegurar imagenes/10.jpeg";
import item12 from "../../Assets/Portafolio Asegurar imagenes/11.jpeg";
import item13 from "../../Assets/Portafolio Asegurar imagenes/12.jpeg";
import item14 from "../../Assets/Portafolio Asegurar imagenes/13.jpeg";
import item15 from "../../Assets/Portafolio Asegurar imagenes/14.jpeg";

export default function Carrusel() {
  const items = [
    // { foto: item1 },
    { foto: item2 },
    { foto: item3 },
    { foto: item4 },
    { foto: item5 },
    { foto: item6 },
    { foto: item7 },
    { foto: item8 },
    { foto: item9 },
    { foto: item10 },
    { foto: item11 },
    { foto: item12 },
    { foto: item13 },
    { foto: item14 },
    { foto: item15 }
  ];

  return (
    <div className="container">
      <div
        id="carouselExample"
        className="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="50000"
      >
        <div className="carousel-inner">
          {items.map((item, index) => (
            <div
              className={`carousel-item ${index === 0 ? "active" : ""}`}
              key={index}
            >
              <img
                src={item.foto}
                className="d-block w-100 rounded"
                alt={`Slide ${index + 1}`}
                style={{ width: "auto", height: "auto" }}
              />
            </div>
          ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}
