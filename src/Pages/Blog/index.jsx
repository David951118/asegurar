import { useState, useEffect, useMemo } from "react";
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
// Imágenes del caso de recuperación del café
import cafePortada from "../../Assets/blog/cafe-recuperado-portada.jpeg";
import cafeFrente from "../../Assets/blog/cafe-recuperado-frente.jpeg";
import cafePolicia from "../../Assets/blog/cafe-recuperado-policia.jpeg";

const styles = `
  .blog-page { background: var(--bg-secondary, #f8fafc); min-height: 100vh; }

  /* Hero */
  .blog-hero {
    background: linear-gradient(135deg, #0a2d6e 0%, #1565c0 60%, #42a5f5 100%);
    padding: 72px 0 48px; color: #fff; text-align: center; position: relative; overflow: hidden;
  }
  .blog-hero::after {
    content: ""; position: absolute; right: -60px; top: -60px;
    width: 240px; height: 240px; border-radius: 50%;
    background: rgba(255,213,79,0.12);
  }
  .blog-hero-tag {
    display: inline-block; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3);
    border-radius: 999px; padding: 5px 16px; font-size: 0.78rem; font-weight: 700;
    letter-spacing: 1px; text-transform: uppercase; margin-bottom: 14px;
  }
  .blog-hero h1 { font-size: clamp(2rem,4vw,2.8rem); font-weight: 900; margin: 0 0 12px; position: relative; z-index: 1; }
  .blog-hero p { color: rgba(255,255,255,0.78); font-size: 1rem; max-width: 620px; margin: 0 auto; line-height: 1.65; position: relative; z-index: 1; }

  /* Toolbar: buscador + categorías */
  .blog-toolbar { padding: 26px 0 8px; }
  .blog-toolbar-inner { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; justify-content: space-between; }
  .blog-search { position: relative; flex: 1; min-width: 240px; max-width: 380px; }
  .blog-search i { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #9aa6b5; }
  .blog-search input {
    width: 100%; padding: 11px 14px 11px 40px; border-radius: 999px;
    border: 1.5px solid var(--card-border, #e8eef5); background: var(--card-bg, #fff);
    color: var(--text-primary, #1a1a2e); font-size: 0.9rem; outline: none; transition: border-color .2s, box-shadow .2s;
  }
  .blog-search input:focus { border-color: #1565c0; box-shadow: 0 0 0 3px rgba(21,101,192,0.12); }
  .blog-cats { display: flex; gap: 8px; flex-wrap: wrap; }
  .blog-cat-chip {
    padding: 7px 15px; border-radius: 999px; font-size: 0.8rem; font-weight: 700; cursor: pointer;
    border: 1.5px solid var(--card-border, #e8eef5); background: var(--card-bg, #fff); color: var(--text-secondary, #555);
    transition: all .18s;
  }
  .blog-cat-chip:hover { border-color: #1565c0; color: #1565c0; }
  .blog-cat-chip.active { background: #1565c0; border-color: #1565c0; color: #fff; }

  /* Featured */
  .blog-featured { padding: 24px 0 10px; }
  .blog-featured-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 20px; }
  @media (max-width: 900px) { .blog-featured-grid { grid-template-columns: 1fr; } }

  /* Featured grande (hero card) */
  .blog-hero-card {
    position: relative; border-radius: 18px; overflow: hidden; cursor: pointer; min-height: 340px;
    box-shadow: 0 8px 30px rgba(10,45,110,0.18); border: 1px solid var(--card-border, #e8eef5);
  }
  .blog-hero-card img { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; transition: transform .5s; }
  .blog-hero-card:hover img { transform: scale(1.05); }
  .blog-hero-card .overlay {
    position: absolute; inset: 0; z-index: 1;
    background: linear-gradient(180deg, rgba(10,30,61,0.05) 0%, rgba(10,30,61,0.55) 55%, rgba(10,30,61,0.92) 100%);
  }
  .blog-hero-card .content { position: absolute; z-index: 2; bottom: 0; left: 0; right: 0; padding: 26px; color: #fff; }
  .blog-hero-card .badge-cat {
    display: inline-block; background: #ffd54f; color: #0a2d6e; border-radius: 6px;
    padding: 3px 12px; font-size: 0.72rem; font-weight: 800; text-transform: uppercase; margin-bottom: 10px; letter-spacing: .5px;
  }
  .blog-hero-card h2 { font-size: clamp(1.2rem,2.2vw,1.6rem); font-weight: 900; margin: 0 0 8px; line-height: 1.25; }
  .blog-hero-card p { font-size: 0.9rem; color: rgba(255,255,255,0.82); margin: 0 0 10px; line-height: 1.55;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .blog-hero-card .meta { font-size: 0.78rem; color: rgba(255,255,255,0.7); display: flex; gap: 12px; }

  /* Featured pequeñas (columna derecha) */
  .blog-side-list { display: flex; flex-direction: column; gap: 14px; }
  .blog-feat-card {
    background: var(--card-bg, #fff); border-radius: 14px; overflow: hidden; cursor: pointer;
    box-shadow: 0 3px 16px rgba(0,0,0,0.06); border: 1px solid var(--card-border, #e8eef5);
    display: flex; transition: all 0.3s;
  }
  .blog-feat-card:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(21,101,192,0.1); border-color: #bbdefb; }
  .blog-feat-card img { width: 120px; object-fit: cover; flex-shrink: 0; }
  @media (max-width: 576px) { .blog-feat-card img { width: 96px; } }
  .blog-feat-body { padding: 14px 16px; }
  .blog-feat-tag {
    display: inline-block; background: var(--accent-bg, #e3f0ff); color: #1565c0;
    border-radius: 6px; padding: 2px 10px; font-size: 0.7rem; font-weight: 700;
    text-transform: uppercase; margin-bottom: 6px;
  }
  .blog-feat-body h3 { font-size: 0.92rem; font-weight: 800; color: var(--accent-dark, #0a2d6e); margin: 0 0 4px; line-height: 1.35; }
  .blog-feat-body .date { font-size: 0.76rem; color: #999; margin: 0 0 5px; }
  .blog-feat-body p { font-size: 0.82rem; color: var(--text-secondary, #666); margin: 0; line-height: 1.5;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

  /* Main content */
  .blog-main { padding: 18px 0 60px; }
  .blog-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 32px; align-items: start; }
  @media (max-width: 992px) { .blog-layout { grid-template-columns: 1fr; } }

  .blog-article-card {
    background: var(--card-bg, #fff); border-radius: 16px; padding: 36px 34px;
    box-shadow: 0 3px 16px rgba(0,0,0,0.06); border: 1px solid var(--card-border, #e8eef5);
  }
  @media (max-width: 576px) { .blog-article-card { padding: 24px 18px; } }

  /* Article (post) typography */
  .blog-post-cat {
    display: inline-block; background: #ffd54f; color: #0a2d6e;
    border-radius: 6px; padding: 3px 12px; font-size: 0.72rem; font-weight: 800;
    text-transform: uppercase; letter-spacing: .5px; margin-bottom: 14px;
  }
  .blog-post-title { font-size: clamp(1.5rem,3vw,2.1rem); font-weight: 900; color: var(--accent-dark, #0a2d6e); margin: 0 0 8px; line-height: 1.2; }
  .blog-post-subtitle { font-size: 1.05rem; color: var(--text-secondary, #555); font-style: italic; margin: 0 0 16px; }
  .blog-post-meta {
    display: flex; gap: 8px; flex-wrap: wrap; align-items: center;
    font-size: 0.82rem; color: #8a93a0; padding-bottom: 18px; margin-bottom: 22px;
    border-bottom: 1px solid var(--card-border, #eef1f6);
  }
  .blog-post-meta i { margin-right: 4px; color: #1565c0; }
  .blog-post-dot { color: #ccc; }
  .blog-post-cover { margin: 0 0 24px; border-radius: 14px; overflow: hidden; }
  .blog-post-cover img { width: 100%; display: block; }

  .blog-post-body { font-size: 1rem; color: var(--text-primary, #2b3440); line-height: 1.75; }
  .blog-content-p { margin: 0 0 18px; }
  .blog-content-h4 { font-size: 1.25rem; font-weight: 800; color: var(--accent-dark, #0a2d6e); margin: 28px 0 12px; }
  .blog-content-h5 { font-size: 1.05rem; font-weight: 800; color: var(--accent-dark, #0a2d6e); margin: 22px 0 10px; }
  .blog-content-figure { margin: 22px 0; border-radius: 14px; overflow: hidden; }
  .blog-content-img { width: 100%; display: block; border-radius: 14px; }
  .blog-content-figure figcaption { font-size: 0.82rem; color: #8a93a0; text-align: center; margin-top: 8px; font-style: italic; }

  .blog-content-gallery { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 22px 0; }
  @media (max-width: 576px) { .blog-content-gallery { grid-template-columns: 1fr; } }
  .blog-content-gallery-item { margin: 0; border-radius: 12px; overflow: hidden; }
  .blog-content-gallery-item img { width: 100%; height: 220px; object-fit: cover; display: block; border-radius: 12px; }
  .blog-content-gallery-item figcaption { font-size: 0.78rem; color: #8a93a0; text-align: center; margin-top: 6px; font-style: italic; }

  .blog-content-quote {
    border-left: 4px solid #ffd54f; background: var(--accent-bg, #f0f6ff);
    padding: 18px 22px; border-radius: 0 12px 12px 0; margin: 24px 0;
  }
  .blog-content-quote p { font-size: 1.08rem; font-style: italic; color: var(--accent-dark, #0a2d6e); margin: 0 0 6px; line-height: 1.6; }
  .blog-content-quote cite { font-size: 0.85rem; color: var(--text-secondary, #666); font-style: normal; font-weight: 700; }

  .blog-content-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 14px; margin: 24px 0; }
  .blog-content-stat {
    background: linear-gradient(135deg, #0a2d6e, #1565c0); color: #fff;
    border-radius: 14px; padding: 18px 16px; text-align: center;
  }
  .blog-content-stat .num { display: block; font-size: 1.7rem; font-weight: 900; color: #ffd54f; line-height: 1.1; }
  .blog-content-stat .lbl { display: block; font-size: 0.76rem; color: rgba(255,255,255,0.85); margin-top: 4px; }

  .blog-content-callout {
    display: flex; gap: 12px; align-items: flex-start;
    background: var(--green-bg, #e8f5e9); border: 1px solid var(--green-border, #c8e6c9);
    border-radius: 12px; padding: 16px 18px; margin: 22px 0;
  }
  .blog-content-callout .ic { font-size: 1.3rem; }
  .blog-content-callout p { margin: 0; font-size: 0.95rem; color: var(--text-primary, #2b3440); line-height: 1.6; }

  .blog-content-link { color: #1565c0; font-weight: 700; text-decoration: none; border-bottom: 1.5px solid #bbdefb; }
  .blog-content-link:hover { border-bottom-color: #1565c0; }
  .blog-content-list { margin: 0 0 18px; padding-left: 22px; }
  .blog-content-list li { margin-bottom: 8px; line-height: 1.6; }

  .blog-post-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 26px; padding-top: 18px; border-top: 1px solid var(--card-border, #eef1f6); }
  .blog-post-tag { font-size: 0.78rem; color: #1565c0; background: var(--accent-bg, #e3f0ff); padding: 4px 11px; border-radius: 999px; font-weight: 600; }

  /* Nav */
  .blog-nav-row { display: flex; gap: 10px; margin-top: 24px; flex-wrap: wrap; align-items: center; }
  .blog-nav-btn {
    padding: 9px 20px; border-radius: 8px; font-size: 0.85rem; font-weight: 700;
    cursor: pointer; transition: all 0.2s; border: 1.5px solid var(--card-border, #ddd);
    background: var(--card-bg, #fff); color: var(--text-secondary, #444);
  }
  .blog-nav-btn:hover:not(:disabled) { border-color: #1565c0; color: #1565c0; background: var(--accent-bg, #e3f0ff); }
  .blog-nav-btn:disabled { opacity: 0.4; cursor: default; }

  /* Sidebar */
  .blog-sidebar { position: sticky; top: 80px; }
  .blog-sidebar-card {
    background: var(--card-bg, #fff); border-radius: 14px; padding: 22px 20px;
    box-shadow: 0 3px 16px rgba(0,0,0,0.06); border: 1px solid var(--card-border, #e8eef5);
    margin-bottom: 20px;
  }
  .blog-sidebar-card h4 { font-size: 0.95rem; font-weight: 800; color: var(--accent-dark, #0a2d6e); margin: 0 0 14px; }
  .blog-sidebar-card p { font-size: 0.88rem; color: var(--text-secondary, #666); line-height: 1.6; }
  .blog-testimonial { display: flex; gap: 12px; align-items: flex-start; padding: 14px 0; border-top: 1px solid var(--card-border, #f0f0f0); }
  .blog-testimonial:first-of-type { border-top: none; padding-top: 0; }
  .blog-testimonial img { width: 48px; height: 48px; object-fit: contain; border-radius: 8px; border: 1px solid var(--card-border, #e8eef5); flex-shrink: 0; padding: 4px; background:#fff; }
  .blog-testimonial h5 { font-size: 0.82rem; font-weight: 800; color: var(--accent-dark, #0a2d6e); margin: 0 0 3px; }
  .blog-testimonial p { font-size: 0.8rem; color: var(--text-secondary, #666); margin: 0; line-height: 1.5; }

  .blog-index-item { padding: 9px 0; cursor: pointer; transition: color 0.2s; border-bottom: 1px solid var(--card-border, #f0f0f0); }
  .blog-index-item:last-child { border-bottom: none; }
  .blog-index-item .it-title { font-size: 0.84rem; font-weight: 600; }
  .blog-index-item .it-date { font-size: 0.72rem; color: #aaa; }

  .blog-cta-card { background: linear-gradient(135deg, #0a2d6e, #1565c0); color: #fff; }
  .blog-cta-card h4 { color: #fff !important; }
  .blog-cta-card p { color: rgba(255,255,255,0.85) !important; }
  .blog-cta-btn {
    display: inline-block; margin-top: 10px; background: #ffd54f; color: #0a2d6e;
    padding: 9px 18px; border-radius: 8px; font-weight: 800; text-decoration: none; font-size: 0.85rem;
  }

  .blog-empty { text-align: center; padding: 40px; color: var(--text-muted, #999); }
`;

/* ──────────────────────────────────────────────
   Datos (estructura lista para mapear desde la API)
   ────────────────────────────────────────────── */
const noticia = [
  {
    id: "recuperacion-cafe-popayan-2025",
    categoria: "Caso de éxito",
    titulo: "RECUPERACIÓN DE 10 TONELADAS DE CAFÉ EN TIEMPO RÉCORD",
    titulo2: "Monitoreo satelital y coordinación con la Policía logran recuperar carga y vehículo en una hora",
    fecha: "19 Mayo 2025",
    lectura: "3 min",
    creador: "Central de Monitoreo ASEGURAR LTDA.",
    minifoto: cafePortada,
    portada: cafePortada,
    resumen1:
      "Un vehículo cargado con 10 toneladas de café fue hurtado en la ruta La Unión (Nariño) – Popayán (Cauca) y recuperado aproximadamente una hora después gracias al dispositivo satelital de ASEGURAR y la articulación con la Policía de Carreteras.",
    tags: ["SeguridadVial", "MonitoreoSatelital", "Café", "Cauca", "Recuperación", "PirateríaTerrestre"],
    contenido: [
      {
        tipo: "parrafo",
        texto:
          "El 19 de mayo de 2025, el señor Luis Carlos Burbano Gómez reportó el hurto de un vehículo cargado con 10 toneladas de café mientras cubría la ruta entre La Unión (Nariño) y Popayán (Cauca). De inmediato, la Central de Monitoreo de ASEGURAR LTDA. activó su protocolo de búsqueda y reacción.",
      },
      {
        tipo: "datos",
        items: [
          { valor: "10 t", etiqueta: "de café a bordo" },
          { valor: "~1 h", etiqueta: "para recuperar" },
          { valor: "100%", etiqueta: "carga recuperada" },
        ],
      },
      { tipo: "subtitulo", texto: "Activación inmediata del protocolo" },
      {
        tipo: "parrafo",
        texto:
          "Tras el reporte, la central suministró las coordenadas en tiempo real del dispositivo satelital instalado en la carga y coordinó acciones con la Policía de Carreteras del Cauca, con especial apoyo de la patrullera Yenni Guerrero, manteniendo un intercambio constante de información durante todo el operativo.",
      },
      {
        tipo: "imagen",
        url: cafePortada,
        alt: "Vehículo recuperado con la carga de café",
        caption: "Vehículo de placa TKF-528 recuperado en el sector Loma de la Virgen, Popayán.",
      },
      { tipo: "subtitulo", texto: "Ubicación y recuperación" },
      {
        tipo: "parrafo",
        texto:
          "Gracias al monitoreo en tiempo real y al apoyo de la Policía Nacional, el vehículo y la mercancía fueron ubicados y recuperados en el sector Loma de la Virgen, en Popayán, aproximadamente una hora después del reporte inicial. La totalidad de la carga de café fue puesta a disposición de las autoridades.",
      },
      {
        tipo: "galeria",
        imagenes: [
          { url: cafeFrente, alt: "Camión recuperado de frente", caption: "Vehículo recuperado en buen estado." },
          { url: cafePolicia, alt: "Entrega de la carga a las autoridades", caption: "Carga de café entregada a la Policía Nacional y la Fiscalía." },
        ],
      },
      {
        tipo: "cita",
        texto:
          "La rapidez de la recuperación demuestra que la tecnología satelital, combinada con la coordinación entre la central de monitoreo y las autoridades, es la mejor herramienta contra la piratería terrestre.",
        autor: "Central de Monitoreo ASEGURAR LTDA.",
      },
      { tipo: "subtitulo", texto: "Lecciones y recomendaciones" },
      {
        tipo: "parrafo",
        texto:
          "El caso evidenció la efectividad del dispositivo satelital y de la coordinación interinstitucional entre las autoridades y la central de monitoreo. Ante el alto riesgo de piratería terrestre en la zona, se recomendó a los transportadores reforzar la seguridad en las vías del Cauca mediante caravanas o escoltas armados.",
      },
      {
        tipo: "destacado",
        icono: "✅",
        texto:
          "¿Transporta carga de alto valor por el sur del país? El monitoreo satelital 24/7 de ASEGURAR LTDA. puede marcar la diferencia entre perder su mercancía o recuperarla en minutos.",
      },
      {
        tipo: "parrafo",
        texto:
          "Agradecemos a la Policía de Carreteras del Cauca, a la patrullera Yenni Guerrero y a todas las autoridades que hicieron posible esta recuperación. En ASEGURAR LTDA. reafirmamos nuestro compromiso con la protección de los transportadores de la región.",
      },
    ],
  },
  {
    id: "ristra-2024",
    categoria: "Empresarial",
    titulo: "ASEGURAR LTDA. SE INTEGRA AL SISTEMA RISTRA",
    titulo2: "Un paso más hacia la seguridad vial inteligente",
    fecha: "28 Mayo 2024",
    lectura: "2 min",
    creador: "Romulo Bolaños",
    minifoto: reunionRistra,
    portada: reunionRistra,
    resumen1:
      "La empresa ASEGURAR LTDA. fue integrada al Registro Integral de Seguridad en el Transporte (RISTRA), en colaboración con autoridades de tránsito del Departamento de Policía Nariño.",
    tags: ["RISTRA", "SeguridadVial", "PolicíaNariño"],
    contenido: [
      { tipo: "parrafo", texto: "El pasado 28 de mayo de 2024, en las instalaciones de ASEGURAR LTDA., se llevó a cabo una importante reunión con los directivos del RISTRA (Registro Integral de Seguridad en el Transporte), con el objetivo de integrar a nuestra empresa en esta plataforma tecnológica de alto impacto para la seguridad vial." },
      { tipo: "parrafo", texto: "El encuentro contó con la participación de destacados miembros de la Dirección de Transportes y Tránsito del Departamento de Policía Nariño, entre ellos el Subteniente Kevin Saavedra, el Intendente Gabriel Ortega y el Intendente Víctor Yela." },
      { tipo: "imagen", url: policiaRistra, alt: "Reunión con directivos del RISTRA", caption: "Directivos de ASEGURAR LTDA. junto a la Policía de Tránsito de Nariño." },
      { tipo: "parrafo", texto: "La incorporación de ASEGURAR LTDA. a esta herramienta representa un avance significativo en el monitoreo, análisis y prevención de incidentes en las vías." },
      { tipo: "parrafo", texto: "Expresamos nuestro sincero agradecimiento a la Policía de Carreteras por su permanente acompañamiento y compromiso con la protección de los transportadores." },
      { tipo: "parrafo", texto: "Con esta alianza, reafirmamos nuestro compromiso de trabajar articuladamente en soluciones tecnológicas y operativas que contribuyan a fortalecer la seguridad en el transporte terrestre." },
    ],
  },
  {
    id: "reunion-interinstitucional-2025",
    categoria: "Seguridad vial",
    titulo: "REUNIÓN INTERINSTITUCIONAL POR LA SEGURIDAD VIAL EN EL SUR DEL PAÍS",
    titulo2: "Acciones conjuntas frente a la piratería terrestre",
    fecha: "22 Mayo 2025",
    lectura: "2 min",
    creador: "Romulo Bolaños",
    minifoto: reunionSeguridadVial,
    portada: reunionSeguridadVial,
    resumen1:
      "ASEGURAR LTDA. participó en una reunión clave con autoridades para abordar la creciente inseguridad en las vías del Cauca y Nariño.",
    tags: ["SeguridadVial", "PirateríaTerrestre", "Cauca", "Nariño"],
    contenido: [
      { tipo: "parrafo", texto: "Ante la creciente racha de inseguridad en las vías de los departamentos del Cauca y Nariño, se llevó a cabo una importante reunión interinstitucional en las instalaciones de ASEGURAR LTDA." },
      { tipo: "parrafo", texto: "Participaron representantes de la Policía de Tránsito y Transporte, así como delegados de las Unidades de Investigación Criminal, quienes analizaron los recientes casos de piratería terrestre." },
      { tipo: "imagen", url: reunionMesaTrabajo, alt: "Reunión de seguridad vial", caption: "Mesa de trabajo interinstitucional en ASEGURAR LTDA." },
      { tipo: "parrafo", texto: "ASEGURAR LTDA. expuso datos recolectados a través de su sistema de monitoreo vehicular, evidenciando puntos críticos y patrones de comportamiento delictivo." },
      { tipo: "parrafo", texto: "ASEGURAR LTDA. reitera su compromiso con la seguridad vial y la protección de los activos de sus clientes." },
    ],
  },
  {
    id: "manual-cellvi-android-2024",
    categoria: "Tutorial",
    titulo: "MANUAL ACTUALIZACIÓN APP CELLVI ANDROID",
    titulo2: "Actualiza la app de Asegurar",
    fecha: "14 Noviembre 2024",
    lectura: "1 min",
    creador: "David Montes",
    minifoto: fotoApp,
    resumen1: "Manual paso a paso para actualizar la aplicación móvil CELLVI en dispositivos Android.",
    tags: ["CELLVI", "App", "Android", "Tutorial"],
    contenido: [{ tipo: "pdf", texto: "/Manual de Actualizacion de app móvil CELLVI Android.pdf" }],
  },
  {
    id: "novedades-octubre-2024",
    categoria: "Empresarial",
    titulo: "NOVEDADES ASEGURAR OCTUBRE",
    titulo2: "Noticias importantes en Asegurar",
    fecha: "16 Octubre 2024",
    lectura: "2 min",
    creador: "Romulo Bolaños",
    minifoto: lanchaVertial,
    portada: lanchaVertial,
    resumen1: "Resumen de novedades del mes: nuevos servicios fluviales, cambios en recaudo y portal de pagos.",
    tags: ["Novedades", "Putumayo", "PortalDePagos"],
    contenido: [
      { tipo: "parrafo", texto: "1.- ASEGURAR LTDA. se une a los sentimientos de dolor por la sensible pérdida de la Señora BLANCA LUCINDA CÓRDOBA DE RAMOS." },
      { tipo: "parrafo", texto: "2.- ASEGURAR LTDA. ha incursionado en los servicios de ubicación vehicular a flotas de transporte fluvial en el Departamento del Putumayo." },
      { tipo: "imagen", url: lanchaHorizontal, alt: "Transporte fluvial monitoreado", caption: "Monitoreo de flotas de transporte fluvial en Putumayo." },
      { tipo: "parrafo", texto: "3.- Se informa que el punto de recaudo en Ipiales quedó desactivado. Los pagos deben realizarse por medios electrónicos." },
      { tipo: "parrafo", texto: "4.- A partir del 01 de noviembre de 2024 podrán ejecutar sus pagos a través de nuestra página web por el portal de pagos WOMPI y BANCO DE COLOMBIA con código QR." },
      { tipo: "link", texto: "https://www.asegurar.com.co/portaldepagos", label: "Ir al portal de pagos" },
    ],
  },
  {
    id: "efectividad-chucunes-2024",
    categoria: "Caso de éxito",
    titulo: "EFECTIVIDAD DE ASEGURAR",
    titulo2: "¡Acciones inmediatas y efectivas!",
    fecha: "5 Mayo 2024",
    lectura: "2 min",
    creador: "Ing. David Montes",
    minifoto: chucunes,
    portada: chucunes,
    resumen1: "Caso de éxito: recuperación de vehículo asaltado en la ruta Pasto–Tumaco, sector Chucunes.",
    tags: ["CasoDeÉxito", "Recuperación", "PastoTumaco"],
    contenido: [
      { tipo: "parrafo", texto: "En colaboración entre la Policía Nacional, el Ejército Nacional y ASEGURAR LTDA., se logró recuperar el vehículo asaltado en la ruta de Pasto a Tumaco, sector de CHUCUNES." },
      { tipo: "parrafo", texto: "El trabajo conjunto entre las fuerzas de seguridad colombianas y el personal de ASEGURAR fue fundamental para el éxito de esta operación." },
      { tipo: "parrafo", texto: "La recuperación del vehículo es un ejemplo tangible de los esfuerzos continuos que se están realizando para garantizar la seguridad en las carreteras colombianas." },
      { tipo: "parrafo", texto: "¡Sigamos adelante juntos! En ASEGURAR siempre estaremos dispuestos a atender todas sus dudas." },
      { tipo: "imagen", url: chucunesinseguro, alt: "Sector Chucunes", caption: "Operativo de recuperación en el sector Chucunes." },
    ],
  },
];

const comentarios = [
  { nombreCliente: "COOPSETRANS", comentario: "La plataforma CELLVI nos ha permitido el control de nuestra flota y el cumplimiento oportuno de reportes.", foto: fotoCliente1 },
  { nombreCliente: "IPS SAMYSALUD SAS", comentario: "ASEGURAR presta excelente servicio con responsabilidad y confianza.", foto: fotoCliente2 },
  { nombreCliente: "Lácteos Santa María", comentario: "ASEGURAR nos permite viajar seguros, con un servicio eficiente y efectivo.", foto: fotoCliente3 },
];

const CATEGORIAS = ["Todas", "Caso de éxito", "Seguridad vial", "Empresarial", "Tutorial"];

export default function Blog() {
  const [blog, setBlog] = useState(0);
  const [articleRef, setArticleRef] = useState(null);
  const [scrollTo, setScrollTo] = useState(false);
  const [categoria, setCategoria] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    if (scrollTo && articleRef) { articleRef.scrollIntoView({ behavior: "smooth" }); setScrollTo(false); }
  }, [scrollTo, articleRef]);

  // Índice del artículo dentro del array original (para no romper el navegador prev/next)
  const go = (i) => { if (i >= 0 && i < noticia.length) { setBlog(i); setScrollTo(true); } };

  // Lista filtrada (manteniendo el índice real de cada item)
  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return noticia
      .map((n, idx) => ({ n, idx }))
      .filter(({ n }) => {
        const okCat = categoria === "Todas" || n.categoria === categoria;
        const okBusq = !q ||
          n.titulo.toLowerCase().includes(q) ||
          (n.resumen1 || "").toLowerCase().includes(q) ||
          (n.tags || []).some((t) => t.toLowerCase().includes(q));
        return okCat && okBusq;
      });
  }, [categoria, busqueda]);

  const destacado = filtrados[0];
  const secundarios = filtrados.slice(1, 4);

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
              Casos de éxito, seguridad vial y novedades del monitoreo satelital.
              Historias reales de cómo protegemos a los transportadores del sur de Colombia.
            </p>
          </div>
        </section>

        {/* Toolbar */}
        <section className="blog-toolbar">
          <div className="container">
            <div className="blog-toolbar-inner">
              <div className="blog-search">
                <i className="pi pi-search" />
                <input
                  type="text"
                  placeholder="Buscar noticias, casos, etiquetas..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
              <div className="blog-cats">
                {CATEGORIAS.map((c) => (
                  <button
                    key={c}
                    className={`blog-cat-chip ${categoria === c ? "active" : ""}`}
                    onClick={() => setCategoria(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured */}
        {(destacado || secundarios.length > 0) && (
          <section className="blog-featured">
            <div className="container">
              <div className="blog-featured-grid">
                {/* Hero card */}
                {destacado && (
                  <div className="blog-hero-card" onClick={() => go(destacado.idx)}>
                    <img src={destacado.n.portada || destacado.n.minifoto} alt={destacado.n.titulo} />
                    <div className="overlay" />
                    <div className="content">
                      <span className="badge-cat">{destacado.n.categoria}</span>
                      <h2>{destacado.n.titulo}</h2>
                      <p>{destacado.n.resumen1}</p>
                      <div className="meta">
                        <span><i className="pi pi-calendar" /> {destacado.n.fecha}</span>
                        {destacado.n.lectura && <span><i className="pi pi-clock" /> {destacado.n.lectura}</span>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Secundarias */}
                <div className="blog-side-list">
                  {secundarios.map(({ n, idx }) => (
                    <div key={idx} className="blog-feat-card" onClick={() => go(idx)}>
                      <img src={n.minifoto} alt={n.titulo} />
                      <div className="blog-feat-body">
                        <span className="blog-feat-tag">{n.categoria}</span>
                        <h3>{n.titulo}</h3>
                        <div className="date">{n.fecha}</div>
                        <p>{n.resumen1}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Main */}
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
                  <p>Empresa líder en tecnología y telecomunicaciones en la región nariñense, con más de 23 años de experiencia en monitoreo satelital y seguridad del transporte.</p>
                </div>

                <div className="blog-sidebar-card blog-cta-card">
                  <h4><i className="pi pi-shield me-2" style={{ color: "#ffd54f" }} />Protege tu carga</h4>
                  <p>Monitoreo satelital 24/7 y central de reacción inmediata para tu flota.</p>
                  <a href="/contacto" className="blog-cta-btn">Solicitar información</a>
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

                <div className="blog-sidebar-card">
                  <h4><i className="pi pi-list me-2" style={{ color: "#1565c0" }} />Todos los artículos</h4>
                  {noticia.map((n, i) => (
                    <div
                      key={i}
                      onClick={() => go(i)}
                      className="blog-index-item"
                      style={{ color: blog === i ? "#1565c0" : "var(--text-secondary, #666)", fontWeight: blog === i ? 700 : 500 }}
                    >
                      <div className="it-title">{n.titulo}</div>
                      <div className="it-date">{n.fecha} · {n.categoria}</div>
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
