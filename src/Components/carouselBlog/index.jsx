import React from "react";
import { MDBCarousel, MDBCarouselItem } from "mdb-react-ui-kit";

export default function CarouselBlog({ item }) {
  return (
    <MDBCarousel
      showControls
      fade
      interval={4000}
      keyboard
      showIndicators
      touch
      dark
    >
      {item.map((item, index) => (
        <MDBCarouselItem key={index}>
          <div className="col-md-6">
            <div className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250">
              <div className="col p-4 d-flex flex-column position-static">
                <strong className="d-inline-block mb-2 text-primary-emphasis">
                  Empresarial
                </strong>
                <h3 className="mb-0">{item.title}</h3>
                <div className="mb-1 text-body-secondary">{item.fecha}</div>
                <p className="card-text mb-auto">{item.resumen1}</p>
                <a
                  href="Nocitia"
                  className="icon-link gap-1 icon-link-hover stretched-link"
                >
                  Continuar leyendo
                  <svg className="bi">
                    <use href="#chevron-right"></use>
                  </svg>
                </a>
              </div>
              <div className="col-auto d-none d-lg-block">
                <img
                  alt="Thumbnail"
                  src={item.minifoto}
                  width="200"
                  height="200"
                  className="bd-placeholder-img m-4 border"
                />
              </div>
            </div>
          </div>
        </MDBCarouselItem>
      ))}
    </MDBCarousel>
  );
}
