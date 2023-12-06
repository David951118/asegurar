import React from "react";
import Title from "../title";

export default function InfoCard({ title, paragraphs, image }) {
  const justifiedText = {
    textAlign: "justify",
    wordBreak: "break-word", // Permitir el quiebre de palabras largas
  };
  const imageStyle = {
    width: "100%",
    maxWidth: "100%",
    height: "auto",
  };
  const titleModified = {
    title: title,
    font: "45px", // Tamaño de fuente personalizado
    color: "black", // Color de texto personalizado
    level: "h2",
  };
  return (
    <div className="m-1">
      <div className="p-1">
        <Title item={titleModified} />
        {paragraphs.map((paragraph, index) => <p key={index} style={justifiedText}>{paragraph}</p> )}
        <img src={image} alt={title} style={imageStyle} />
      </div>
    </div>
  );
}
