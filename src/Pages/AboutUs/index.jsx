import React, { useState, useEffect } from "react";
import BackgroundGradient from "../../Components/background";
import Footer from "../../Components/footer";
import InfoCard from "../../Components/infoCard";
import fotoAboutus from "../../Assets/Mision Vision/ASEGURAR.jpg";
import Mision from "../../Assets/Mision Vision/MISION.jpg";
import Vision from "../../Assets/Mision Vision/VISION.jpg";
import Politicas from "../../Assets/Mision Vision/POLITICAS.jpg";
import image from "../../Assets/triangulo1 png.png";
import imageIconFirst from "../../Assets/Satelite1 png.png";
import imageIconSecond from "../../Assets/Globo png.png";
import imageIconThirt from "../../Assets/Globo1 png.png";
import imageDescription from "../../Assets/Foto Portada/1.jpg";

export default function AboutUs() {
  const [content, setContent] = useState("Asegurar");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 425);
  const contentInfo = {
    //Contenido de la pagina de Acerca de nosotros, modificar en caso de cambiar la informacion
    Asegurar: {
      title: "ASEGURAR LTDA",
      paragraphs: [
        "Es una Red de Telecomunicaciones en la modalidad de Valor Agregado y Telemático, autorizada por el Ministerio de las Tecnologías de la Información y las Telecomunicaciones TIC., mediante Resolución No. 000656 de mayo del 2002 y, Registro TIC. No. 96000876 del 27 de octubre de 2011; para la prestación de servicios de tele acción: servicio básico de tele alarmas y telemáticos, satisfaciendo necesidades específicas de telecomunicaciones relacionadas con el monitoreo, la medición y la vigilancia.",
        "Proveedores de servicios GPS para maquinaria amarilla autorizados por la Oficina de Telemática de la Dirección General de la Policía Nacional de Colombia e, inscritos como prestadores de servicios ante el RUNT.",
        "Experiencia de 23 años en el ramo de las telecomunicaciones con domicilio principal en la ciudad de San Juan de Pasto – Nariño. Somos marca registrada. Prestamos servicios de monitoreo remoto de activos fijos y, móviles a través de nuestra plataforma tecnológica de telecomunicaciones CELLVI: (Central Especializada de Logística y Localización Vehicular Internacional).",
      ],
      image: fotoAboutus,
    },
    Mision: {
      title: "Mision",
      paragraphs: [
        "Como persona jurídica de derecho privado, presta a sus clientes y, suscriptores servicios de Telecomunicaciones en la modalidad de Valor Agregado y Telemático: (monitoreo remoto de activos fijos y móviles), generando modernas herramientas tecnológicas de control, administración, logística y seguridad; con el objeto de prevenir y disminuir las amenazas que afecten los legítimos derechos sobre los bienes y patrimonio de las personas que reciben nuestros productos y servicios. Para ello, mantenemos una estrecha coordinación con las Autoridades de la República, en todos los aspectos relacionados con la seguridad vial y ciudadana.",
      ],
      image: Mision,
    },
    Vision: {
      title: "Vision",
      paragraphs: [
        "Haciendo uso adecuado de las nuevas tecnologías de la Información y las Telecomunicaciones, en el corto, mediano y largo plazo buscara posicionarse a la vanguardia de las empresas del ramo de las Telecomunicaciones a nivel regional, nacional e internacional, suministrando a sus clientes bienes, productos y servicios que cumplan con los más altos estándares de excelencia y calidad total; aprovechando los talentos y capacidades de la Ingeniería Nariñense, la clave para el logro de nuestra visión será rodearnos de gente buena, capacitada, empoderada y, que sienta amor por lo que hace. ",
      ],
      image: Vision,
    },
    Politicas: {
      title: "Politicas institucionales",
      paragraphs: [
        "El Equipo de Trabajo de ASEGURAR LTDA., para el cabal cumplimiento de su misión y visión, ejecutara todas sus actividades, orientados siempre por las siguientes normas de comportamiento y conducta:",
        "1.- Acatar la Constitución Política de Colombia, las Leyes y, normas que rigen los principios de la libre y, leal competencia comercial de la empresa privada.",
        "2.- El resultado de las actuaciones de sus funcionarios, deben fortalecer la confianza en sus clientes y suscriptores.",
        "3.- Adoptar todas las medidas de prevención y control para evitar que los servicios que presta sean utilizados como instrumentos para la realización de actividades ilegales.",
        "4.- Mantener en todo momento altos niveles de eficiencia a través de una continua capacitación profesional y técnica de sus funcionarios.",
        "5.- Contribuir a las Autoridades de la República en la prevención del delito, sin invadir las orbitas constitucionales.",
        "6.- Prestar apoyo cuando las Autoridades así lo requieran en casos de calamidad publica o graves desastres naturales.",
        "7.- Mantener actualizados todos los registros legales que el Estado le ha otorgado para el funcionamiento como Red de Telecomunicaciones.",
        "8.- Salvaguardar la información confidencial que obtenga de sus clientes en desarrollo de los servicios que presta al público, mediante la política de tratamiento de datos personales.",
        "9.- Atender en debida forma las quejas y, reclamos de los usuarios, que por causa y razón de los servicios que reciben, vean afectado sus intereses, para lo cual implementara una robusta y, oportuna respuesta a través de su portal PQR.",
        "10.- Desarrollar mecanismos de control interno para prevenir que sus trabajadores y contratistas se involucren de manera directa o indirecta en la comisión de actos delictivos.",
        "11.- Dar estricto cumplimiento a las normas que rigen las relaciones obrero patronales, haciendo uso adecuado del reglamento interno de trabajo y, la política publica de salud y seguridad en el trabajo.",
        "12.- Los Socios, el Representante Legal y, los Trabajadores de la Sociedad comercial son ciudadanos Colombianos y/o extranjeros que cumplen los requisitos que las leyes de nuestro país exigen para el desempeño de sus cargos en cada uno de los escalones de la organización empresarial; para lo cual, siempre exhibirán sus certificados fiscales, disciplinarios, penales y, de contravenciones de policial vigentes.",
        "13.- En los eventos especiales en que la sociedad contrate con el sector público, observara y, cumplirá a cabalidad con las normas de las leyes de contratación estatal (ley 80 de 1993).",
      ],
      image: Politicas,
    },
  };
  const imageHeaderStyle = {
    height: "auto",
  };
  const iconsStyle = {
    width: "27px",
  };
  const iconHeaderStyle = {
    width: "40px",
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 425);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    closeMenu();
  }, [content]);

  const changeState = (value) => {
    setContent(value);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div>
      <BackgroundGradient color1="#fff" color2="#fff">
        <div className="w-100">
          <div>
            <img
              src={imageDescription}
              alt="Quienes_somos"
              style={imageHeaderStyle}
              className="img-fluid"
            />
          </div>
          <div className="container-fluid w-100 container position-relative overflow-hidden mt-4">
            <div className="row">
              {isMobile ? (
                <div className="col-md-4">
                  <div className="d-flex flex-column flex-shrink-0 p-3 bg-light">
                    <div
                      className="d-flex align-items-center mb-md-0 me-md-auto link-dark text-decoration-none"
                      onClick={toggleMenu}
                    >
                      <img
                        src={image}
                        alt="Asegurar"
                        className="img-fluid"
                        style={iconHeaderStyle}
                      />
                      <span className="fs-2 fw-normal text-muted">
                        Nosotros
                      </span>
                      {menuOpen ? (
                        <button
                          type="button"
                          className="btn-close ms-auto"
                          aria-label="Close"
                          onClick={closeMenu}
                        ></button>
                      ) : (
                        <button
                          type="button"
                          className="dropdown ms-auto"
                          aria-label="drop-down"
                          onClick={toggleMenu}
                        ></button>
                      )}
                    </div>
                    <ul
                      className={`nav nav-pills flex-column mb-auto collapse${
                        menuOpen ? " show" : ""
                      }`}
                    >
                      <hr />
                      <li className="nav-item">
                        <a
                          href="#asegurar"
                          onClick={() => changeState("Asegurar")}
                          className={`nav-link link-dark d-flex align-items-center ${
                            content === "Asegurar" ? "active" : ""
                          }`}
                        >
                          <img
                            src={imageIconFirst}
                            alt="AboutUs"
                            className="img-fluid"
                            style={iconsStyle}
                          />
                          <span className="fs-6 fw-normal">Asegurar</span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#mision"
                          onClick={() => changeState("Mision")}
                          className={`nav-link link-dark d-flex align-items-center ${
                            content === "Mision" ? "active" : ""
                          }`}
                        >
                          <img
                            src={imageIconSecond}
                            alt="AboutUs"
                            className="img-fluid"
                            style={iconsStyle}
                          />
                          <span className="fs-6 fw-normal">Mision</span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#vision"
                          onClick={() => changeState("Vision")}
                          className={`nav-link link-dark d-flex align-items-center ${
                            content === "Vision" ? "active" : ""
                          }`}
                        >
                          <img
                            src={imageIconThirt}
                            alt="AboutUs"
                            className="img-fluid"
                            style={iconsStyle}
                          />
                          <span className="fs-6 fw-normal">Vision</span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#politicas"
                          onClick={() => changeState("Politicas")}
                          className={`nav-link link-dark d-flex align-items-center ${
                            content === "Politicas" ? "active" : ""
                          }`}
                        >
                          <img
                            src={imageIconThirt}
                            alt="AboutUs"
                            className="img-fluid"
                            style={iconsStyle}
                          />
                          <span className="fs-6 fw-normal">
                            Politicas institucionales
                          </span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="col-md-4">
                  <div className="d-flex flex-column flex-shrink-0 p-3 bg-light">
                    <a
                      href="#asegurar"
                      className="d-flex align-items-center mb-md-0 me-md-auto link-dark text-decoration-none"
                      onClick={() => changeState("Asegurar")}
                    >
                      <img
                        src={image}
                        alt="Asegurar"
                        className="img-fluid"
                        style={iconHeaderStyle}
                      />
                      <span className="fs-2 fw-normal text-muted">
                        Nosotros
                      </span>
                    </a>
                    <hr />
                    <ul className="nav nav-pills flex-column mb-auto">
                      <li className="nav-item">
                        <a
                          href="#asegurar"
                          onClick={() => changeState("Asegurar")}
                          className={`nav-link link-dark d-flex align-items-center ${
                            content === "Asegurar" ? "active" : ""
                          }`}
                        >
                          <img
                            src={imageIconFirst}
                            alt="AboutUs"
                            className="img-fluid"
                            style={iconsStyle}
                          />
                          <span className="fs-6 fw-normal">Asegurar</span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#mision"
                          onClick={() => changeState("Mision")}
                          className={`nav-link link-dark d-flex align-items-center ${
                            content === "Mision" ? "active" : ""
                          }`}
                        >
                          <img
                            src={imageIconSecond}
                            alt="AboutUs"
                            className="img-fluid"
                            style={iconsStyle}
                          />
                          <span className="fs-6 fw-normal">Mision</span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#vision"
                          onClick={() => changeState("Vision")}
                          className={`nav-link link-dark d-flex align-items-center ${
                            content === "Vision" ? "active" : ""
                          }`}
                        >
                          <img
                            src={imageIconThirt}
                            alt="AboutUs"
                            className="img-fluid"
                            style={iconsStyle}
                          />
                          <span className="fs-6 fw-normal">Vision</span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#politicas"
                          onClick={() => changeState("Politicas")}
                          className={`nav-link link-dark d-flex align-items-center ${
                            content === "Politicas" ? "active" : ""
                          }`}
                        >
                          <img
                            src={imageIconThirt}
                            alt="AboutUs"
                            className="img-fluid"
                            style={iconsStyle}
                          />
                          <span className="fs-6 fw-normal">
                            Politicas institucionales
                          </span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
              <div className="col-md-8">
                <div className="tab-content" id="nav-tabContent">
                  <div
                    className="tab-pane fade show active"
                    id="list-home"
                    role="tabpanel"
                    aria-labelledby="list-home-list"
                  >
                    <InfoCard
                      title={contentInfo[content].title}
                      paragraphs={contentInfo[content].paragraphs}
                      image={contentInfo[content].image}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BackgroundGradient>
      <Footer />
    </div>
  );
}
