import React from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function Noticia({ noticia, onClick }) {
  const renderElement = (element) => {
    switch (element.tipo) {
      case "titulo":
        return <h4 className="blog-content-h4">{element.texto}</h4>;

      case "subtitulo":
        return <h5 className="blog-content-h5">{element.texto}</h5>;

      case "parrafo":
        return <p className="blog-content-p">{element.texto}</p>;

      case "imagen":
        return (
          <figure className="blog-content-figure">
            <img src={element.url} alt={element.alt} className="blog-content-img" />
            {element.caption && <figcaption>{element.caption}</figcaption>}
          </figure>
        );

      case "galeria":
        return (
          <div className="blog-content-gallery">
            {element.imagenes.map((img, idx) => (
              <figure key={idx} className="blog-content-gallery-item">
                <img src={img.url} alt={img.alt} />
                {img.caption && <figcaption>{img.caption}</figcaption>}
              </figure>
            ))}
          </div>
        );

      case "cita":
        return (
          <blockquote className="blog-content-quote">
            <p>{element.texto}</p>
            {element.autor && <cite>— {element.autor}</cite>}
          </blockquote>
        );

      case "datos":
        return (
          <div className="blog-content-stats">
            {element.items.map((it, idx) => (
              <div key={idx} className="blog-content-stat">
                <span className="num">{it.valor}</span>
                <span className="lbl">{it.etiqueta}</span>
              </div>
            ))}
          </div>
        );

      case "destacado":
        return (
          <div className="blog-content-callout">
            {element.icono && <span className="ic">{element.icono}</span>}
            <p>{element.texto}</p>
          </div>
        );

      case "link":
        return (
          <a className="blog-content-link" href={element.texto} target="_blank" rel="noreferrer">
            {element.label || element.texto}
          </a>
        );

      case "lista":
        return (
          <ul className="blog-content-list">
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
      <article className="blog-post">
        {noticia.categoria && (
          <span className="blog-post-cat">{noticia.categoria}</span>
        )}
        <h2 className="blog-post-title">{noticia.titulo}</h2>
        {noticia.titulo2 && <p className="blog-post-subtitle">{noticia.titulo2}</p>}

        <div className="blog-post-meta">
          <span className="blog-post-author">
            <i className="pi pi-user" /> {noticia.creador}
          </span>
          <span className="blog-post-dot">•</span>
          <span><i className="pi pi-calendar" /> {noticia.fecha}</span>
          {noticia.lectura && (
            <>
              <span className="blog-post-dot">•</span>
              <span><i className="pi pi-clock" /> {noticia.lectura} de lectura</span>
            </>
          )}
        </div>

        {noticia.portada && (
          <figure className="blog-post-cover">
            <img src={noticia.portada} alt={noticia.titulo} />
          </figure>
        )}

        <div className="blog-post-body">
          {noticia.contenido.map((element, index) => (
            <React.Fragment key={index}>{renderElement(element)}</React.Fragment>
          ))}
        </div>

        {noticia.tags && noticia.tags.length > 0 && (
          <div className="blog-post-tags">
            {noticia.tags.map((t, i) => (
              <span key={i} className="blog-post-tag">#{t}</span>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}
