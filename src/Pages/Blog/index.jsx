import React, { useState, useRef } from "react";
import BackgroundGradient from "../../Components/background";
import Footer from "../../Components/footer";
import Noticia from "./noticia";
import Vision from "../../Assets/Mision Vision/POLITICAS.jpg";
import BlogAsegurar from "../../Assets/BlogProvicional.png";
import fotografiapost from "../../Assets/Foto Portada/WhatsApp Image 2023-11-11 at 10.47.56 AM.jpeg";
import miniFotoPost from "../../Assets/Foto Portada/WhatsApp Image 2023-11-09 at 2.45.28 PM.jpeg";
import fotoCliente1 from "../../Assets/iconsEnter/Coopsetrans.png";
import fotoCliente2 from "../../Assets/iconsEnter/Samy-Salud-png.png";
import fotoCliente3 from "../../Assets/iconsEnter/Lacteos Santa Maria png.png";

export default function Blog() {
  const [blog, setBlog] = useState(null);
  const colMd8Ref = useRef(null);
  const handleButtonClick = (blogId) => {
    setBlog(blogId);

    // Desplazar la pantalla al inicio de col-md-8
    colMd8Ref.current.scrollIntoView({ behavior: "smooth" });
  };
  const noticia = [
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
        {
          tipo: "minifoto",
          url: miniFotoPost,
          alt: "SG-SST ASEGURAR LTDA",
        },
      ],
    },
  ];
  const noticias = [
    {
      title: "LANZAMIENTO OFICIAL ASEGURAR.COM.CO",
      titleLevel2: "¡Bienvenidos a la Nueva Era: Ahora en React!",
      p: [
        "Estimada comunidad de ASEGURAR LTDA",
        "Es un placer para nosotros anunciar un emocionante cambio en nuestra presencia en línea. ¡Hemos dado un salto importante y nos hemos actualizado a React! Después de años de compromiso con una versión estática en HTML, hemos decidido llevar la experiencia de usuario de nuestra página web al siguiente nivel.",
      ],
      title2: "¿Qué significa esto para ti?",
      p2: [
        "Experiencia de Usuario Mejorada: La transición a React nos permite ofrecer una navegación más suave y un rendimiento más rápido, lo que se traduce en una experiencia de usuario mejorada.",
        "Interactividad Avanzada: Ahora podemos implementar características interactivas y dinámicas de manera más eficiente, brindándote contenido de alta calidad de una manera más atractiva.",
        "Mantenimiento Eficiente: React simplifica el mantenimiento del código, lo que nos permite responder rápidamente a los comentarios y asegurarnos de que nuestro sitio web esté siempre actualizado.",
      ],
      p3: "Te invitamos a explorar la nueva pagina web!",
      foto1: BlogAsegurar,
      fecha: "18 Diciembre 2023",
      resumen1:
        "En este blog ecuentras informacion, sobre las actualizaciones de la pagina web",
      minifoto: Vision,
      creador: "Ing David Montes",
    },
    {
      title: "SG-SST ASEGURAR LTDA",
      titleLevel2: "Seguridad y salud en el trabajo",
      p: [
        "ASEGURAR LTDA trabaja por la protección de sus trabajadores, la promoción de la salud y seguridad en el desarrollo de sus operaciones, reconociendo el desempeño ejemplar en materia de seguridad y salud en el trabajo, generando las directrices bajo las cuales ASEGURAR LTDA, desarrollará la estrategias por medio de procesos, mediante la implementación de controles para los peligros identificados, riesgos valorados, el cumplimiento de la legislación aplicable y actividades de implementación, mantenimiento, control y mejoramiento continuo, que conlleve a la preservación de la salud orgánica y mental de nuestros colaboradores, ofreciendo lugares de trabajo seguros evitando así la ocurrencia de incidentes, accidentes y enfermedades laborales",
        "Seguridad y Salud en el Trabajo de ASEGURAR LTDA genera interés en el desarrollo integral de sus diferentes dimensiones: física, mental, social y espiritual, a través de 3 principios:",
        "Principio de Reconocimiento: Dirigido a identificar los peligros, evaluar, valorar los riesgos y definir controles, basados en los conceptos técnicos y cumpliendo los lineamientos legales de nuestro País.",
        "Principio de Construcción: Orientado al desarrollo de estrategias para acompañar a los grupos de interés a ser conscientes de la prevención y protección de su salud y seguridad.",
        "Principio de Progreso: Nos impulsa a asumir los retos, cambios y necesidades que se van presentando en pro de la mejora continua del SG-SST.",
      ],
      title2: "IMPORTANCIA DE CONTAR CON UN SG-SST",
      p2: [
        "Reducir del ausentismo laboral, mejora en la salud y  hábitos de los trabajadores, traducido en un mayor índice de productividad.",
        "Mejora de la calidad de vida laboral promoviendo iniciativas que garantizan la salud laboral.",
        "Mayor productividad y rentabilidad en la empresa, la inversión se triplicará al tener una buena implementación de la seguridad laboral y salud en el trabajo.",
      ],
      p3: "Una correcta ejecución e implementación de un SG-SST, aportara a la empresa una buena imagen corporativa y plasmara un ambiente de bienestar laboral, en vista de la disminución de accidentes laborales, enfermedades e incapacidades, lo cual hace que en la empresa el trabajo sea más fluido y de calidad.",
      foto1: fotografiapost,
      fecha: "29 Noviembre 2023",
      resumen1:
        "En este blog ecuentras informacion, sobre las capacitaciones en SG-SST",
      minifoto: miniFotoPost,
      creador: "valentina Ledesma",
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
  const infoRobo = {
    imagen: "Imagen",
    parrafo1:
      "En un acto de colaboración entre la Policía Nacional y el Ejército Nacional de Colombia, se logró un importante hito en la lucha contra la piratería terrestre el pasado 23 de marzo de 2024. El vehículo identificado con las placas SVP 210, que había sido asaltado en la ruta de Pasto a Tumaco - Nariño, en el sector de CHUCUNES, vereda San Isidro, fue recuperado exitosamente.",
    parrafo2:
      "El asalto a vehículos en estas rutas ha sido una preocupación creciente en la región, afectando tanto a comerciantes como a ciudadanos comunes que transitan por estas vías con el objetivo de llevar a cabo sus actividades diarias. Este tipo de actos no solo representan una amenaza para la seguridad de los individuos, sino que también tienen un impacto negativo en la economía local y nacional.",
    parrafo3:
      "El trabajo conjunto entre las fuerzas de seguridad colombianas fue fundamental para el éxito de esta operación. La rápida respuesta y coordinación entre la Policía Nacional y el Ejército Nacional permitió la ubicación y recuperación del vehículo en tiempo récord. Este logro no solo representa un golpe contra la piratería terrestre, sino que también envía un mensaje claro de que las autoridades están comprometidas con la seguridad de los ciudadanos y con la lucha contra el crimen organizado en todas sus formas.",
    parrafo4:
      "La recuperación del vehículo SVP 210 es un ejemplo tangible de los esfuerzos continuos que se están realizando para garantizar la seguridad en las carreteras colombianas. Sin embargo, queda claro que aún queda mucho trabajo por hacer. Es necesario seguir fortaleciendo las estrategias de seguridad, así como fomentar la cooperación ciudadana para prevenir y enfrentar este tipo de incidentes.",
    parrafo5:
      "Este éxito debe servir como un recordatorio de la importancia de la colaboración entre las autoridades y la comunidad en la construcción de entornos seguros y libres de violencia. Solo a través de un esfuerzo conjunto y continuo podremos enfrentar eficazmente los desafíos de la piratería terrestre y otros tipos de delitos que afectan a nuestra sociedad.",
    parrafo6:
      "La recuperación del vehículo SVP 210 es un paso adelante en la dirección correcta, pero debemos mantenernos vigilantes y comprometidos en nuestra lucha por la seguridad y la justicia en nuestras carreteras y comunidades.",
    parrafo7: "¡Sigamos adelante juntos en esta importante tarea!",
  };
  return (
    <div>
      <BackgroundGradient color1="#fff" color2="#fff">
        <div className="w-100 container pt-2">
          <div className="p-4 p-md-5 mb-4 rounded text-body-emphasis mt-4 aqua--marker">
            <div className="col-lg px-0">
              <h1 className="display-4 fw-bold mb-3">Asegublog</h1>
              <p className="lead my-3">
                ASEGUBLOG, es un sitio en la página web de ASEGURAR LTDA., donde
                publicamos de manera frecuente temas, informaciones y noticias
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
              <p className="lead mb-0">
                <a href="Novedades" className="text-body-emphasis fw-bold">
                  Ultimas novedades ...
                </a>
              </p>
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-md-6">
              <div
                className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative custom-pointer"
                onClick={() => handleButtonClick(0)}
              >
                <div className="col p-4 d-flex flex-column position-static">
                  <strong className="d-inline-block mb-2 text-primary-emphasis">
                    Empresarial
                  </strong>
                  <h3 className="mb-0">{noticias[0].title}</h3>
                  <div className="mb-1 text-body-secondary">
                    {noticias[0].fecha}
                  </div>
                  <p className="card-text mb-auto">{noticias[0].resumen1}</p>
                </div>
                <div className="col-auto d-none d-lg-block">
                  <img
                    alt="Thumbnail"
                    src={noticias[0].minifoto}
                    width="200"
                    height="200"
                    className="bd-placeholder-img m-4 border"
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div
                className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative custom-pointer"
                onClick={() => handleButtonClick(1)}
              >
                <div className="col p-4 d-flex flex-column position-static">
                  <strong className="d-inline-block mb-2 text-primary-emphasis">
                    Empresarial
                  </strong>
                  <h3 className="mb-0">{noticias[1].title}</h3>
                  <div className="mb-1 text-body-secondary">
                    {noticias[1].fecha}
                  </div>
                  <p className="card-text mb-auto">{noticias[1].resumen1}</p>
                </div>
                <div className="col-auto d-none d-lg-block">
                  <img
                    alt="Thumbnail"
                    src={noticias[1].minifoto}
                    width="200"
                    height="200"
                    className="bd-placeholder-img m-4 border"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row g-5">
            {blog === 0 ? (
              <div className="col-md-8" ref={colMd8Ref}>
                <h3 className="pb-4 mb-4 fst-italic border-bottom">
                  {noticias[0].titleLevel2}
                </h3>
                <article className="blog-post">
                  <h2 className="display-5 link-body-emphasis mb-1">
                    {noticias[0].title}
                  </h2>
                  <p className="blog-post-meta">
                    {noticias[0].fecha} por
                    <strong> {noticias[0].creador}</strong>
                  </p>
                  {noticias[0].p.map((item, index) => (
                    <p key={index}>{item}</p>
                  ))}
                  <h4>{noticias[0].title2}</h4>
                  <ul>
                    <li>{noticias[0].p2[0]}</li>
                    <li>{noticias[0].p2[1]}</li>
                    <li>{noticias[0].p2[2]}</li>
                  </ul>
                  <p>{noticias[0].p3}</p>
                  <img
                    src={noticias[0].foto1}
                    alt={noticias[0].title}
                    className="img img-fluid"
                  />
                </article>
                <hr />
                <div className="d-flex  mb-2">
                  <button
                    type="button"
                    className={`btn btn-outline-primary rounded-pill mx-2 ${
                      blog === 0 ? "active" : ""
                    }`}
                    onClick={() => handleButtonClick(0)}
                  >
                    Antigua
                  </button>
                  <button
                    type="button"
                    className={`btn btn-outline-secondary rounded-pill mx-2 ${
                      blog === 1 ? "active" : ""
                    }`}
                    onClick={() => handleButtonClick(1)}
                  >
                    Nueva
                  </button>
                </div>
              </div>
            ) : (
              <div className="col-md-8" ref={colMd8Ref}>
                <h3 className="pb-4 mb-4 fst-italic border-bottom">
                  {noticias[1].titleLevel2}
                </h3>
                <article className="blog-post">
                  <h2 className="display-5 link-body-emphasis mb-1">
                    {noticias[1].title}
                  </h2>
                  <p className="blog-post-meta">
                    {noticias[1].fecha} por
                    <strong> {noticias[1].creador}</strong>
                  </p>
                  {noticias[1].p.map((item, index) => (
                    <p key={index}>{item}</p>
                  ))}
                  <h4>{noticias[1].title2}</h4>
                  <ul>
                    <li>{noticias[1].p2[0]}</li>
                    <li>{noticias[1].p2[1]}</li>
                    <li>{noticias[1].p2[2]}</li>
                  </ul>
                  <p>{noticias[1].p3}</p>
                  <img
                    src={noticias[1].foto1}
                    alt={noticias[1].title}
                    className="img img-fluid"
                  />
                </article>
                <hr />
                <div className="d-flex  mb-2">
                  <button
                    type="button"
                    className={`btn btn-outline-primary rounded-pill mx-2 ${
                      blog === 0 ? "active" : ""
                    }`}
                    onClick={() => handleButtonClick(0)}
                  >
                    Antigua
                  </button>
                  <button
                    type="button"
                    className={`btn btn-outline-secondary rounded-pill mx-2 ${
                      blog === 1 ? "active" : ""
                    }`}
                    onClick={() => handleButtonClick(1)}
                  >
                    Nueva
                  </button>
                </div>
              </div>
            )}
            {noticia.map((noticia, index) => (
              <div>
                <Noticia
                  key={index}
                  noticia={noticia}
                  onClick={() => handleButtonClick(index)}
                  ref={colMd8Ref}
                />
                <div className="d-flex  mb-2">
                  <button
                    type="button"
                    className={`btn btn-outline-primary rounded-pill mx-2 ${
                      blog === 0 ? "active" : ""
                    }`}
                    onClick={() => handleButtonClick(index)}
                  >
                    Antigua
                  </button>
                  <button
                    type="button"
                    className={`btn btn-outline-secondary rounded-pill mx-2 ${
                      blog === 1 ? "active" : ""
                    }`}
                    onClick={() => handleButtonClick(index)}
                  >
                    Nueva
                  </button>
                </div>
              </div>
            ))}

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
                {/* <div className="p-4">
                  <h4 className="fst-italic">Archives</h4>
                  <ol className="list-unstyled mb-0">
                    <li>
                      <a href="Enero">Enero 2023</a>
                    </li>
                    <li>
                      <a href="Enero">Enero 2023</a>
                    </li>
                    <li>
                      <a href="Enero">Enero 2023</a>
                    </li>
                    <li>
                      <a href="Enero">Enero 2023</a>
                    </li>
                    <li>
                      <a href="Enero">Enero 2023</a>
                    </li>
                    <li>
                      <a href="Enero">Enero 2023</a>
                    </li>
                    <li>
                      <a href="Enero">Enero 2023</a>
                    </li>
                  </ol>
                </div> */}
                <div className="p-4"></div>
              </div>
            </div>
          </div>
        </div>
      </BackgroundGradient>
      <Footer />
    </div>
  );
}
