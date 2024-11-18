import React, { useState, useEffect } from "react";
import BackgroundGradient from "../../Components/background";
import Noticia from "./noticia";
import Vision from "../../Assets/Mision Vision/POLITICAS.jpg";
import BlogAsegurar from "../../Assets/BlogProvicional.png";
import fotografiapost from "../../Assets/Foto Portada/WhatsApp Image 2023-11-11 at 10.47.56 AM.jpeg";
import miniFotoPost from "../../Assets/Foto Portada/WhatsApp Image 2023-11-09 at 2.45.28 PM.jpeg";
import fotoCliente1 from "../../Assets/iconsEnter/Coopsetrans.png";
import fotoCliente2 from "../../Assets/iconsEnter/Samy-Salud-png.png";
import fotoCliente3 from "../../Assets/iconsEnter/Lacteos Santa Maria png.png";
import chucunes from "../../Assets/blog/chucunes.jpeg";
import chucunesinseguro from "../../Assets/blog/inseguridad_0_1.jpeg";
import tencnologiaMini from "../../Assets/blog/miniFotoTecnologia.png";
import tencnologia from "../../Assets/blog/Tecnologia.jpeg";
import asegurar from "../../Assets/Foto Portada/DSCF7863.jpg";
import fotoApp from "../../Assets/Foto Portada/cellvi.jpg";

export default function Blog() {
  const [blog, setBlog] = useState(0);
  const [colMd8Ref, setColMd8Ref] = useState(null);
  const [scrollToRef, setScrollToRef] = useState(false);

  useEffect(() => {
    if (scrollToRef && colMd8Ref) {
      colMd8Ref.scrollIntoView({ behavior: "smooth" });
      setScrollToRef(false);
    }
  }, [scrollToRef, colMd8Ref]);

  const handleButtonClick = (newBlogId) => {
    if (newBlogId >= 0 && newBlogId < noticia.length) {
      setBlog(newBlogId);
      setScrollToRef(true);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (document.readyState === "complete") {
        setScrollToRef(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const noticia = [
    {
      titulo: "MANUAL ACTUALIZACION APP CELLVI ANDROID",
      titulo2: "Actualiza la app de Asegurar!",
      fecha: "14 Noviembre 2024",
      resumen1: "Manual para actualizar foto",
      minifoto: fotoApp,
      creador: "David Montes",
      contenido: [
        {
          tipo: "pdf",
          texto:
            "/Manual de Actualizacion de app móvil CELLVI Android.pdf",
        },
      ],
    },
    {
      titulo: "NOVEDADES ASEGURAR OCTUBRE",
      titulo2: "Noticias importantes en Asegurar!",
      fecha: "16 Octubre 2024",
      resumen1: "Noticias mes de Octubre 2024",
      minifoto: asegurar,
      creador: "Romulo Bolaños",
      contenido: [
        {
          tipo: "parrafo",
          texto:
            "1.- ASEGURAR LTDA, se une a los sentimientos de dolor por la sensible pérdida de la Señora BLANCA LUCINDA CÓRDOBA DE RAMOS, insigne cliente de nuestro sistema de ubicación vehicular por largos años. Paz en su tumba y, nuestras condolencias a todos sus familiares.",
        },
        {
          tipo: "parrafo",
          texto:
            "2.- ASEGURAR LTDA, ha incursionado en los servicios de ubicación vehicular a flotas de transporte fluvial, nos enorgullece contar con uno de nuestros primeros clientes en el Departamento del Putumayo, con vehículos que surcan los ríos de la amazonia. ",
        },
        {
          tipo: "parrafo",
          texto:
            "3.- ASEGURAR LTDA., se permite informar a sus distinguidos clientes en la exprovincia de Obando y, que realizaban sus pagos en el punto de recaudo en el barrio Obrero de la ciudad de Ipiales, que a partir del 01 de octubre de 2024, ese punto quedó desactivado por asuntos de orden administrativo y fiscal, a partir de la fecha los pagos deben realizarse por cualquiera de los medios electrónicos de los bancos AGRARIO DE COLOMBIA, GRUPO AVAL, COLOMBIA y, sistema NEQUI. ",
        },
        {
          tipo: "parrafo",
          texto:
            "4.- Con mucha satisfacción informamos a nuestra distinguida clientela de Colombia y Ecuador que a partir del 01 de noviembre del año 2024 podrán ejecutar sus pagos a través de nuestra página web por el portal de pagos WOMPY y, BANCO DE COLOMBIA CON CÓDIGO QR, paga dando click en el siguiente link",
        },
        {
          tipo: "link",
          texto: "https://www.asegurar.com.co/portaldepagos",
        },
      ],
    },
    // {
    //   titulo: "NOVEDADES ASEGURAR",
    //   titulo2: "Noticias importantes en Asegurar!",
    //   fecha: "20 Julio 2024",
    //   resumen1: "Noticias mes de Julio 2024",
    //   minifoto: asegurar,
    //   creador: "Romulo Bolaños",
    //   contenido: [
    //     {
    //       tipo: "parrafo",
    //       texto:
    //         "1.- ASEGURAR LTDA., se unió al paro camionero organizado por la Asociación Colombiana de Camioneros Seccional Nariño, llevando la solidaridad a este gremio que enlaza con fuerza la cadena productiva de la Economía. La economía del País se mide por el número de vueltas que da la rueda de un camión en las carreteras.",
    //     },
    //     {
    //       tipo: "parrafo",
    //       texto:
    //         "2.- ASEGURAR LTDA., presenta un saludo de felicitación a todas las organizaciones gremiales y asociaciones de camioneros de Nariño, con motivo de la celebración de la Virgen del Carmen, en ese sentido nos hemos vinculado con la Asociación de Camioneros de Jose Maria Hernandez - Corregimiento del Municipio de Pupiales con la donación de un equipo de transmisión de datos satelitales para el ganador del concurso de GINCANA.",
    //     },
    //     {
    //       tipo: "parrafo",
    //       texto:
    //         "3.- Próximamente estará al servicio de nuestros clientes el portal de pagos WOMPY, a través de nuestra página web, publicaremos en los dias venideros publicaremos un video interactivo y explicativo de los procesos para pagar por esta plataforma, buscamos en todo momento la comodidad de nuestros clientes sin necesidad de acudir a los bancos o corresponsales.",
    //     },
    //   ],
    // },
    {
      titulo: "EFECTIVIDAD DE ASEGURAR",
      titulo2: "¡Acciones inmediatas y efectivas!",
      fecha: "5 Mayo 2024",
      resumen1:
        "Noticia importante sobre un caso de efectividad en nuestro servicio",
      minifoto: chucunes,
      creador: "Ing David Montes",
      contenido: [
        {
          tipo: "parrafo",
          texto:
            "En un acto de colaboración entre la Policía Nacional , el Ejército Nacional de Colombia y nuestra empresa Asegurar LTDA, se logró un importante hito en la lucha contra la piratería terrestre el pasado 23 de marzo de 2024. El vehículo identificado con las placas S** 2**, que había sido asaltado en la ruta de Pasto a Tumaco - Nariño, en el sector de CHUCUNES, vereda San Isidro, fue recuperado exitosamente.",
        },
        {
          tipo: "parrafo",
          texto:
            "El asalto a vehículos en estas rutas ha sido una preocupación creciente en la región, afectando tanto a comerciantes como a ciudadanos comunes que transitan por estas vías con el objetivo de llevar a cabo sus actividades diarias. Este tipo de actos no solo representan una amenaza para la seguridad de los individuos, sino que también tienen un impacto negativo en la economía local y nacional.",
        },
        {
          tipo: "parrafo",
          texto:
            "El trabajo conjunto entre las fuerzas de seguridad colombianas y el personal de ASEGURAR fue fundamental para el éxito de esta operación. La rápida respuesta y coordinación entre los involucrados permitió la ubicación y recuperación del vehículo en tiempo récord. Este logro no solo representa un golpe contra la piratería terrestre, sino que también envía un mensaje claro de que ASEGURAR esta comprometida con la seguridad de sus clientes y la calidad de su servicio.",
        },
        {
          tipo: "parrafo",
          texto:
            "La recuperación del vehículo S** 2** es un ejemplo tangible de los esfuerzos continuos que se están realizando para garantizar la seguridad en las carreteras colombianas. Sin embargo, queda claro que aún queda mucho trabajo por hacer. Es necesario seguir fortaleciendo las estrategias de seguridad, así como fomentar la cooperación ciudadana para prevenir y enfrentar este tipo de incidentes.",
        },
        {
          tipo: "parrafo",
          texto:
            "Este éxito debe servir como un recordatorio de la importancia de la colaboración entre las autoridades y la comunidad en la construcción de entornos seguros y libres de violencia. Solo a través de un esfuerzo conjunto y continuo podremos enfrentar eficazmente los desafíos de la piratería terrestre y otros tipos de delitos que afectan a nuestra sociedad.",
        },
        {
          tipo: "parrafo",
          texto:
            "La recuperación del vehículo S** 2** es un paso adelante en la dirección correcta, pero debemos mantenernos vigilantes y comprometidos en nuestra lucha por la seguridad y comodidad de todos los clientes de ASEGURAR.",
        },
        {
          tipo: "parrafo",
          texto:
            "¡Sigamos adelante juntos en esta importante tarea! En ASEGURAR siempre estaremos dispuestos a atender todas sus dudas.",
        },
        {
          tipo: "imagen",
          url: chucunesinseguro,
          alt: "Chucunes",
        },
      ],
    },
    {
      titulo: "Nuevas mejoras en ASEGURAR LTDA.",
      titulo2: "¡Más eficiencia y seguridad para nuestros clientes!",
      fecha: "5 Mayo 2024",
      resumen1:
        "Últimas actualizaciones en tecnología y servicios de ASEGURAR LTDA.",
      minifoto: tencnologiaMini,
      creador: "Ing. David Montes",
      contenido: [
        {
          tipo: "parrafo",
          texto:
            "ASEGURAR LTDA. se complace en informar a sus clientes y suscriptores sobre las últimas mejoras implementadas en nuestros servicios tecnológicos. Hemos subido a la plataforma CELLVI una moderna herramienta que permite acceder a las rutas de trazabilidad de sus rodantes en microsegundos.",
        },
        {
          tipo: "parrafo",
          texto:
            "Esta nueva herramienta representa un avance significativo en nuestra capacidad para monitorear y gestionar la seguridad de sus vehículos de manera más eficiente. La trazabilidad en tiempo real nos permite responder rápidamente ante cualquier incidente y garantizar la integridad de su carga y personal.",
        },
        {
          tipo: "parrafo",
          texto:
            "Además, en ASEGURAR LTDA. seguimos comprometidos con la mejora continua de nuestros servicios. Estamos desarrollando constantemente más variables de control para satisfacer las necesidades cambiantes de nuestros clientes y ofrecerles una experiencia aún más segura y confiable.",
        },
        {
          tipo: "parrafo",
          texto:
            "Pero eso no es todo, también queremos informarles que hemos realizado una actualización en la tecnología de nuestro servidor principal. Esta actualización nos ha permitido mejorar significativamente el rendimiento y la estabilidad de nuestros sistemas.",
        },
        {
          tipo: "parrafo",
          texto:
            "Gracias a estas mejoras, nuestros servicios ahora funcionan mucho mejor que antes, brindándoles a nuestros clientes una experiencia más fluida y confiable en cada interacción con ASEGURAR LTDA.",
        },
        {
          tipo: "imagen",
          url: tencnologia,
          alt: "Tecnologia",
        },
      ],
    },
    {
      titulo: "LANZAMIENTO OFICIAL ASEGURAR.COM.CO",
      titulo2: "¡Bienvenidos a la Nueva Era: Ahora en React!",
      fecha: "18 Diciembre 2023",
      resumen1:
        "En este blog ecuentras informacion, sobre las actualizaciones de la pagina web",
      minifoto: Vision,
      creador: "Ing David Montes",
      contenido: [
        { tipo: "parrafo", texto: "Estimada comunidad de ASEGURAR LTDA" },
        {
          tipo: "parrafo",
          texto:
            "Es un placer para nosotros anunciar un emocionante cambio en nuestra presencia en línea. ¡Hemos dado un salto importante y nos hemos actualizado a React! Después de años de compromiso con una versión estática en HTML, hemos decidido llevar la experiencia de usuario de nuestra página web al siguiente nivel.",
        },
        { tipo: "titulo", texto: "¿Qué significa esto para ti?" },
        {
          tipo: "lista",
          textos: [
            "Experiencia de Usuario Mejorada: La transición a React nos permite ofrecer una navegación más suave y un rendimiento más rápido, lo que se traduce en una experiencia de usuario mejorada.",
            "Interactividad Avanzada: Ahora podemos implementar características interactivas y dinámicas de manera más eficiente, brindándote contenido de alta calidad de una manera más atractiva.",
            "Mantenimiento Eficiente: React simplifica el mantenimiento del código, lo que nos permite responder rápidamente a los comentarios y asegurarnos de que nuestro sitio web esté siempre actualizado.",
          ],
        },
        {
          tipo: "parrafo",
          texto: "Te invitamos a explorar la nueva pagina web!",
        },
        {
          tipo: "imagen",
          url: BlogAsegurar,
          alt: "LANZAMIENTO OFICIAL ASEGURAR.COM.CO",
        },
        {
          tipo: "minifoto",
          url: Vision,
          alt: "LANZAMIENTO OFICIAL ASEGURAR.COM.CO",
        },
      ],
    },
    {
      titulo: "SG-SST ASEGURAR LTDA",
      titulo2: "Seguridad y salud en el trabajo!",
      fecha: "18 Diciembre 2023",
      resumen1:
        "En este blog ecuentras informacion, sobre las actualizaciones de la pagina web",
      minifoto: miniFotoPost,
      creador: "valentina Ledesma",
      contenido: [
        {
          tipo: "parrafo",
          texto:
            "ASEGURAR LTDA trabaja por la protección de sus trabajadores, la promoción de la salud y seguridad en el desarrollo de sus operaciones, reconociendo el desempeño ejemplar en materia de seguridad y salud en el trabajo, generando las directrices bajo las cuales ASEGURAR LTDA, desarrollará la estrategias por medio de procesos, mediante la implementación de controles para los peligros identificados, riesgos valorados, el cumplimiento de la legislación aplicable y actividades de implementación, mantenimiento, control y mejoramiento continuo, que conlleve a la preservación de la salud orgánica y mental de nuestros colaboradores, ofreciendo lugares de trabajo seguros evitando así la ocurrencia de incidentes, accidentes y enfermedades laborales",
        },
        {
          tipo: "parrafo",
          texto:
            "Seguridad y Salud en el Trabajo de ASEGURAR LTDA genera interés en el desarrollo integral de sus diferentes dimensiones: física, mental, social y espiritual, a través de 3 principios:",
        },
        {
          tipo: "parrafo",
          texto:
            "Principio de Reconocimiento: Dirigido a identificar los peligros, evaluar, valorar los riesgos y definir controles, basados en los conceptos técnicos y cumpliendo los lineamientos legales de nuestro País.",
        },
        {
          tipo: "parrafo",
          texto:
            "Principio de Construcción: Orientado al desarrollo de estrategias para acompañar a los grupos de interés a ser conscientes de la prevención y protección de su salud y seguridad.",
        },
        {
          tipo: "parrafo",
          texto:
            "Principio de Progreso: Nos impulsa a asumir los retos, cambios y necesidades que se van presentando en pro de la mejora continua del SG-SST.",
        },
        { tipo: "titulo", texto: "IMPORTANCIA DE CONTAR CON UN SG-SST" },
        {
          tipo: "lista",
          textos: [
            "Principio de Reconocimiento: Dirigido a identificar los peligros, evaluar, valorar los riesgos y definir controles, basados en los conceptos técnicos y cumpliendo los lineamientos legales de nuestro País.",
            "Principio de Construcción: Orientado al desarrollo de estrategias para acompañar a los grupos de interés a ser conscientes de la prevención y protección de su salud y seguridad.",
            "Principio de Progreso: Nos impulsa a asumir los retos, cambios y necesidades que se van presentando en pro de la mejora continua del SG-SST.",
          ],
        },
        {
          tipo: "parrafo",
          texto:
            "Una correcta ejecución e implementación de un SG-SST, aportara a la empresa una buena imagen corporativa y plasmara un ambiente de bienestar laboral, en vista de la disminución de accidentes laborales, enfermedades e incapacidades, lo cual hace que en la empresa el trabajo sea más fluido y de calidad.",
        },
        {
          tipo: "imagen",
          url: fotografiapost,
          alt: "SG-SST ASEGURAR LTDA",
        },
      ],
    },
  ];
  const comentarios = [
    {
      nombreCliente: "COOPSETRANS",
      comentario:
        "Para COOPSETRANS contar con el apoyo incondicional de ASEGURAR Ltda., ha sido fundamental, desde el momento de nuestra vinculación.  La plataforma de monitoreo satelital CELLVI que utiliza nos ha permitido el control de nuestra flota y el cumplimiento oportuno de los reportes a los diferentes entes de control que nos supervisan.",
      foto: fotoCliente1,
    },
    {
      nombreCliente: "IPS SAMYSALUD SAS",
      comentario:
        "ASEGURAR presta excelente servicio con responsabilidad y confianza",
      foto: fotoCliente2,
    },
    {
      nombreCliente: "Lácteos Santa María",
      comentario:
        "En referencia al concepto de su empresa: ASEGURAR nos permite viajar seguros, con un servicio eficiente y efectivo",
      foto: fotoCliente3,
    },
  ];
  return (
    <div>
      <BackgroundGradient color1="#fff" color2="#fff">
        <div className="w-100 container pt-2">
          <div className="p-4 p-md-5 mb-4 rounded text-body-emphasis mt-4 aqua--marker">
            <div className="col-lg px-0">
              <h1 className="display-4 fw-bold mb-3">Asegublog</h1>
              <p className="lead my-3">
                ASEGUBLOG, es un sitio en la página web de ASEGURAR LTDA., donde
                publicamos de manera frecuente temas, informaciones y noticia
                que queremos compartir con los visitantes a nuestro sitio web y,
                que son de interés para todos, lo actualizamos periódicamente y,
                recopilamos cronológicamente temas relacionados con el servicio
                de monitoreo remoto de activos fijos y móviles y, demás
                servicios del portafolio de la empresa.
              </p>
              <p className="lead my-3">
                Es una herramienta digital que sirve de canal de comunicación de
                la empresa con los usuarios de los servicios, resolvemos dudas,
                realizamos entrevistas y, publicamos las referencias que los
                clientes deseen realizar acerca de los servicios que prestamos.
              </p>
              <p
                className="lead mb-0 text-body-emphasis fw-bold custom-pointer"
                onClick={() => handleButtonClick(0)}
              >
                Ultimas novedades ...
              </p>
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-md-6">
              {noticia.length > 0 && blog < noticia.length && (
                <div
                  className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative custom-pointer"
                  onClick={() => handleButtonClick(0)}
                >
                  <div className="col p-4 d-flex flex-column position-static">
                    <strong className="d-inline-block mb-2 text-primary-emphasis">
                      Empresarial
                    </strong>
                    <h3 className="mb-0">{noticia[blog].titulo}</h3>
                    <div className="mb-1 text-body-secondary">
                      {noticia[blog].fecha}
                    </div>
                    <p className="card-text mb-auto">
                      {noticia[blog].resumen1}
                    </p>
                  </div>
                  <div className="col-auto d-none d-lg-block">
                    <img
                      alt="Thumbnail"
                      src={noticia[blog].minifoto}
                      width="200"
                      height="200"
                      className="bd-placeholder-img m-4 border"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="col-md-6">
              {noticia.length > 1 && blog + 1 < noticia.length && (
                <div
                  className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative custom-pointer"
                  onClick={() => handleButtonClick(blog + 1)}
                >
                  <div className="col p-4 d-flex flex-column position-static">
                    <strong className="d-inline-block mb-2 text-primary-emphasis">
                      Empresarial
                    </strong>
                    <h3 className="mb-0">{noticia[blog + 1].titulo}</h3>
                    <div className="mb-1 text-body-secondary">
                      {noticia[blog].fecha}
                    </div>
                    <p className="card-text mb-auto">
                      {noticia[blog + 1].resumen1}
                    </p>
                  </div>
                  <div className="col-auto d-none d-lg-block">
                    <img
                      alt="Thumbnail"
                      src={noticia[blog + 1].minifoto}
                      width="200"
                      height="200"
                      className="bd-placeholder-img m-4 border"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="row g-5" ref={(ref) => setColMd8Ref(ref)}>
            <div className="col-md-8">
              <div>
                <Noticia
                  noticia={noticia[blog]}
                  onClick={() => handleButtonClick(blog)}
                />
                <div className="d-flex mb-2">
                  <button
                    type="button"
                    className={`btn btn-outline-primary rounded-pill mx-2 ${
                      blog === 0 ? "active" : ""
                    }`}
                    onClick={() => handleButtonClick(blog - 1)}
                    disabled={blog === 0} // Deshabilita el botón si ya estás en la primera noticia
                  >
                    Antigua
                  </button>
                  <button
                    type="button"
                    className={`btn btn-outline-secondary rounded-pill mx-2 ${
                      blog === noticia.length - 1 ? "active" : ""
                    }`}
                    onClick={() => handleButtonClick(blog + 1)}
                    disabled={blog === noticia.length - 1} // Deshabilita el botón si ya estás en la última noticia
                  >
                    Nueva
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="position-sticky" style={{ top: "2rem" }}>
                <div className="p-4 mb-3 bg-body-tertiary rounded">
                  <h4 className="fts-italic">Asegurar</h4>
                  <p className="mb-0">
                    Empresa lider en tecnologia en la region Narinense, ganadora
                    del premio....
                  </p>
                  <button className="btn btn-primary mt-1">
                    Leer mas aqui
                  </button>
                </div>
                <div className="">
                  <h4 className="fst-italic">
                    Comentarios de nuestros clientes
                  </h4>
                  <ul className="list-unstyled">
                    {comentarios.map((item, index) => (
                      <div key={index}>
                        <div className="d-flex flex-column flex-lg-row gap-3 align-items-start align-items-lg-center py-3 link-body-emphasis text-decoration-none border-top">
                          <div className="col-lg-4">
                            <img
                              alt="Post"
                              className="img img-fluid"
                              src={item.foto}
                            />
                          </div>
                          <div className="col-lg-8">
                            <h5>{item.nombreCliente}</h5>
                            <h6 className="mb-0">{item.comentario}</h6>
                            <small className="text-body-secondary">
                              Noviembre 29 del 2023
                            </small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </ul>
                </div>
                <div className="p-4"></div>
              </div>
            </div>
          </div>
        </div>
      </BackgroundGradient>      
    </div>
  );
}
