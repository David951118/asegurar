import React from "react";

export default function Title({ item }) {
  const titleStyle = {
    fontSize: item.font, // Establece el tamaño de fuente basado en la propiedad 'font'
    textAlign: "center", // Centra el texto horizontalmente
  };

  return (
    <div className={`text-center w-100`}>
      <p style={titleStyle} className={`text-muted mb-3 text-center ${item.level}`}>{item.title}</p>
    </div>
  );
}
