import { useState, useContext } from "react";
import { AsegurarContext } from "../../Context";
import { useTheme } from "../../Context/ThemeContext";
import { NavLink } from "react-router-dom";
import image from "../../Assets/LogoPNG2.001.png";

const navStyles = `
  .nav-main {
    background: var(--nav-bg);
    backdrop-filter: blur(12px);
    box-shadow: 0 1px 12px rgba(0,0,0,0.06);
    border-bottom: 1px solid var(--nav-border);
    transition: background 0.3s, border-color 0.3s;
    z-index: 1030;
  }
  .nav-main .nav-link {
    font-weight: 600;
    font-size: 0.88rem;
    color: var(--text-primary);
    padding: 8px 14px !important;
    border-radius: 8px;
    transition: all 0.2s;
    letter-spacing: 0.2px;
  }
  .nav-main .nav-link:hover,
  .nav-main .nav-link.active {
    color: var(--accent);
    background: var(--accent-bg);
  }
  .nav-cta-group {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
  }
  .nav-cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.82rem;
    font-weight: 700;
    padding: 7px 16px;
    border-radius: 8px;
    text-decoration: none;
    transition: all 0.25s;
    border: 1.5px solid transparent;
    white-space: nowrap;
  }
  .nav-cta-btn.cellvi {
    background: var(--accent-bg);
    color: var(--accent);
    border-color: var(--accent-border);
  }
  .nav-cta-btn.cellvi:hover {
    background: var(--accent);
    color: #fff;
    border-color: var(--accent);
  }
  .nav-cta-btn.pesv {
    background: var(--green-bg);
    color: var(--green);
    border-color: var(--green-border);
  }
  .nav-cta-btn.pesv:hover {
    background: var(--green);
    color: #fff;
    border-color: var(--green);
  }
  .nav-cta-btn.rndc {
    background: linear-gradient(135deg, #0a2d6e, #1565c0);
    color: #fff;
    border: none;
    padding: 8px 18px;
    box-shadow: 0 3px 12px rgba(21,101,192,0.2);
  }
  .nav-cta-btn.rndc:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(21,101,192,0.3);
    color: #fff;
  }
  /* Theme toggle */
  .theme-toggle {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    border: 1.5px solid var(--nav-border);
    background: var(--card-bg);
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.25s;
    font-size: 1rem;
    flex-shrink: 0;
  }
  .theme-toggle:hover {
    background: var(--accent-bg);
    color: var(--accent);
    border-color: var(--accent);
    transform: scale(1.05);
  }
  @media (max-width: 991px) {
    .nav-cta-group {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--nav-border);
    }
  }
`;

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDesktop } = useContext(AsegurarContext);
  const { isDark, toggleTheme } = useTheme();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const menuItems = [
    { name: "Inicio", path: "/" },
    { name: "Nosotros", path: "/acercadenosotros" },
    { name: "Servicios", path: "/servicios" },
    { name: "Contacto", path: "/contacto" },
    { name: "Blog", path: "/blog" },
    { name: "Pagos", path: "/portaldepagos" },
  ];

  return (
    <div className={`${isDesktop ? "content" : ""}`}>
      <style>{navStyles}</style>
      <nav className={`navbar navbar-expand-lg nav-main ${isDesktop ? "fixed-top" : ""}`}>
        <div className="container">
          <NavLink className="navbar-brand" to="/" onClick={closeMenu}>
            <img src={image} alt="Asegurar" width="140" height="42" className="d-inline-block align-text-top" />
          </NavLink>

          {/* Theme toggle visible siempre junto al hamburger en mobile */}
          <div className="d-flex align-items-center gap-2 d-lg-none">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Cambiar tema" title={isDark ? "Modo claro" : "Modo oscuro"}>
              <i className={isDark ? "pi pi-sun" : "pi pi-moon"} />
            </button>
            <button className="navbar-toggler border-0" type="button" onClick={toggleMenu} aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
            <ul className={`navbar-nav ${isDesktop ? "me-auto" : ""}`}>
              {menuItems.map((item, index) => (
                <li className="nav-item" key={index}>
                  <NavLink to={item.path} className="nav-link" onClick={closeMenu}>
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="nav-cta-group">
              {/* Theme toggle desktop */}
              <button className="theme-toggle d-none d-lg-flex" onClick={toggleTheme} aria-label="Cambiar tema" title={isDark ? "Modo claro" : "Modo oscuro"}>
                <i className={isDark ? "pi pi-sun" : "pi pi-moon"} />
              </button>
              <NavLink to="/cellvi" className="nav-cta-btn cellvi" onClick={closeMenu}>
                <i className="pi pi-map-marker" /> CELLVI
              </NavLink>
              <NavLink to="/pesv" className="nav-cta-btn pesv" onClick={closeMenu}>
                <i className="pi pi-shield" /> PESV
              </NavLink>
              <NavLink to="/rndc" className="nav-cta-btn rndc" onClick={closeMenu}>
                <i className="pi pi-truck" /> RNDC
              </NavLink>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
