import React from "react";
import BackgroundGradient from "../../Components/background";
import Carousel from "../../Components/carousel";
import Footer from "../../Components/footer";
import Title from "../../Components/title";
import Card from "../../Components/card";
import carruseFoto0 from "../../Assets/Carrusel con fotos/Portada-aniversario.jpg";
import carruseFoto1 from "../../Assets/Carrusel con fotos/1.jpg";
import carruseFoto2 from "../../Assets/Carrusel con fotos/2.jpg";
import carruseFoto3 from "../../Assets/Carrusel con fotos/3.jpg";
import carruseFoto4 from "../../Assets/Carrusel con fotos/4.jpg";
import carruseFoto5 from "../../Assets/Carrusel con fotos/5.jpg";
import carruseFoto6 from "../../Assets/Carrusel con fotos/6.jpg";
import jefeFoto from "../../Assets/Equipo Asegurar LTDA/Presidente.jpg";
import getenteFoto from "../../Assets/Equipo Asegurar LTDA/Gerencia.jpg";
import equipoFoto1 from "../../Assets/Equipo Asegurar LTDA/Jefatura-de-Red.jpg";
import equipoFoto2 from "../../Assets/Equipo Asegurar LTDA/Ingeniero-David.jpg";
import equipoFoto3 from "../../Assets/Equipo Asegurar LTDA/Asistente.jpg";
import equipoFoto4 from "../../Assets/Equipo Asegurar LTDA/Sebastian.jpg";
import equipoFoto5 from "../../Assets/Equipo Asegurar LTDA/Operador.jpg";
import equipoFoto6 from "../../Assets/Equipo Asegurar LTDA/Operadoa.jpg";
import lactiosSantaMaria from "../../Assets/iconsEnter/Lacteos Santa Maria png.png";
import coopsetrans from "../../Assets/iconsEnter/Coopsetrans.png";
import nuevoMilenio from "../../Assets/iconsEnter/Nuevo Milenio.png";
import sammiSaludsas from "../../Assets/iconsEnter/Samy-Salud-png.png";

export default function Home() {
  const handleEmailClick = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const carouselItem = [
    //objeto con informacion para incluir en el carrusel.+
    {
      id: 1,
      image: carruseFoto0,
      title: "¿Porque ?",
      descrip:
        "Contamos con una aplicación móvil CELLVI para sistemas operativos ANDROID Y IOS amigable y fácil de manejar",
    },
    {
      id: 2,
      image: carruseFoto1,
      title: "¿Porque ?",
      descrip:
        "Contamos con una aplicación móvil CELLVI para sistemas operativos ANDROID Y IOS amigable y fácil de manejar",
    },
    {
      id: 3,
      image: carruseFoto2,
      title: "APLICACIÓN MÓVIL",
      descrip:
        "Contamos con una aplicación móvil CELLVI para sistemas operativos ANDROID Y IOS amigable y fácil de manejar",
    },
    {
      id: 4,
      image: carruseFoto3,
      title: "PLATAFORMA CELLVI",
      descrip:
        "Nuestra Plataforma Tecnológica CELLVI, no está disponible en el mercado es propiedad industrial e intelectual de Asegurar Ltda.",
    },
    {
      id: 5,
      image: carruseFoto4,
      title: "MONITOREO PERMANENTE",
      descrip:
        "Mantenemos en operación una central de monitoreo 24/7 los 365 días del año.",
    },
    {
      id: 6,
      image: carruseFoto5,
      title: "MONITOREO PERMANENTE",
      descrip:
        "Mantenemos en operación una central de monitoreo 24/7 los 365 días del año.",
    },
    {
      id: 7,
      image: carruseFoto6,
      title: "MONITOREO PERMANENTE",
      descrip:
        "Mantenemos en operación una central de monitoreo 24/7 los 365 días del año.",
    },
  ];
  const title = {
    title: "Algunos de nuestros clientes",
    font: "35px", // Tamaño de fuente personalizado
    color: "grey", // Color de texto personalizado
    level: "h2",
  };
  const titleTeam = {
    title: "Conoce al equipo",
    font: "45px", // Tamaño de fuente personalizado
    color: "grey", // Color de texto personalizado
    level: "h2",
  };
  const aliados = [
    {
      src: lactiosSantaMaria,
      title: "Lacteos Santa Maria",
      link: "https://lacteossantamaria.com/",
      description: "Descripcion empresa",
    },
    {
      src: coopsetrans,
      title: "Coopsetrans",
      link: "https://coopsetrans.org/",
      description: "Descripcion empresa",
    },
    {
      src: nuevoMilenio,
      title: "Transportes Nuevo Milenio",
      link: "https://www.facebook.com/TRANSPORTESTNM/",
      description: "Descripcion empresa",
    },
    {
      src: sammiSaludsas,
      title: "IPS SamySalud SAS",
      link: "https://www.facebook.com/OficialSamySaludSas",
      description: "Descripcion empresa",
    },
  ];
  const jefes = [
    {
      name: "Rómulo Exmeling Bolaños Escobar",
      cargo: "Presidente",
      email: "romulo.bolanose@gmail.com",
      foto: jefeFoto,
    },
    {
      name: "Deyanira López Solarte",
      cargo: "Gerente General",
      email: "asegurar.limitada@gmail.com",
      foto: getenteFoto,
    },
  ];
  const empleados = [
    {
      name: "Pedro Andrés Valencia Medina",
      cargo: "Jefe de Red V.A.T.",
      email: "jefatura.red.asegurar@gmail.com",
      foto: equipoFoto1,
    },
    {
      name: "David Sebastian Montes Zarama",
      cargo: "Jefe de desarrollos tecnologicos",
      email: "dsmontes95@gmail.com",
      foto: equipoFoto2,
    },
    {
      name: "Johanna Yamile Guzmán Gaviria",
      cargo: "Asistene de Gerencia",
      email: "asistenteasegurar@gmail.com",
      foto: equipoFoto3,
    },
    {
      name: "Jeffer Sebastian Almeida Figueroa",
      cargo: "Comunicador Social",
      email: "saf.comsocial@gmail.com",
      foto: equipoFoto4,
    },
    {
      name: "Jose Rafael Agreda España",
      cargo: "Operador de Medios Tecnologicos",
      email: "centralmasegurar@gmail.com",
      foto: equipoFoto5,
    },
    {
      name: "Sandra Patricia Cuchala Andrade",
      cargo: "Operadora de Medios Tecnologicos",
      email: "centralmasegurar@gmail.com",
      foto: equipoFoto6,
    },
  ];
  const imgStyle = {
    height: "265px",
    width: "90%",
  };

  return (
    <div>
      <BackgroundGradient color1="#fff" color2="#fff ">
        <div className="">
          <Carousel item={carouselItem} />
        </div>
        <div className="container">
          <div className="m-3 shadow-sm p-2 text-center">
            <Title item={titleTeam} />
            <p>
              Un selecto equipo de profesionales de la información y las
              comunicaciones está a las órdenes de nuestros clientes, generando
              altos estándares de calidad en el servicio de AVL y otras ramas de
              la tecnología de punta.
            </p>
          </div>
          <div className="row align-items-center justify-content-center">
            {jefes.map((item, index) => (
              <div className="col-md-6 p-3" key={index}>
                <div
                  className="card text-center mx-auto"
                  style={{ width: "18rem" }}
                >
                  <img
                    src={item.foto}
                    alt={item.name}
                    className="img-fluid mx-auto p-3"
                    style={imgStyle}
                  />
                  <div className="card-body">
                    <h4 className="card-title">{item.name}</h4>
                    <hr />
                    <h5 className="card-title">{item.cargo}</h5>
                    <p
                      className="card-text link"
                      onClick={() => handleEmailClick(item.email)}
                    >
                      {item.email}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="row align-items-center justify-content-center">
            {empleados.map((item, index) => (
              <div className="col-md-4 pb-3" key={index}>
                <div
                  className="card text-center mx-auto"
                  style={{ width: "18rem" }}
                >
                  <img
                    src={item.foto}
                    alt={item.name}
                    className="img-fluid mx-auto p-3"
                    style={imgStyle}
                  />
                  <div className="card-body">
                    <h4 className="card-title">{item.name}</h4>
                    <hr />
                    <h5 className="card-title">{item.cargo}</h5>
                    <p className="card-text link">{item.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 container-fluid">
          <Title item={title} />
          <div className="row d-flex aling-items-center justify-content-center">
            {aliados.map((item, index) => (
              <div key={index} className="col-md-3 centered-card">
                <Card item={item} />
              </div>
            ))}
          </div>
        </div>
      </BackgroundGradient>
      <Footer />
    </div>
  );
}
