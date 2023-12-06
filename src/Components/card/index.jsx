import React from "react";

export default function Card({ item }) {
  const cardStyle = {
    width: "155px",
    height: "240px",
  };

  const imgStyle = {
    height: "100px",
  };

  return (
    <div className="card text-reset fw-bold m-2 w-50 center-items" style={cardStyle}>
      <a href={item.link} target="_blank" rel="noopener noreferrer" className="d-flex center-items">
        <img className="img-fluid  mx-auto" src={item.src} alt={item.title} style={imgStyle} />
      </a>
      <div className="card-body text-center">
        <p className="card-text">{item.title}</p>
      </div>
    </div>
  );
}