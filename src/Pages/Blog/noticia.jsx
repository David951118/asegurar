import React from "react";

export default function Noticia({ noticia, onClick }) {
  const renderElement = (element) => {
    switch (element.tipo) {
      case "titulo":
        return <h4>{element.texto}</h4>;
      case "parrafo":
        return <p>{element.texto}</p>;
      case "imagen":
        return (
          <img src={element.url} alt={element.alt} className="img img-fluid" />
        );
      case "lista":
        return (
          <ul>
            {element.textos.map((texto, idx) => (
              <li key={idx}>{texto}</li>
            ))}
          </ul>
        );
      // Agrega más casos según sea necesario para otros tipos de contenido
      default:
        return null;
    }
  };

  return (
    <div onClick={onClick}>
      <h3 className="pb-4 mb-4 fst-italic border-bottom">{noticia.titulo2}</h3>
      <article className="blog-post">
        <h2 className="display-5 link-body-emphasis mb-1">{noticia.titulo}</h2>
        <p className="blog-post-meta">
          {noticia.fecha} por
          <strong> {noticia.creador}</strong>
        </p>
        {noticia.contenido.map((element, index) => (
          <div key={index}>{renderElement(element)}</div>
        ))}
      </article>
      <hr />
    </div>
  );
}
