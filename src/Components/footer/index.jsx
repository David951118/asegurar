import React from "react";
import {
  MDBFooter,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
} from "mdb-react-ui-kit"; //ToDO dsireccion en 2 renglones
import { NavLink } from "react-router-dom";

export default function Footer() {
  const menuItems = [
    { name: "Inicio", path: "/", activeClassName: "text-blue" },
    {
      name: "Quienes somos",
      path: "/acercadenosotros",
      activeClassName: "text-blue",
    },
    { name: "Servicios", path: "/servicios", activeClassName: "text-blue" },
    { name: "Contacto", path: "/contacto", activeClassName: "text-blue" },
    { name: "Blog", path: "/blog", activeClassName: "text-blue" },
    {
      name: "Politica de privacidad",
      path: "/politica-de-privacidad",
      activeClassName: "text-blue",
    },
    { name: "Legalidad", path: "/legalidad", activeClassName: "text-blue" },
     { name: "Administración", path: "/admin-login", activeClassName: "text-blue" },
    {
      name: "COMPARTE TU UBICACION",
      path: "/ubicacion",
      activeClassName: "text-blue",
    },
    // {
    //   name: "Portal de Pagos",
    //   path: "/portaldepagos",
    //   activeClassName: "text-blue",
    // },
  ];

  return (
    <MDBFooter
      bgColor="light"
      className="text-center text-lg-start text-muted "
    >
      <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom ">
        <div className="me-5 d-none d-lg-block">
          <span>Conéctate con nosotros en las redes sociales:</span>
        </div>

        <div>
          <a
            href="https://www.facebook.com/asegurar.limitada"
            className="me-4 text-reset"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MDBIcon fab icon="facebook-f" />
          </a>
          <a
            href="https://www.twitter.com/tucuenta"
            className="me-4 text-reset"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MDBIcon fab icon="twitter" />
          </a>
          <a
            href="https://www.google.com/maps/place/ASEGURAR+LTDA./@1.2200628,-77.2905461,17z/data=!3m1!4b1!4m6!3m5!1s0x8e2ed380203ad0d7:0xecb75e7dba491732!8m2!3d1.2200574!4d-77.2879712!16s%2Fg%2F11cs1w8dk4?entry=ttu"
            className="me-4 text-reset"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MDBIcon fab icon="google" />
          </a>
          <a
            href="https://www.instagram.com/asegurar.ltda/"
            className="me-4 text-reset"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MDBIcon fab icon="instagram" />
          </a>
          <a
            href="https://www.linkedin.com/company/asegurar-ltda/about/"
            className="me-4 text-reset"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MDBIcon fab icon="linkedin" />
          </a>
        </div>
      </section>

      <section className="">
        <MDBContainer className="text-center text-md-start mt-5">
          <MDBRow className="mt-3">
            <MDBCol md="3" lg="4" xl="3" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">
                <MDBIcon icon="gem" className="me-3" />
                Asegurar Limitada
              </h6>
              <p>
                Empresa Nariñense autorizada por el Ministerio de Comunicaciones
                de Colombia para operar nuestra red de telecomunicaciones.
              </p>
            </MDBCol>

            <MDBCol md="2" lg="2" xl="2" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Productos</h6>
              <NavLink
                to={menuItems[0].path}
                className={`nav-link ${menuItems[0].activeClassName}`}
              >
                <p className="text-reset">{menuItems[0].name}</p>
              </NavLink>

              <NavLink
                to={menuItems[1].path}
                className={`nav-link ${menuItems[1].activeClassName}`}
              >
                <p className="text-reset">{menuItems[1].name}</p>
              </NavLink>

              <NavLink
                to={menuItems[2].path}
                className={`nav-link ${menuItems[2].activeClassName}`}
              >
                <p className="text-reset">{menuItems[2].name}</p>
              </NavLink>

              <NavLink
                to={menuItems[3].path}
                className={`nav-link ${menuItems[3].activeClassName}`}
              >
                <p className="text-reset">{menuItems[3].name}</p>
              </NavLink>
            </MDBCol>

            <MDBCol md="3" lg="2" xl="2" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">utilidades</h6>

              <NavLink
                to={menuItems[4].path}
                className={`nav-link ${menuItems[4].activeClassName}`}
              >
                <p className="text-reset">{menuItems[4].name}</p>
              </NavLink>

              <NavLink
                to={menuItems[5].path}
                className={`nav-link ${menuItems[5].activeClassName}`}
              >
                <p className="text-reset">{menuItems[5].name}</p>
              </NavLink>

              <NavLink
                to={menuItems[6].path}
                className={`nav-link ${menuItems[6].activeClassName}`}
              >
                <p className="text-reset">{menuItems[6].name}</p>
              </NavLink>

              <NavLink
                to={menuItems[7].path}
                className={`nav-link ${menuItems[7].activeClassName}`}
              >
                <p className="text-reset">{menuItems[7].name}</p>
              </NavLink>
            </MDBCol>

            <MDBCol md="4" lg="3" xl="3" className="mx-auto mb-md-0 mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Contacto</h6>
              <p>
                <MDBIcon icon="home" className="me-2" />
                Calle 19 No 27 - 41 Piso 2 Oficina 202 Edificio Merlopa,
                Pasto-Nariño-Colombia
              </p>
              <p>
                <MDBIcon icon="envelope" className="me-3" />
                asegurar.limitada@gmail.com
              </p>
              <p>
                <MDBIcon icon="phone" className="me-3" /> +57 3155870498
              </p>
              <p>
                <MDBIcon icon="phone" className="me-3" /> +57 3187500962
              </p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <div
        className="text-center p-4 bg-dark text-white"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
      >
        DERECHOS DE AUTOR © 2023 Copyright: Derechos de autor y propiedad
        industrial e intelectual :
        <a className="text-reset fw-bold" href="https://www.asegurar.com.co/">
          Asegurar limitada
        </a>
      </div>
    </MDBFooter>
  );
}
