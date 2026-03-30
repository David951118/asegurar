import { useState, useEffect } from "react";
import Noticia from "./noticia";
import fotoCliente1 from "../../Assets/iconsEnter/Coopsetrans.png";
import fotoCliente2 from "../../Assets/iconsEnter/Samy-Salud-png.png";
import fotoCliente3 from "../../Assets/iconsEnter/Lacteos Santa Maria png.png";
import chucunes from "../../Assets/blog/chucunes.jpeg";
import chucunesinseguro from "../../Assets/blog/inseguridad_0_1.jpeg";
import fotoApp from "../../Assets/Foto Portada/cellvi.jpg";
import lanchaVertial from "../../Assets/blog/lanchavertical.jpeg";
import lanchaHorizontal from "../../Assets/blog/lanchaHorizontal.jpeg";
import reunionSeguridadVial from "../../Assets/blog/policia.jpeg";
import reunionMesaTrabajo from "../../Assets/blog/policia2.jpeg";
import reunionRistra from "../../Assets/blog/portadapolicia.jpeg";
import policiaRistra from "../../Assets/blog/ereunion.jpeg";

const styles = `
  .blog-page { background: #f8fafc; min-height: 100vh; }

  /* Hero */
  .blog-hero {
    background: linear-gradient(135deg, #0a2d6e 0%, #1565c0 60%, #42a5f5 100%);
    padding: 72px 0 48px; color: #fff; text-align: center;
  }
  .blog-hero-tag {
    display: inline-block; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3);
    border-radius: 999px; padding: 5px 16px; font-size: 0.78rem; font-weight: 700;
    letter-spacing: 1px; text-transform: uppercase; margin-bottom: 14px;
  }
  .blog-hero h1 { font-size: clamp(2rem,4vw,2.8rem); font-weight: 900; margin: 0 0 12px; }
  .blog-hero p { color: rgba(255,255,255,0.75); font-size: 1rem; max-width: 600px; margin: 0 auto; line-height: 1.65; }

  /* Featured cards */
  .blog-featured { padding: 40px 0; }
  .blog-featured-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  @media (max-width: 768px) { .blog-featured-grid { grid-template-columns: 1fr; } }
  .blog-feat-card {
    background: #fff; border-radius: 14px; overflow: hidden; cursor: pointer;
    box-shadow: 0 3px 16px rgba(0,0,0,0.06); border: 1px solid #e8eef5;
    display: flex; transition: all 0.3s;
  }
  .blog-feat-card:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(21,101,192,0.1); border-color: #bbdefb; }
  .blog-feat-card img { width: 140px; min-height: 100%; object-fit: cover; flex-shrink: 0; }
  @media (max-width: 576px) { .blog-feat-card img { width: 100px; } }
  .blog-feat-body { padding: 16px 18px; }
  .blog-feat-tag {
    display: inline-block; background: #e3f0ff; color: #1565c0;
    border-radius: 6px; padding: 2px 10px; font-size: 0.72rem; font-weight: 700;
    text-transform: uppercase; margin-bottom: 6px;
  }
  .blog-feat-body h3 { font-size: 0.95rem; font-weight: 800; color: #0a2d6e; margin: 0 0 4px; line-height: 1.35; }
  .blog-feat-body .date { font-size: 0.78rem; color: #999; margin: 0 0 6px; }
  .blog-feat-body p { font-size: 0.84rem; color: #666; margin: 0; line-height: 1.5;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

  /* Main content */
  .blog-main { padding: 0 0 60px; }
  .blog-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 32px; align-items: start; }
  @media (max-width: 992px) { .blog-layout { grid-template-columns: 1fr; } }

  .blog-article-card {
    background: #fff; border-radius: 14px; padding: 32px 28px;
    box-shadow: 0 3px 16px rgba(0,0,0,0.06); border: 1px solid #e8eef5;
  }
  .blog-nav-row { display: flex; gap: 10px; margin-top: 20px; }
  .blog-nav-btn {
    padding: 8px 20px; border-radius: 8px; font-size: 0.85rem; font-weight: 700;
    cursor: pointer; transition: all 0.2s; border: 1.5px solid #ddd; background: #fff; color: #444;
  }
  .blog-nav-btn:hover:not(:disabled) { border-color: #1565c0; color: #1565c0; background: #e3f0ff; }
  .blog-nav-btn:disabled { opacity: 0.4; cursor: default; }

  /* Sidebar */
  .blog-sidebar { position: sticky; top: 80px; }
  .blog-sidebar-card {
    background: #fff; border-radius: 14px; padding: 22px 20px;
    box-shadow: 0 3px 16px rgba(0,0,0,0.06); border: 1px solid #e8eef5;
    margin-bottom: 20px;
  }
  .blog-sidebar-card h4 { font-size: 0.95rem; font-weight: 800; color: #0a2d6e; margin: 0 0 14px; }
  .blog-sidebar-card p { font-size: 0.88rem; color: #666; line-height: 1.6; }
  .blog-testimonial {
    display: flex; gap: 12px; align-items: flex-start;
    padding: 14px 0; border-top: 1px solid #f0f0f0;
  }
  .blog-testimonial:first-of-type { border-top: none; padding-top: 0; }
  .blog-testimonial img {
    width: 48px; height: 48px; object-fit: contain; border-radius: 8px;
    border: 1px solid #e8eef5; flex-shrink: 0; padding: 4px;
  }
  .blog-testimonial h5 { font-size: 0.82rem; font-weight: 800; color: #0a2d6e; margin: 0 0 3px; }
  .blog-testimonial p { font-size: 0.8rem; color: #666; margin: 0; line-height: 1.5; }
`;

const noticia = [
  {
    titulo: "ASEGURAR LTDA. SE INTEGRA AL SISTEMA RISTRA",
    titulo2: "Un paso más hacia la seguridad vial inteligente",
    fecha: "28 Mayo 2024", resumen1: "La empresa ASEGURAR LTDA. fue integrada al Registro Integral de Seguridad en el Transporte (RISTRA), en colaboración con autoridades de tránsito del Departamento de Policía Nariño.",
    minifoto: reunionRistra, creador: "Romulo Bolaños",
    contenido: [
      { tipo: "parrafo", texto: "El pasado 28 de mayo de 2024, en las instalaciones de ASEGURAR LTDA., se llevó a cabo una importante reunión con los directivos del RISTRA (Registro Integral de Seguridad en el Transporte), con el objetivo de integrar a nuestra empresa en esta plataforma tecnológica de alto impacto para la seguridad vial." },
      { tipo: "parrafo", texto: "El encuentro contó con la participación de destacados miembros de la Dirección de Transportes y Tránsito del Departamento de Policía Nariño, entre ellos el Subteniente Kevin Saavedra, el Intendente Gabriel Ortega y el Intendente Víctor Yela." },
      { tipo: "imagen", url: policiaRistra, alt: "Reunión con directivos del RISTRA" },
      { tipo: "parrafo", texto: "La incorporación de ASEGURAR LTDA. a esta herramienta representa un avance significativo en el monitoreo, análisis y prevención de incidentes en las vías." },
      { tipo: "parrafo", texto: "Expresamos nuestro sincero agradecimiento a la Policía de Carreteras por su permanente acompañamiento y compromiso con la protección de los transportadores." },
      { tipo: "parrafo", texto: "Con esta alianza, reafirmamos nuestro compromiso de trabajar articuladamente en soluciones tecnológicas y operativas que contribuyan a fortalecer la seguridad en el transporte terrestre." },
    ],
  },
  {
    titulo: "REUNIÓN INTERINSTITUCIONAL POR LA SEGURIDAD VIAL EN EL SUR DEL PAÍS",
    titulo2: "Acciones conjuntas frente a la piratería terrestre",
    fecha: "22 Mayo 2025", resumen1: "ASEGURAR LTDA. participó en una reunión clave con autoridades para abordar la creciente inseguridad en las vías del Cauca y Nariño.",
    minifoto: reunionSeguridadVial, creador: "Romulo Bolaños",
    contenido: [
      { tipo: "parrafo", texto: "Ante la creciente racha de inseguridad en las vías de los departamentos del Cauca y Nariño, se llevó a cabo una importante reunión interinstitucional en las instalaciones de ASEGURAR LTDA." },
      { tipo: "parrafo", texto: "Participaron representantes de la Policía de Tránsito y Transporte, así como delegados de las Unidades de Investigación Criminal, quienes analizaron los recientes casos de piratería terrestre." },
      { tipo: "imagen", url: reunionMesaTrabajo, alt: "Reunión de seguridad vial" },
      { tipo: "parrafo", texto: "ASEGURAR LTDA. expuso datos recolectados a través de su sistema de monitoreo vehicular, evidenciando puntos críticos y patrones de comportamiento delictivo." },
      { tipo: "parrafo", texto: "ASEGURAR LTDA. reitera su compromiso con la seguridad vial y la protección de los activos de sus clientes." },
    ],
  },
  {
    titulo: "MANUAL ACTUALIZACIÓN APP CELLVI ANDROID",
    titulo2: "Actualiza la app de Asegurar!",
    fecha: "14 Noviembre 2024", resumen1: "Manual para actualizar la aplicación móvil CELLVI en Android.",
    minifoto: fotoApp, creador: "David Montes",
    contenido: [{ tipo: "pdf", texto: "/Manual de Actualizacion de app móvil CELLVI Android.pdf" }],
  },
  {
    titulo: "NOVEDADES ASEGURAR OCTUBRE",
    titulo2: "Noticias importantes en Asegurar!",
    fecha: "16 Octubre 2024", resumen1: "Noticias del mes de Octubre 2024.",
    minifoto: lanchaVertial, creador: "Romulo Bolaños",
    contenido: [
      { tipo: "parrafo", texto: "1.- ASEGURAR LTDA, se une a los sentimientos de dolor por la sensible pérdida de la Señora BLANCA LUCINDA CÓRDOBA DE RAMOS." },
      { tipo: "parrafo", texto: "2.- ASEGURAR LTDA, ha incursionado en los servicios de ubicación vehicular a flotas de transporte fluvial en el Departamento del Putumayo." },
      { tipo: "imagen", url: lanchaHorizontal, alt: "lancha" },
      { tipo: "parrafo", texto: "3.- Se informa que el punto de recaudo en Ipiales quedó desactivado. Los pagos deben realizarse por medios electrónicos." },
      { tipo: "parrafo", texto: "4.- A partir del 01 de noviembre de 2024 podrán ejecutar sus pagos a través de nuestra página web por el portal de pagos WOMPY y BANCO DE COLOMBIA CON CÓDIGO QR." },
      { tipo: "link", texto: "https://www.asegurar.com.co/portaldepagos" },
    ],
  },
  {
    titulo: "EFECTIVIDAD DE ASEGURAR",
    titulo2: "¡Acciones inmediatas y efectivas!",
    fecha: "5 Mayo 2024", resumen1: "Caso de éxito: recuperación de vehículo asaltado en la ruta Pasto-Tumaco.",
    minifoto: chucunes, creador: "Ing David Montes",
    contenido: [
      { tipo: "parrafo", texto: "En colaboración entre la Policía Nacional, el Ejército Nacional y ASEGURAR LTDA, se logró recuperar el vehículo asaltado en la ruta de Pasto a Tumaco, sector de CHUCUNES." },
      { tipo: "parrafo", texto: "El trabajo conjunto entre las fuerzas de seguridad colombianas y el personal de ASEGURAR fue fundamental para el éxito de esta operación." },
      { tipo: "parrafo", texto: "La recuperación del vehículo es un ejemplo tangible de los esfuerzos continuos que se están realizando para garantizar la seguridad en las carreteras colombianas." },
      { tipo: "parrafo", texto: "¡Sigamos adelante juntos! En ASEGURAR siempre estaremos dispuestos a atender todas sus dudas." },
      { tipo: "imagen", url: chucunesinseguro, alt: "Chucunes" },
    ],
  },
];

const comentarios = [
  { nombreCliente: "COOPSETRANS", comentario: "La plataforma CELLVI nos ha permitido el control de nuestra flota y el cumplimiento oportuno de reportes.", foto: fotoCliente1 },
  { nombreCliente: "IPS SAMYSALUD SAS", comentario: "ASEGURAR presta excelente servicio con responsabilidad y confianza.", foto: fotoCliente2 },
  { nombreCliente: "Lácteos Santa María", comentario: "ASEGURAR nos permite viajar seguros, con un servicio eficiente y efectivo.", foto: fotoCliente3 },
];

export default function Blog() {
  const [blog, setBlog] = useState(0);
  const [articleRef, setArticleRef] = useState(null);
  const [scrollTo, setScrollTo] = useState(false);

  useEffect(() => {
    if (scrollTo && articleRef) { articleRef.scrollIntoView({ behavior: "smooth" }); setScrollTo(false); }
  }, [scrollTo, articleRef]);

  const go = (i) => { if (i >= 0 && i < noticia.length) { setBlog(i); setScrollTo(true); } };

  return (
    <>
      <style>{styles}</style>
      <div className="blog-page">
        {/* Hero */}
        <section className="blog-hero">
          <div className="container">
            <span className="blog-hero-tag">Asegublog</span>
            <h1>Noticias y Novedades</h1>
            <p>
              Publicamos temas, informaciones y noticias relacionadas con el servicio
              de monitoreo remoto y seguridad vial. Actualizado periódicamente.
            </p>
          </div>
        </section>

        {/* Featured */}
        <section className="blog-featured">
          <div className="container">
            <div className="blog-featured-grid">
              {noticia.slice(0, 2).map((n, i) => (
                <div key={i} className="blog-feat-card" onClick={() => go(i)}>
                  <img src={n.minifoto} alt={n.titulo} />
                  <div className="blog-feat-body">
                    <span className="blog-feat-tag">Empresarial</span>
                    <h3>{n.titulo}</h3>
                    <div className="date">{n.fecha}</div>
                    <p>{n.resumen1}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="blog-main">
          <div className="container">
            <div className="blog-layout" ref={(r) => setArticleRef(r)}>
              {/* Article */}
              <div className="blog-article-card">
                <Noticia noticia={noticia[blog]} onClick={() => {}} />
                <div className="blog-nav-row">
                  <button className="blog-nav-btn" onClick={() => go(blog - 1)} disabled={blog === 0}>
                    <i className="pi pi-arrow-left me-1" /> Anterior
                  </button>
                  <button className="blog-nav-btn" onClick={() => go(blog + 1)} disabled={blog === noticia.length - 1}>
                    Siguiente <i className="pi pi-arrow-right ms-1" />
                  </button>
                  <span style={{ marginLeft: "auto", fontSize: "0.82rem", color: "#999", alignSelf: "center" }}>
                    {blog + 1} / {noticia.length}
                  </span>
                </div>
              </div>

              {/* Sidebar */}
              <div className="blog-sidebar">
                <div className="blog-sidebar-card">
                  <h4><i className="pi pi-building me-2" style={{ color: "#1565c0" }} />Asegurar Ltda.</h4>
                  <p>Empresa líder en tecnología y telecomunicaciones en la región nariñense, con más de 23 años de experiencia.</p>
                </div>

                <div className="blog-sidebar-card">
                  <h4><i className="pi pi-comments me-2" style={{ color: "#1565c0" }} />Lo que dicen nuestros clientes</h4>
                  {comentarios.map((c, i) => (
                    <div key={i} className="blog-testimonial">
                      <img src={c.foto} alt={c.nombreCliente} />
                      <div>
                        <h5>{c.nombreCliente}</h5>
                        <p>{c.comentario}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Index de artículos */}
                <div className="blog-sidebar-card">
                  <h4><i className="pi pi-list me-2" style={{ color: "#1565c0" }} />Todos los artículos</h4>
                  {noticia.map((n, i) => (
                    <div
                      key={i}
                      onClick={() => go(i)}
                      style={{
                        padding: "8px 0",
                        borderBottom: i < noticia.length - 1 ? "1px solid #f0f0f0" : "none",
                        cursor: "pointer",
                        transition: "color 0.2s",
                        color: blog === i ? "#1565c0" : "#666",
                        fontWeight: blog === i ? 700 : 500,
                        fontSize: "0.84rem",
                      }}
                    >
                      {n.titulo}
                      <div style={{ fontSize: "0.72rem", color: "#aaa" }}>{n.fecha}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
