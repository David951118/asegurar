import React from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

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
      case "link":
        return <a href={element.texto}>{element.texto}</a>;
      case "lista":
        return (
          <ul>
            {element.textos.map((texto, idx) => (
              <li key={idx}>{texto}</li>
            ))}
          </ul>
        );
      case "pdf":
        return (
          <div style={{ height: "750px" }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer fileUrl={element.texto} />
            </Worker>
          </div>
        );
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
