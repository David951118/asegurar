import React from "react";
import item2 from "../../Assets/Portafolio Asegurar imagenes/ASEGURAR PORTAFOLIO (3)_page-0002.jpg";
import item3 from "../../Assets/Portafolio Asegurar imagenes/ASEGURAR PORTAFOLIO (3)_page-0003.jpg";
import item4 from "../../Assets/Portafolio Asegurar imagenes/ASEGURAR PORTAFOLIO (3)_page-0004.jpg";
import item5 from "../../Assets/Portafolio Asegurar imagenes/ASEGURAR PORTAFOLIO (3)_page-0005.jpg";
import item6 from "../../Assets/Portafolio Asegurar imagenes/ASEGURAR PORTAFOLIO (3)_page-0006.jpg";
import item7 from "../../Assets/Portafolio Asegurar imagenes/ASEGURAR PORTAFOLIO (3)_page-0007.jpg";
import item8 from "../../Assets/Portafolio Asegurar imagenes/ASEGURAR PORTAFOLIO (3)_page-0008.jpg";
import item9 from "../../Assets/Portafolio Asegurar imagenes/ASEGURAR PORTAFOLIO (3)_page-0009.jpg";
import item10 from "../../Assets/Portafolio Asegurar imagenes/ASEGURAR PORTAFOLIO (3)_page-0010.jpg";
import item11 from "../../Assets/Portafolio Asegurar imagenes/ASEGURAR PORTAFOLIO (3)_page-0011.jpg";
import item12 from "../../Assets/Portafolio Asegurar imagenes/ASEGURAR PORTAFOLIO (3)_page-0012.jpg";
import item13 from "../../Assets/Portafolio Asegurar imagenes/ASEGURAR PORTAFOLIO (3)_page-0013.jpg";
import item14 from "../../Assets/Portafolio Asegurar imagenes/ASEGURAR PORTAFOLIO (3)_page-0014.jpg";
import item15 from "../../Assets/Portafolio Asegurar imagenes/ASEGURAR PORTAFOLIO (3)_page-0015.jpg";
import item16 from "../../Assets/Portafolio Asegurar imagenes/ASEGURAR PORTAFOLIO (3)_page-0016.jpg";
import item17 from "../../Assets/Portafolio Asegurar imagenes/ASEGURAR PORTAFOLIO (3)_page-0017.jpg";
import item18 from "../../Assets/Portafolio Asegurar imagenes/ASEGURAR PORTAFOLIO (3)_page-0018.jpg";

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
    { foto: item15 },
    { foto: item16 },
    { foto: item17 },
    { foto: item18 },
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
