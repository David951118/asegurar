import React from "react";
import BackgroundGradient from "../../Components/background";
import Footer from "../../Components/footer";
import imageDescription from "../../Assets/Foto Portada/1.jpg";
import { MDBAccordion, MDBAccordionItem } from "mdb-react-ui-kit";

export default function Legality() {
  let info = {
    title: "Legalidad",
    titleDescription:
      "Asegurar limitada se encuentra legalizada por los organismos publicos del estado Colombiano que normatizan y supervisan su actividad comercial, así:.",
  };
  const imageHeaderStyle = {
    height: "auto",
  };

  const legalidad = [
    {
      title:
        "EL MINISTERIO DE TECNOLOGIAS DE LA INFORMACION Y COMUNICACIONES MIN TIC",
      content:
        "En virtud de la ley 1341 DE 2009, en atención a sus artículos 10 y 15, Decreto 4948 de 2009, Decreto 091 de 2010, se incorpora a ASEGURAR LTDA en el registro de TIC RTIC 96000876 y se da formalmente surtida la habilitación general para la provisión de redes y/o servicios de telecomunicaciones.",
    },
    {
      title: "MINISTERIO DE DEFENSA NACIONAL",
      subTitle: "POLICIA NACIONAL",
      content:
        "Mediante Resolución 02086, de 30 de mayo de 2014 y en atención a su artículo 3, por la cual se fijan las condiciones técnicas del equipo, instalación, identificación, funcionamiento y monitoreo del sistema de posicionamiento global (GPS), así como la autorización a la firma ASEGURAR LTDA   de proveedores de servicios de rastreo y localización de vehículos vía satélite.",
    },
    {
      title: "SUPERINTENDENCIA DE INDUSTRIA Y COMERCIO",
      content:
        "En virtud de la resolución N° 33070, por la cual se concede el registro de la Marca ASEGURAR LTDA y se asigna el derecho concedido de inscripción en los libros de propiedad industrial.",
    },
    {
      title: "SUPERVIGILANCIA",
      subTitle: "EL SUPERINTENDENTE DE VIGILANCIA Y SEGURIDAD PRIVADA",
      content:
        "Mediante resolución N° 001720 de 09 de mayo de 2008, autoriza la licencia de funcionamiento a la empresa de vigilancia y seguridad privada denominada ASEGURAR LTDA.",
    },
    {
      title: "MINISTERIO DE COMUNICACIONES",
      subTitle: "VICEMINISTERIO DE COMUNICACIONES",
      content:
        "En virtud de la Resolución 000656 de 2002 por la cual se autoriza y otorga licencia a la firma ASEGURAR LTDA para la prestación del servicio de telecomunicaciones, en la modalidad de valor agregado y telemático y se autoriza al establecimiento de su respectiva red.",
    },
    {
      title: "CAMARA DE COMERCIO DE PASTO",
      content:
        "Sociedad de Responsabilidad Limitada, con domicilio principal en la ciudad de San Juan de Pasto (Nariño), Sucursal internacional en Tulcan-Carchi-Ecuador. Matricula mercantil No. 75404 de noviembre de 2001, con una experiencia comprobada de 22 años en el área de las telecomunicaciones.",
    },
    {
      title: "MINISTERIO DE DEFENSA NACIONAL",
      subTitle: "POLICIA NACIONAL",
      content:
        "En virtud del DECRETO No 723 del 10 de abril de 2014, por el cual se establecen medidas para regular, registrar y controlar la importación y movilización de maquinaria amarilla y se autoriza ASEGURAR LTDA como proveedor del servicio ",
    },
    {
      title: "SUPERINTENDENCIA DE INDUSTRIA Y COMERCIO",
      content:
        "En concordancia a la Ley 1480 de 2011 Capitulo V y VII –Estatuto del Consumidor donde se hace acápite al Comercio Electrónico, ASEGURAR LTDA protege y garantiza la realización de actos, negocios u operaciones mercantiles concertados a través del intercambio de mensajes de datos telemáticamente cursados entre proveedores y los consumidores para la comercialización de productos y servicios",
    },
    {
      title: "POLITICA DE TRATAMIENTO DE DATOS PERSONALES",
      content:
        "ASEGURAR LTDA a la luz  del  artículo 15 de la Carta Magna, Ley 1581 de 17 de Oct de 2017, DECRETO Único 1074 de 2015, consciente de la responsabilidad que les asiste en materia de Tratamiento de Datos Personales de los titulares, garantiza el derecho constitucional que tienen todas las personas a conocer, actualizar, rectificar, suprimir y revocar la autorización respecto a las informaciones que hayan recogido sobre ellas en las bases de datos que la Empresa , ha recopilado para las finalidades previstas en la Ley y en las autorizaciones respectivas, las cuales han sido tratadas conforme a lo establecido por el régimen nacional de protección de datos personales.",
    },
  ];

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
          <div className="p-3 container justify-content-center">
            <div className="p-lg-5 mx-auto text-center row">
              <h1 className="display-3 fw-bold text-center">{info.title}</h1>
              <h3 className="fw-normal text-muted mb-3 text-center">
                {info.titleDescription}
              </h3>
            </div>
          </div>
          <div className="container">
            <MDBAccordion initialActive={1}>
              {legalidad.map((item, index) => (
                <MDBAccordionItem
                  collapseId={index + 1}
                  headerTitle={item.title}
                  key={index}
                >
                  {item.subTitle ? <h5>{item.subTitle}</h5> : <></>}
                  {item.content}
                </MDBAccordionItem>
              ))}
            </MDBAccordion>
          </div>
        </div>
      </BackgroundGradient>
      <Footer />
    </div>
  );
}
