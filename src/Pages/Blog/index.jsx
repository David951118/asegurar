import { useState, useEffect, useMemo } from "react";
import Noticia from "./noticia";
import articleStyles from "./articleStyles";
import RndcService from "../../Services/rndcApi";
import fotoCliente1 from "../../Assets/iconsEnter/Coopsetrans.png";
import fotoCliente2 from "../../Assets/iconsEnter/Samy-Salud-png.png";
import fotoCliente3 from "../../Assets/iconsEnter/Lacteos Santa Maria png.png";
import fotoApp from "../../Assets/Foto Portada/cellvi.jpg";

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

  ${articleStyles}

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

const comentarios = [
  { nombreCliente: "COOPSETRANS", comentario: "La plataforma CELLVI nos ha permitido el control de nuestra flota y el cumplimiento oportuno de reportes.", foto: fotoCliente1 },
  { nombreCliente: "IPS SAMYSALUD SAS", comentario: "ASEGURAR presta excelente servicio con responsabilidad y confianza.", foto: fotoCliente2 },
  { nombreCliente: "Lácteos Santa María", comentario: "ASEGURAR nos permite viajar seguros, con un servicio eficiente y efectivo.", foto: fotoCliente3 },
];

/**
 * Convierte una entrada del blog de la API (creada en /rndc/estudio) a la
 * estructura que espera el renderizador de noticias.
 */
const mapApiPost = (p) => {
  // Contenido: bloques ricos si existen; si no, párrafos desde el texto plano
  let contenido = Array.isArray(p.contenido) && p.contenido.length > 0 ? p.contenido : null;
  if (!contenido) {
    const parrafos = (p.cuerpo || "")
      .split(/\n\s*\n/)
      .map((t) => t.trim())
      .filter(Boolean)
      .map((texto) => ({ tipo: "parrafo", texto }));
    const galeria =
      p.imagenes && p.imagenes.length > 0
        ? [
            {
              tipo: "galeria",
              imagenes: p.imagenes.map((img) => ({
                url: img.url,
                alt: img.alt || p.titulo,
                caption: img.alt || "",
              })),
            },
          ]
        : [];
    contenido = [...parrafos, ...galeria];
  }
  const palabras = (p.cuerpo || "").split(/\s+/).length;
  return {
    id: p.slug,
    categoria: p.categoria || "Noticias",
    titulo: (p.titulo || "").toUpperCase(),
    titulo2: p.titulo2 || "",
    fecha: p.fechaPublicacion
      ? new Date(p.fechaPublicacion).toLocaleDateString("es-CO", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "",
    lectura: p.lectura || `${Math.max(1, Math.round(palabras / 200))} min`,
    creador: p.autor || "Asegurar Ltda.",
    minifoto: p.portada?.url || p.imagenes?.[0]?.url || fotoApp,
    portada: p.portada?.url || p.imagenes?.[0]?.url,
    resumen1: p.resumen || "",
    tags: p.tags?.length ? p.tags : [p.categoria].filter(Boolean),
    contenido,
  };
};

export default function Blog() {
  const [blog, setBlog] = useState(0);
  const [articleRef, setArticleRef] = useState(null);
  const [scrollTo, setScrollTo] = useState(false);
  const [categoria, setCategoria] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");
  const [noticiasApi, setNoticiasApi] = useState([]);
  const [estadoCarga, setEstadoCarga] = useState("cargando"); // cargando | ok | error

  // El blog es 100% administrado desde /utilidades (API); las noticias
  // históricas también viven allí desde la migración a S3/Mongo
  useEffect(() => {
    RndcService.contenido
      .getBlogPublico()
      .then((res) => {
        setNoticiasApi((res.data || []).map(mapApiPost));
        setEstadoCarga("ok");
      })
      .catch(() => setEstadoCarga("error"));
  }, []);

  const noticia = noticiasApi;

  const CATEGORIAS = useMemo(
    () => ["Todas", ...new Set(noticia.map((n) => n.categoria).filter(Boolean))],
    [noticia],
  );

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
  }, [noticia, categoria, busqueda]);

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
                {estadoCarga === "cargando" && (
                  <div className="blog-empty">
                    <i className="pi pi-spin pi-spinner" style={{ fontSize: 28 }} />
                    <p>Cargando noticias…</p>
                  </div>
                )}
                {estadoCarga === "error" && (
                  <div className="blog-empty">
                    <i className="pi pi-exclamation-circle" style={{ fontSize: 28 }} />
                    <p>No fue posible cargar las noticias en este momento. Intente de nuevo más tarde.</p>
                  </div>
                )}
                {estadoCarga === "ok" && !noticia[blog] && (
                  <div className="blog-empty"><p>Aún no hay noticias publicadas.</p></div>
                )}
                {noticia[blog] && <Noticia noticia={noticia[blog]} onClick={() => {}} />}
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
