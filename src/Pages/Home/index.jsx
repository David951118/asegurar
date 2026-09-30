import React from "react";
import { NavLink } from "react-router-dom";
import jefeFoto from "../../Assets/Equipo Asegurar LTDA/Presidente.jpg";
import getenteFoto from "../../Assets/Equipo Asegurar LTDA/Gerencia.jpg";
import sgsstFoto from "../../Assets/Equipo Asegurar LTDA/SGSST.jpeg";
import equipoFoto1 from "../../Assets/Equipo Asegurar LTDA/oscar.jpeg";
import equipoFoto2 from "../../Assets/Equipo Asegurar LTDA/Ingeniero-David.jpg";
import equipoFoto3 from "../../Assets/Equipo Asegurar LTDA/Asistente.jpg";
import equipoFoto5 from "../../Assets/Equipo Asegurar LTDA/Operador.jpg";
import equipoFoto6 from "../../Assets/Equipo Asegurar LTDA/Operadoa.jpg";
import equipoFoto4 from "../../Assets/Equipo Asegurar LTDA/rojas.jpeg";
import lactiosSantaMaria from "../../Assets/iconsEnter/Lacteos Santa Maria png.png";
import coopsetrans from "../../Assets/iconsEnter/Coopsetrans.png";
import nuevoMilenio from "../../Assets/iconsEnter/Nuevo Milenio.png";
import sammiSaludsas from "../../Assets/iconsEnter/Samy-Salud-png.png";
import heroBg from "../../Assets/Portada 2026/hero-bg.jpg";
import heroBgSm from "../../Assets/Portada 2026/hero-bg-sm.jpg";

const styles = `
  /* ── Hero (portada 2026: fondo = parte 01 del diseño) ── */
  .home-hero {
    --hero-yellow: #ffdd0e;
    --hero-navy: #12308a;
    position: relative;
    overflow: hidden;
    font-family: "Montserrat", Roboto, "Segoe UI", sans-serif;
    color: #fff;
    background: #0d3f8f url(${heroBg}) right bottom / cover no-repeat;
    /* La imagen es 2400x1050: con este alto mínimo siempre cubre el
       100% de la altura, así la franja inferior del arte queda alineada
       con la barra de características. */
    min-height: max(600px, calc(100vw * 1050 / 2400));
    display: flex;
    flex-direction: column;
  }
  .hero-inner {
    position: relative;
    z-index: 2;
    flex: 1;
    display: flex;
    align-items: center;
    /* deja libre la franja inferior (14.3% del alto) para la barra */
    padding-block: 32px calc(max(600px, 100vw * 1050 / 2400) * 0.143 + 12px);
  }
  .hero-content { max-width: min(980px, 64vw); }
  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    border: 2px solid var(--hero-yellow);
    border-radius: 999px;
    padding: 8px 26px 8px 20px;
    font-size: clamp(0.8rem, 1.05vw, 1rem);
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-bottom: clamp(16px, 2vw, 28px);
    background: rgba(10, 35, 100, 0.25);
  }
  .hero-badge i { color: var(--hero-yellow); font-size: 1.2em; }
  .hero-badge .sep { width: 1px; height: 1.2em; background: rgba(255,255,255,0.6); }
  .hero-title {
    font-size: clamp(2.1rem, 3.7vw, 4.4rem);
    font-weight: 800;
    line-height: 1.08;
    letter-spacing: -1px;
    margin: 0 0 clamp(18px, 2vw, 30px);
    color: #fff;
    text-shadow: 0 2px 14px rgba(0,0,0,0.18);
  }
  .hero-title .hl {
    display: block;
    width: fit-content;
    color: var(--hero-yellow);
    font-weight: 900;
    position: relative;
  }
  .hero-title .hl::after {
    content: "";
    position: absolute;
    left: 0.02em;
    bottom: -0.16em;
    width: 1.05em;
    height: 0.11em;
    border-radius: 999px;
    background: var(--hero-yellow);
  }
  .hero-desc {
    font-size: clamp(0.98rem, 1.2vw, 1.2rem);
    color: rgba(255,255,255,0.95);
    line-height: 1.6;
    max-width: 620px;
    margin-bottom: clamp(22px, 2.4vw, 36px);
  }
  .hero-desc strong { font-weight: 800; color: #fff; }
  .hero-cta-group { display: flex; gap: 16px; flex-wrap: wrap; }
  .btn-hero-primary,
  .btn-hero-outline {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 14px 30px;
    border-radius: 999px;
    font-size: clamp(0.95rem, 1.15vw, 1.15rem);
    font-weight: 700;
    text-decoration: none;
    transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
  }
  .btn-hero-primary {
    background: var(--hero-yellow);
    color: var(--hero-navy);
    border: 2px solid var(--hero-yellow);
  }
  .btn-hero-primary:hover {
    color: var(--hero-navy);
    transform: translateY(-2px);
    box-shadow: 0 10px 26px rgba(0,0,0,0.28);
  }
  .btn-hero-outline {
    background: rgba(10, 35, 100, 0.2);
    color: #fff;
    border: 2px solid #fff;
  }
  .btn-hero-outline:hover {
    color: #fff;
    background: rgba(255,255,255,0.14);
    transform: translateY(-2px);
  }
  .btn-hero-primary .pi-angle-right,
  .btn-hero-outline .pi-angle-right { font-size: 1.1em; margin-left: 4px; }

  /* Barra de características: se superpone a la franja azul del arte
     (85.7% → 99.1% del alto de la imagen). */
  .hero-features {
    position: absolute;
    z-index: 2;
    left: 0;
    right: 0;
    top: 85.7%;
    bottom: 0.9%;
    display: flex;
    align-items: center;
  }
  .hero-features-grid {
    display: grid;
    grid-template-columns: repeat(4, auto);
    justify-content: start;
    align-items: center;
    width: 100%;
    max-width: 72%;
  }
  .hero-feature {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 0 clamp(14px, 2.2vw, 40px);
    border-left: 1px solid rgba(255,255,255,0.45);
  }
  .hero-feature:first-child { border-left: none; padding-left: 0; }
  .hero-feature-icon {
    width: clamp(40px, 3.6vw, 64px);
    height: clamp(40px, 3.6vw, 64px);
    flex-shrink: 0;
    border-radius: 50%;
    border: 2px solid var(--hero-yellow);
    color: var(--hero-yellow);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: clamp(1.1rem, 1.7vw, 1.8rem);
  }
  .hero-feature-text {
    font-size: clamp(0.8rem, 1.05vw, 1.05rem);
    line-height: 1.3;
    color: #fff;
  }
  .hero-feature-text { white-space: nowrap; }
  .hero-feature-text strong { display: block; font-weight: 700; }

  .hero-desc { text-shadow: 0 1px 8px rgba(8,30,90,0.45); }
  @media (max-width: 1279.98px) {
    .home-hero::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      background: linear-gradient(90deg, rgba(13,52,130,0.7) 0%, rgba(13,52,130,0.45) 45%, transparent 70%);
    }
  }
  @media (max-width: 991.98px) {
    .home-hero { min-height: 0; background-image: url(${heroBgSm}); background-position: 72% bottom; }
    .home-hero::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: 1;
      background: linear-gradient(90deg, rgba(13,52,130,0.96) 0%, rgba(13,52,130,0.82) 55%, rgba(13,52,130,0.35) 100%);
    }
    .hero-inner { padding-block: 48px 36px; }
    .hero-content { max-width: 100%; }
    .hero-features {
      position: relative;
      top: auto;
      bottom: auto;
      background: rgba(10, 38, 110, 0.92);
      border-top: 3px solid var(--hero-yellow);
      padding-block: 20px;
    }
    .hero-features-grid {
      max-width: 100%;
      grid-template-columns: repeat(2, 1fr);
      row-gap: 18px;
    }
    .hero-feature,
    .hero-feature:first-child { border-left: none; padding: 0 8px; }
    .hero-feature-text { white-space: normal; }
  }
  @media (max-width: 420px) {
    .hero-badge { gap: 10px; padding: 6px 16px; }
    .btn-hero-primary, .btn-hero-outline { width: 100%; justify-content: center; }
  }

  /* ── Stats ── */
  .stats-section {
    background: #fff;
    padding: 0;
    margin-top: -1px;
  }
  .stats-bar {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border-top: 4px solid #1565c0;
    box-shadow: 0 4px 30px rgba(0,0,0,0.08);
  }
  .stat-item {
    padding: 32px 24px;
    text-align: center;
    border-right: 1px solid #e8eef5;
  }
  .stat-item:last-child { border-right: none; }
  .stat-number {
    font-size: 2.6rem;
    font-weight: 900;
    color: #1565c0;
    line-height: 1;
    margin-bottom: 6px;
  }
  .stat-label {
    font-size: 0.9rem;
    color: #666;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  @media (max-width: 768px) {
    .stats-bar { grid-template-columns: repeat(2, 1fr); }
    .stat-item:nth-child(2) { border-right: none; }
  }
  @media (max-width: 480px) {
    .stats-bar { grid-template-columns: 1fr; }
    .stat-item { border-right: none; border-bottom: 1px solid #e8eef5; }
  }

  /* ── Servicios ── */
  .services-section {
    padding: 80px 0;
    background: #f8fafc;
  }
  .section-tag {
    display: inline-block;
    background: #e3f0ff;
    color: #1565c0;
    border-radius: 999px;
    padding: 5px 16px;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 14px;
  }
  .section-title {
    font-size: clamp(1.8rem, 3.5vw, 2.6rem);
    font-weight: 900;
    color: #0a2d6e;
    margin-bottom: 14px;
    line-height: 1.2;
  }
  .section-sub {
    color: #666;
    font-size: 1.05rem;
    max-width: 560px;
    margin: 0 auto 48px;
    line-height: 1.7;
  }
  .service-card {
    background: #fff;
    border-radius: 16px;
    padding: 36px 28px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    transition: all 0.3s ease;
    height: 100%;
    border-top: 4px solid transparent;
    text-decoration: none;
    color: inherit;
    display: block;
  }
  .service-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 40px rgba(21,101,192,0.15);
    border-top-color: #1565c0;
    color: inherit;
    text-decoration: none;
  }
  .service-icon {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    font-size: 1.8rem;
  }
  .service-icon.blue { background: #e3f0ff; color: #1565c0; }
  .service-icon.green { background: #e8f5e9; color: #2e7d32; }
  .service-icon.orange { background: #fff3e0; color: #e65100; }
  .service-card h3 {
    font-size: 1.2rem;
    font-weight: 800;
    color: #0a2d6e;
    margin-bottom: 10px;
  }
  .service-card p {
    color: #666;
    font-size: 0.95rem;
    line-height: 1.65;
    margin: 0;
  }
  .service-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #1565c0;
    font-weight: 700;
    font-size: 0.9rem;
    margin-top: 18px;
    text-decoration: none;
  }

  /* ── RNDC Info ── */
  .rndc-section {
    padding: 80px 0;
    background: linear-gradient(135deg, #0a2d6e 0%, #1565c0 100%);
    color: #fff;
  }
  .rndc-section .section-title { color: #fff; }
  .rndc-section .section-sub { color: rgba(255,255,255,0.75); }
  .rndc-section .section-tag {
    background: rgba(255,255,255,0.15);
    color: #ffd54f;
  }
  .rndc-module-card {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 16px;
    padding: 32px 28px;
    height: 100%;
    transition: all 0.3s ease;
  }
  .rndc-module-card:hover {
    background: rgba(255,255,255,0.14);
    transform: translateY(-4px);
  }
  .rndc-module-icon {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    background: rgba(255,213,79,0.2);
    border: 1px solid rgba(255,213,79,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.6rem;
    color: #ffd54f;
    margin-bottom: 18px;
  }
  .rndc-module-card h3 {
    font-size: 1.2rem;
    font-weight: 800;
    color: #fff;
    margin-bottom: 10px;
  }
  .rndc-module-card p {
    color: rgba(255,255,255,0.75);
    font-size: 0.95rem;
    line-height: 1.65;
    margin-bottom: 16px;
  }
  .rndc-step {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 10px;
    font-size: 0.9rem;
    color: rgba(255,255,255,0.8);
  }
  .rndc-step-num {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #ffd54f;
    color: #0a2d6e;
    font-size: 0.75rem;
    font-weight: 900;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }
  .btn-rndc-access {
    background: #ffd54f;
    color: #0a2d6e;
    font-weight: 800;
    padding: 12px 26px;
    border-radius: 50px;
    border: none;
    font-size: 0.95rem;
    text-decoration: none;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 10px;
  }
  .btn-rndc-access:hover {
    background: #ffca28;
    color: #0a2d6e;
    transform: translateY(-2px);
  }
  .rndc-integration-note {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,213,79,0.3);
    border-radius: 12px;
    padding: 20px 24px;
    margin-top: 40px;
    display: flex;
    align-items: flex-start;
    gap: 14px;
  }
  .rndc-integration-note i {
    font-size: 1.4rem;
    color: #ffd54f;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .rndc-integration-note p {
    margin: 0;
    color: rgba(255,255,255,0.85);
    font-size: 0.95rem;
    line-height: 1.6;
  }
  .rndc-integration-note strong { color: #ffd54f; }

  /* ── Equipo ── */
  .team-section {
    padding: 80px 0;
    background: #fff;
  }
  .team-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  @media (max-width: 992px) { .team-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 576px) { .team-grid { grid-template-columns: 1fr; } }
  .team-card {
    position: relative;
    background: #fff;
    border-radius: 16px;
    border: 1px solid #e8eef5;
    padding: 28px 20px 22px;
    text-align: center;
    transition: all 0.35s ease;
    overflow: hidden;
  }
  .team-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(21,101,192,0.12);
    border-color: #bbdefb;
  }
  .team-avatar-wrap {
    width: 100px;
    height: 100px;
    margin: 0 auto 16px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #e3f0ff;
    transition: border-color 0.3s;
  }
  .team-card:hover .team-avatar-wrap { border-color: #1565c0; }
  .team-avatar-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s;
  }
  .team-card:hover .team-avatar-wrap img { transform: scale(1.08); }
  .team-name {
    font-size: 1rem;
    font-weight: 800;
    color: #0a2d6e;
    margin: 0 0 4px;
    line-height: 1.3;
  }
  .team-role {
    font-size: 0.82rem;
    font-weight: 600;
    color: #1565c0;
    background: #e3f0ff;
    display: inline-block;
    padding: 3px 12px;
    border-radius: 999px;
    margin-bottom: 10px;
  }
  .team-desc {
    font-size: 0.85rem;
    color: #666;
    line-height: 1.55;
    margin: 0 0 12px;
  }
  .team-email {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.82rem;
    color: #1565c0;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s;
  }
  .team-email:hover { color: #0a2d6e; }

  /* ── Clientes ── */
  .clients-section {
    padding: 60px 0;
    background: #f8fafc;
  }
  .client-logo-card {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 20px;
    background: #fff;
    border-radius: 12px;
    border: 1px solid #e8eef5;
    transition: all 0.3s ease;
    height: 100px;
  }
  .client-logo-card:hover {
    box-shadow: 0 8px 24px rgba(21,101,192,0.12);
    border-color: #bbdefb;
    transform: translateY(-3px);
  }
  .client-logo-card img {
    max-height: 55px;
    max-width: 130px;
    object-fit: contain;
    filter: grayscale(30%);
    transition: filter 0.3s;
  }
  .client-logo-card:hover img { filter: grayscale(0%); }
`;

const heroFeatures = [
  { icon: "pi-map-marker", title: "Ubicación", sub: "en tiempo real" },
  { icon: "pi-phone", title: "Teléfono", sub: "y soporte 24/7" },
  { icon: "pi-shield", title: "Mayor", sub: "seguridad" },
  { icon: "pi-sliders-h", title: "Control", sub: "total de su flota" },
];

const empleados = [
  {
    name: "Rómulo Exmeling Bolaños Escobar",
    cargo: "Presidente",
    email: "romulo.bolanose@gmail.com",
    foto: jefeFoto,
    descript: "Administrador de Empresas, Profesional en Ciencias Militares. Asesor en Seguridad.",
  },
  {
    name: "Deyanira López Solarte",
    cargo: "Gerente General",
    email: "asegurar.limitada@gmail.com",
    foto: getenteFoto,
    descript: "Administradora de Empresas, 20 años de experiencia en manejo de personal y finanzas.",
  },
  {
    name: "Valentina Ledesma Marin",
    cargo: "Responsable SG-SST",
    email: "sstvalentina8@gmail.com",
    foto: sgsstFoto,
    descript: "Profesional en administración en seguridad y salud en el trabajo y auditora HSEQ.",
  },
  {
    name: "Oscar Mauricio Arteaga Rodriguez",
    cargo: "Administrador Plataforma de Monitoreo CELLVI",
    email: "jefatura.red.asegurar@gmail.com",
    foto: equipoFoto1,
    descript: "Ingeniero de Sistemas egresado de la universidad CESMAG. Administrador de la plataforma CELLVI.",
  },
  {
    name: "David Sebastian Montes Zarama",
    cargo: "Jefe de Desarrollos Tecnológicos",
    email: "dsmontes95@gmail.com",
    foto: equipoFoto2,
    descript: "Ingeniero Electronico de la Universidad de Nariño. Desarrollador FullStack.",
  },
  {
    name: "Johanna Yamile Guzmán Gaviria",
    cargo: "Asistente de Gerencia",
    email: "asistenteasegurar@gmail.com",
    foto: equipoFoto3,
    descript: "Secretaria ejecutiva, especialista en manejo de paquetes contables SIIGO.",
  },
  {
    name: "Jose Rafael Agreda España",
    cargo: "Operador de Medios Tecnológicos",
    email: "centralmasegurar@gmail.com",
    foto: equipoFoto5,
    descript: "Tecnologo en sistemas, especializados en manejo y control de flotas.",
  },
  {
    name: "Sandra Patricia Cuchala Andrade",
    cargo: "Operadora de Medios Tecnólogicos",
    email: "centralmasegurar@gmail.com",
    foto: equipoFoto6,
    descript: "Tecnologo en sistemas, especializados en manejo y control de flotas.",
  },
  {
    name: "Johanna Maribell Rojas Pastas",
    cargo: "Operadora de Medios Tecnólogicos",
    email: "centralmasegurar@gmail.com",
    foto: equipoFoto4,
    descript: "Tecnologo en sistemas, especializados en manejo y control de flotas.",
  },
];

const aliados = [
  { src: lactiosSantaMaria, title: "Lacteos Santa Maria", link: "https://lacteossantamaria.com/" },
  { src: coopsetrans, title: "Coopsetrans", link: "https://coopsetrans.org/" },
  { src: nuevoMilenio, title: "Transportes Nuevo Milenio", link: "https://www.facebook.com/TRANSPORTESTNM/" },
  { src: sammiSaludsas, title: "IPS SamySalud SAS", link: "https://www.facebook.com/OficialSamySaludSas" },
];

export default function Home() {
  return (
    <>
      <style>{styles}</style>

      {/* ── HERO ── */}
      <section className="home-hero">
        <div className="hero-inner">
          <div className="container">
            <div className="hero-content">
              <span className="hero-badge">
                <i className="pi pi-map-marker" />
                Asegurar Ltda.
                <span className="sep" />
                Pasto, Nariño
              </span>
              <h1 className="hero-title">
                Tecnología al servicio de <span className="hl">la seguridad vial</span>
              </h1>
              <p className="hero-desc">
                Somos una empresa nariñense con más de 26 años de trayectoria en
                telecomunicaciones y monitoreo vehicular. Nuestra plataforma{" "}
                <strong>CELLVI</strong> opera <strong>24/7</strong> para mantener
                su flota conectada y segura.
              </p>
              <div className="hero-cta-group">
                <NavLink to="/contacto" className="btn-hero-primary">
                  <i className="pi pi-envelope" />
                  Contáctenos
                  <i className="pi pi-angle-right" />
                </NavLink>
                <NavLink to="/cellvi" className="btn-hero-outline">
                  <i className="pi pi-map-marker" />
                  Rastrea tu activo
                  <i className="pi pi-angle-right" />
                </NavLink>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-features">
          <div className="container">
            <div className="hero-features-grid">
              {heroFeatures.map((f) => (
                <div key={f.title} className="hero-feature">
                  <span className="hero-feature-icon"><i className={`pi ${f.icon}`} /></span>
                  <span className="hero-feature-text">
                    <strong>{f.title}</strong>
                    {f.sub}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="stats-section">
        <div className="stats-bar">
          <div className="stat-item">
            <div className="stat-number">26+</div>
            <div className="stat-label">Años de experiencia</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Central de monitoreo</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Cobertura nacional</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">CELLVI</div>
            <div className="stat-label">Plataforma propia</div>
          </div>
        </div>
      </section>

      {/* ── SERVICIOS ── */}
      <section className="services-section">
        <div className="container">
          <div className="text-center mb-2">
            <span className="section-tag">Nuestras plataformas</span>
          </div>
          <h2 className="section-title text-center">Soluciones integradas para el transporte</h2>
          <p className="section-sub text-center">
            Acceda a nuestros tres sistemas especializados desde un solo lugar.
          </p>
          <div className="row g-4">
            <div className="col-md-4">
              <NavLink to="/cellvi" className="service-card">
                <div className="service-icon blue">
                  <i className="pi pi-map-marker" />
                </div>
                <h3>CELLVI – Monitoreo Vehicular</h3>
                <p>
                  Central Especializada de Logística y Localización Vehicular
                  Internacional. Rastree su flota en tiempo real, 24/7, desde
                  cualquier dispositivo.
                </p>
                <span className="service-link">
                  Ingresar a CELLVI <i className="pi pi-arrow-right" />
                </span>
              </NavLink>
            </div>
            <div className="col-md-4">
              <NavLink to="/pesv" className="service-card">
                <div className="service-icon green">
                  <i className="pi pi-shield" />
                </div>
                <h3>PESV – Plan Estratégico de Seguridad Vial</h3>
                <p>
                  Gestione su Plan Estratégico de Seguridad Vial. Cumpla con la
                  normativa colombiana y registre sus formularios preoperativos
                  de manera digital.
                </p>
                <span className="service-link">
                  Ir a PESV <i className="pi pi-arrow-right" />
                </span>
              </NavLink>
            </div>
            <div className="col-md-4">
              <NavLink to="/rndc" className="service-card">
                <div className="service-icon orange">
                  <i className="pi pi-truck" />
                </div>
                <h3>RNDC – Registro Nacional de Despacho de Carga</h3>
                <p>
                  Portal integrado para la gestión de manifiestos de carga
                  (preoperativas) y creación de contratos FUEC. Todo desde un
                  mismo acceso.
                </p>
                <span className="service-link">
                  Ingresar al RNDC <i className="pi pi-arrow-right" />
                </span>
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* ── RNDC INTEGRACIÓN INFO ── */}
      <section className="rndc-section">
        <div className="container">
          <div className="text-center mb-2">
            <span className="section-tag">Sistema RNDC integrado</span>
          </div>
          <h2 className="section-title text-center">
            Dos módulos, un solo ingreso
          </h2>
          <p className="section-sub text-center">
            Nuestro portal RNDC integra los dos procesos que exige el sistema
            nacional de carga en Colombia.
          </p>

          <div className="row g-4">
            {/* Módulo 1: Preoperativas / Manifiestos */}
            <div className="col-md-6">
              <div className="rndc-module-card">
                <div className="rndc-module-icon">
                  <i className="pi pi-file-edit" />
                </div>
                <h3>Módulo 1 – Preoperativas y Manifiestos</h3>
                <p>
                  Registro y seguimiento de manifiestos de carga (preoperativas)
                  antes de cada despacho. Gestione, consulte y elimine
                  manifiestos desde nuestra plataforma conectada al sistema RNDC.
                </p>
                <div className="rndc-step">
                  <span className="rndc-step-num">1</span>
                  <span>Ingrese con sus credenciales CELLVI al portal RNDC</span>
                </div>
                <div className="rndc-step">
                  <span className="rndc-step-num">2</span>
                  <span>Seleccione la pestaña <strong style={{color:"#ffd54f"}}>Manifiestos</strong></span>
                </div>
                <div className="rndc-step">
                  <span className="rndc-step-num">3</span>
                  <span>Consulte, registre o actualice sus preoperativas</span>
                </div>
                <NavLink to="/rndc" className="btn-rndc-access">
                  <i className="pi pi-sign-in" /> Acceder al módulo
                </NavLink>
              </div>
            </div>

            {/* Módulo 2: Contratos FUEC */}
            <div className="col-md-6">
              <div className="rndc-module-card">
                <div className="rndc-module-icon">
                  <i className="pi pi-file" />
                </div>
                <h3>Módulo 2 – Contratos FUEC</h3>
                <p>
                  El Formato Único de Extracto de Contrato (FUEC) es el documento
                  obligatorio para el transporte especial. Desde nuestro portal
                  puede crear y gestionar sus contratos FUEC de manera ágil.
                </p>
                <div className="rndc-step">
                  <span className="rndc-step-num">1</span>
                  <span>Ingrese al portal RNDC con sus credenciales</span>
                </div>
                <div className="rndc-step">
                  <span className="rndc-step-num">2</span>
                  <span>Seleccione la pestaña <strong style={{color:"#ffd54f"}}>Contratos FUEC</strong></span>
                </div>
                <div className="rndc-step">
                  <span className="rndc-step-num">3</span>
                  <span>Complete los datos y genere su contrato en PDF</span>
                </div>
                <NavLink to="/rndc" className="btn-rndc-access">
                  <i className="pi pi-sign-in" /> Acceder al módulo
                </NavLink>
              </div>
            </div>
          </div>

          <div className="rndc-integration-note">
            <i className="pi pi-info-circle" />
            <p>
              <strong>¿Cómo funciona la integración?</strong> Ambos módulos
              comparten el mismo login con sus credenciales CELLVI. No necesita
              cuentas separadas: un solo usuario y contraseña le da acceso a
              preoperativas y contratos FUEC dentro del portal RNDC de Asegurar.
              Si aún no tiene credenciales,{" "}
              <NavLink to="/contacto" style={{ color: "#ffd54f", fontWeight: 700 }}>
                contáctenos
              </NavLink>{" "}
              para registrarse.
            </p>
          </div>
        </div>
      </section>

      {/* ── EQUIPO ── */}
      <section className="team-section">
        <div className="container">
          <div className="text-center mb-2">
            <span className="section-tag" style={{background:"#e3f0ff", color:"#1565c0"}}>Nuestro equipo</span>
          </div>
          <h2 className="section-title text-center">
            Profesionales comprometidos con su seguridad
          </h2>
          <p className="section-sub text-center">
            Un selecto equipo de profesionales de la información y las
            comunicaciones genera altos estándares de calidad en el servicio AVL.
          </p>
          <div className="team-grid">
            {empleados.map((emp, i) => (
              <div key={i} className="team-card">
                <div className="team-avatar-wrap">
                  <img src={emp.foto} alt={emp.name} />
                </div>
                <h3 className="team-name">{emp.name}</h3>
                <span className="team-role">{emp.cargo}</span>
                <p className="team-desc">{emp.descript}</p>
                <a href={`mailto:${emp.email}`} className="team-email" target="_blank" rel="noopener noreferrer">
                  <i className="pi pi-envelope" />
                  {emp.email}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLIENTES ── */}
      <section className="clients-section">
        <div className="container">
          <div className="text-center mb-4">
            <span className="section-tag" style={{background:"#e3f0ff", color:"#1565c0"}}>Clientes</span>
            <h2 className="section-title">Algunos de nuestros aliados</h2>
          </div>
          <div className="row g-3 justify-content-center align-items-center">
            {aliados.map((item, i) => (
              <div key={i} className="col-6 col-md-3">
                <a href={item.link} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
                  <div className="client-logo-card">
                    <img src={item.src} alt={item.title} />
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
