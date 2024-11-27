import React from "react";
import { MDBCarousel, MDBCarouselItem } from "mdb-react-ui-kit";

export default function Carousel({ item }) {
  return (
    <MDBCarousel
      showControls
      fade
      interval={6000}
      keyboard
      showIndicators
      touch
      dark
    >
      {item.map((item) => (
        <MDBCarouselItem
          className="img-fluid"
          itemId={item.id}
          key={item.id}
          src={item.image}
        >
          {/* <button className="btn btn-primary">Conocer mas</button> */}
        </MDBCarouselItem>
      ))}
    </MDBCarousel>
  );
}
