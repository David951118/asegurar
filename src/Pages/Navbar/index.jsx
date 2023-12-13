import React, { useState, useContext } from "react";
import { AsegurarContext } from "../../Context";
import { NavLink } from "react-router-dom";
import image from "../../Assets/LogoPNG2.001.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDesktop } = useContext(AsegurarContext);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const menuItems = [
    { name: "Inicio", path: "/", activeClassName: "text-blue" },
    {
      name: "Acerca de Nosotros",
      path: "/acercadenosotros",
      activeClassName: "text-blue",
    },
    { name: "Servicios", path: "/servicios", activeClassName: "text-blue" },
    { name: "Contacto", path: "/contacto", activeClassName: "text-blue" },
    { name: "Blog", path: "/blog", activeClassName: "text-blue" },
    // {
    //   name: "Portal de Pagos",
    //   path: "/portaldepagos",
    //   activeClassName: "text-blue",
    // },
  ];

  return (
    <div className={`${isDesktop ? "content" : ""}`}>
      <nav
        className={`navbar navbar-expand-lg  bg-light ${
          isDesktop ? "fixed-top" : ""
        }`}
      >
        <div className="container">
          <NavLink className="navbar-brand" to="/">
            <img
              src={image}
              alt="Inicio"
              width="150"
              height="45"
              className="d-inline-block align-text-top"
            />
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={toggleMenu}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}
            id="navbarNavDropdown"
          >
            <ul className={`navbar-nav ${isDesktop ? "me-auto" : ""}`}>
              {menuItems.map((item, index) => (
                <li className="nav-item" key={index}>
                  <NavLink
                    to={item.path}
                    className={`nav-link ${item.activeClassName}`}
                    onClick={closeMenu}
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="custom-ml-auto">
              <button type="button" className="btn btn-primary me-3">
                <NavLink to="/cellvi" className="nav-link" onClick={closeMenu}>
                  LOGIN CELLVI
                </NavLink>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
