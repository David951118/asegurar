import { NavLink } from "react-router-dom";

const styles = `
  .ft {
    background: #0a1e3d;
    color: rgba(255,255,255,0.8);
  }

  /* Social bar */
  .ft-social-bar {
    border-bottom: 1px solid rgba(255,255,255,0.08);
    padding: 18px 0;
  }
  .ft-social-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }
  .ft-social-text {
    font-size: 0.88rem;
    color: rgba(255,255,255,0.55);
    margin: 0;
  }
  .ft-social-links { display: flex; gap: 8px; }
  .ft-social-links a {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255,255,255,0.6);
    text-decoration: none;
    transition: all 0.25s;
    font-size: 0.9rem;
  }
  .ft-social-links a:hover {
    background: #1565c0;
    color: #fff;
    border-color: #1565c0;
    transform: translateY(-2px);
  }

  /* Main grid */
  .ft-main { padding: 48px 0 32px; }
  .ft-grid {
    display: grid;
    grid-template-columns: 1.3fr 1fr 1fr 1.2fr;
    gap: 36px;
  }
  @media (max-width: 992px) { .ft-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 576px) { .ft-grid { grid-template-columns: 1fr; } }

  .ft-brand h3 {
    color: #fff;
    font-size: 1.15rem;
    font-weight: 800;
    margin: 0 0 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .ft-brand p {
    font-size: 0.88rem;
    line-height: 1.7;
    color: rgba(255,255,255,0.55);
    margin: 0;
  }

  .ft-col h4 {
    color: #fff;
    font-size: 0.78rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin: 0 0 18px;
    position: relative;
    padding-bottom: 10px;
  }
  .ft-col h4::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 28px;
    height: 2px;
    background: #1565c0;
    border-radius: 2px;
  }
  .ft-col ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .ft-col ul li a {
    color: rgba(255,255,255,0.55);
    text-decoration: none;
    font-size: 0.88rem;
    font-weight: 500;
    padding: 4px 0;
    display: inline-block;
    transition: all 0.2s;
  }
  .ft-col ul li a:hover {
    color: #fff;
    padding-left: 6px;
  }

  /* Contact col */
  .ft-contact-item {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    margin-bottom: 14px;
    font-size: 0.88rem;
  }
  .ft-contact-item i {
    color: #1565c0;
    font-size: 0.95rem;
    margin-top: 3px;
    flex-shrink: 0;
  }
  .ft-contact-item span {
    color: rgba(255,255,255,0.6);
    line-height: 1.5;
  }

  /* Bottom bar */
  .ft-bottom {
    border-top: 1px solid rgba(255,255,255,0.06);
    padding: 18px 0;
    text-align: center;
    font-size: 0.8rem;
    color: rgba(255,255,255,0.35);
  }
  .ft-bottom a {
    color: #64b5f6;
    text-decoration: none;
    font-weight: 700;
  }
  .ft-bottom a:hover { color: #fff; }
`;

const navLinks = [
  { name: "Inicio", path: "/" },
  { name: "Quiénes somos", path: "/acercadenosotros" },
  { name: "Servicios", path: "/servicios" },
  { name: "Contacto", path: "/contacto" },
];

const utilLinks = [
  { name: "Blog", path: "/blog" },
  { name: "Política de privacidad", path: "/politica-de-privacidad" },
  { name: "Legalidad", path: "/legalidad" },
  { name: "RNDC", path: "/rndc" },
  { name: "Comparte tu ubicación", path: "/ubicacion" },
  { name: "Rastrea tu activo", path: "/cellvi" },
  { name: "Inventario GPS", path: "/inventario" },
];

const socials = [
  { icon: "pi pi-facebook", href: "https://www.facebook.com/asegurar.limitada" },
  { icon: "pi pi-instagram", href: "https://www.instagram.com/asegurar.ltda/" },
  { icon: "pi pi-linkedin", href: "https://www.linkedin.com/company/asegurar-ltda/about/" },
  { icon: "pi pi-google", href: "https://www.google.com/maps/place/ASEGURAR+LTDA./@1.2200628,-77.2905461,17z" },
];

export default function Footer() {
  return (
    <>
      <style>{styles}</style>
      <footer className="ft">
        {/* Social bar */}
        <div className="ft-social-bar">
          <div className="container ft-social-inner">
            <p className="ft-social-text">Conéctese con nosotros en redes sociales</p>
            <div className="ft-social-links">
              {socials.map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer">
                  <i className={s.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="ft-main">
          <div className="container">
            <div className="ft-grid">
              {/* Brand */}
              <div className="ft-brand">
                <h3>
                  <i className="pi pi-shield" style={{ color: "#1565c0" }} />
                  Asegurar Limitada
                </h3>
                <p>
                  Empresa nariñense autorizada por el Ministerio de Comunicaciones
                  de Colombia para operar nuestra red de telecomunicaciones.
                  Más de 23 años al servicio de la seguridad y el monitoreo vehicular.
                </p>
              </div>

              {/* Navegación */}
              <div className="ft-col">
                <h4>Navegación</h4>
                <ul>
                  {navLinks.map((l, i) => (
                    <li key={i}><NavLink to={l.path}>{l.name}</NavLink></li>
                  ))}
                </ul>
              </div>

              {/* Utilidades */}
              <div className="ft-col">
                <h4>Utilidades</h4>
                <ul>
                  {utilLinks.map((l, i) => (
                    <li key={i}><NavLink to={l.path}>{l.name}</NavLink></li>
                  ))}
                </ul>
              </div>

              {/* Contacto */}
              <div className="ft-col">
                <h4>Contacto</h4>
                <div className="ft-contact-item">
                  <i className="pi pi-map-marker" />
                  <span>Calle 19 No 27-41, Piso 2, Of. 202,<br />Edificio Merlopa, Pasto - Nariño</span>
                </div>
                <div className="ft-contact-item">
                  <i className="pi pi-envelope" />
                  <span>asegurar.limitada@gmail.com</span>
                </div>
                <div className="ft-contact-item">
                  <i className="pi pi-phone" />
                  <span>+57 315 587 0498</span>
                </div>
                <div className="ft-contact-item">
                  <i className="pi pi-phone" />
                  <span>+57 318 750 0962</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="ft-bottom">
          <div className="container">
            Derechos de autor &copy; 2023 – {new Date().getFullYear()} · Propiedad industrial e intelectual:{" "}
            <a href="https://www.asegurar.com.co/" target="_blank" rel="noopener noreferrer">
              Asegurar Limitada
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
