import React from "react";
import BackgroundGradient from "../../Components/background";
import Carousel from "../../Components/carousel";
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
import sgsstFoto from "../../Assets/Equipo Asegurar LTDA/SGSST.jpeg";
import equipoFoto1 from "../../Assets/Equipo Asegurar LTDA/Jefatura-de-Red.jpg";
import equipoFoto2 from "../../Assets/Equipo Asegurar LTDA/Ingeniero-David.jpg";
import equipoFoto3 from "../../Assets/Equipo Asegurar LTDA/Asistente.jpg";
import equipoFoto5 from "../../Assets/Equipo Asegurar LTDA/Operador.jpg";
import equipoFoto6 from "../../Assets/Equipo Asegurar LTDA/Operadoa.jpg";
import equipoFoto4 from "../../Assets/Equipo Asegurar LTDA/cristian.jpeg";
import lactiosSantaMaria from "../../Assets/iconsEnter/Lacteos Santa Maria png.png";
import coopsetrans from "../../Assets/iconsEnter/Coopsetrans.png";
import nuevoMilenio from "../../Assets/iconsEnter/Nuevo Milenio.png";
import sammiSaludsas from "../../Assets/iconsEnter/Samy-Salud-png.png";
import ProfileCard from "../../Components/profileCard";

export default function Home() {
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
    title: "Conoce nuestro equipo de trabajo",
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

  const empleados = [
    {
      name: "Rómulo Exmeling Bolaños Escobar",
      cargo: "Presidente",
      email: "romulo.bolanose@gmail.com",
      foto: jefeFoto,
      descript:
        "Administrador de Empresas, Profesional en Ciencias Militares. Asesor en Seguridad.",
    },
    {
      name: "Deyanira López Solarte",
      cargo: "Gerente General",
      email: "asegurar.limitada@gmail.com",
      foto: getenteFoto,
      descript:
        "Administradora de Empresas, 20 años de experiencia en manejo de personal y finanzas.",
    },
    {
      name: "Valentina Ledesma Marin",
      cargo: "Responsable SG-SST",
      email: "sstvalentina8@gmail.com",
      foto: sgsstFoto,
      descript:
        "Profesional en administración en seguridad y salud en el trabajo y auditora HSEQ.",
    },
    {
      name: "Pedro Andrés Valencia Medina",
      cargo: "Administrador Plataforma de Monitoreo CELLVI.",
      email: "jefatura.red.asegurar@gmail.com",
      foto: equipoFoto1,
      descript:
        "Licenciado en informatica de la Universidad de Nariño. 15 Años de experiencia en administracion de plataformas tecnologicas de monitoreo remoto de vehiculos.",
    },
    {
      name: "David Sebastian Montes Zarama",
      cargo: "Jefe de Desarrollos Tecnológicos",
      email: "dsmontes95@gmail.com",
      foto: equipoFoto2,
      descript:
        "Ingeniero Electronico de la Universidad de Nariño. Desarrollador FullStack",
    },
    {
      name: "Johanna Yamile Guzmán Gaviria",
      cargo: "Asistente de Gerencia",
      email: "asistenteasegurar@gmail.com",
      foto: equipoFoto3,
      descript:
        "Secretaria ejecutiva, especiaalista en manejo de paquetes contables SIIGO, y administración de cartera de clientes.",
    },
    {
      name: "Jose Rafael Agreda España",
      cargo: "Operador de Medios Tecnológicos",
      email: "centralmasegurar@gmail.com",
      foto: equipoFoto5,
      descript:
        "Tecnologo en sistemas, especializados en manejo y control de flotas, desde centrales de monitoreo remotas.",
    },
    {
      name: "Sandra Patricia Cuchala Andrade",
      cargo: "Operadora de Medios Tecnólogicos",
      email: "centralmasegurar@gmail.com",
      foto: equipoFoto6,
      descript:
        "Tecnologo en sistemas, especializados en manejo y control de flotas, desde centrales de monitoreo remotas.",
    },
    {
      name: "Cristian Javier Ojeda Bolaños",
      cargo: "Operadora de Medios Tecnólogicos",
      email: "centralmasegurar@gmail.com",
      foto: equipoFoto4,
      descript:
        "Tecnologo en sistemas, especializados en manejo y control de flotas, desde centrales de monitoreo remotas.",
    },
  ];

  return (
    <div>
      <BackgroundGradient color1="#fff" color2="#fff ">
        {/* <div className="container-lg">
          <div className="error-message">
            <div className="error-content">
              <h2>Alerta!</h2>
              <p className="h4">
                Se informa a todos nuestros usuarios y suscriptores que por
                cambio de Tecnología, la Plataforma CELLVI estará fuera del aire
                hasta las 06:00 p.m. Presentamos disculpas por los
                inconvenientes generados.
              </p>
            </div>
          </div>
        </div> mensaje de error, descomentar y poner mensaje requerido 23/03/2024*/}
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
        </div>
        <div className="">
          <ProfileCard cards={empleados} />
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
    </div>
  );
}
