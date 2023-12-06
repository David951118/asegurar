import React, { useState, useContext } from "react";
import BackgroundGradient from "../../Components/background";
import Footer from "../../Components/footer";
import sercicio1 from "../../Assets/Tarjetas de servicios/1.jpg";
import sercicio2 from "../../Assets/Tarjetas de servicios/2.jpg";
import sercicio3 from "../../Assets/Tarjetas de servicios/3.jpg";
import sercicio4 from "../../Assets/Tarjetas de servicios/4.jpg";
import sercicio5 from "../../Assets/Tarjetas de servicios/5.jpg";
import sercicio6 from "../../Assets/Tarjetas de servicios/6.jpg";
import { AsegurarContext } from "../../Context";
import watermark from "../../Assets/Marca de agua 2.jpg"; //todo cambiar doble parrafo

export default function Services() {
  const { handleWhatsAppClick } = useContext(AsegurarContext);
  const [expandedIndex, setExpandedIndex] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  let info = {
    title: "Nuestros Servicios",
    titleDescription: "",
  };

  const services = [
    {
      title: "Monitoreo de",
      title2: "Activos Moviles",
      foto: sercicio1,
      description: "descripcion",
      mensaje:
        "Necesito asesoria sobre el servicio de Monitoreo de Activos Moviles",
      parragrahp:
        "Servicios de tele acción: Mediante el equipamiento de pequeños dispositivos terminales de datos que envían información a través de las redes de telefonía móvil celular y/o satélites de orbita baja a nuestros servidores, los cuales decodifican y transforman esos datos en mapas vectorizados, digitalizados y georreferenciados, monitoreamos remotamente sus vehículos, personas, activos y, mercancías; colocando a su servicio la posición geográfica en tiempo real desde su PC, su dispositivo móvil Android o IOS o, a través de la central de monitoreo.",
    },
    {
      title: "Monitoreo de",
      title2: "Activos Fijos",
      foto: sercicio2,
      description: "descripcion",
      mensaje:
        "Necesito asesoria sobre el servicio de Monitoreo de Activos Activos Fijos",
      parragrahp:
        "Desde nuestra central de operaciones monitoreamos remotamente cámaras de video, alarmas digitales, controles de acceso o controles perimétricos, disminuyendo los costos de operación de la actividad humana, servicios esenciales para condominios, fincas de recreo, edificios de apartamentos con números reducidos de copropietarios.",
    },
    {
      title: "Monitoreo de",
      title2: "Maquinaria Amarilla",
      foto: sercicio3,
      description: "descripcion",
      mensaje:
        "Necesito asesoria sobre el servicio de Monitoreo de Maquinaria Amarilla",
      parragrahp:
        "En desarrollo del programa Presidencial de Lucha contra la Minería Ilegal, somos proveedores autorizados por la Dirección de Telemática de la Policía Nacional de Colombia de sistemas GPS para maquinaria autopropulsada de construcción (amarilla) y, agrícola industrial (verde), ejecutamos las normas emitidas por los Ministerios de Comercio, Industria y Turismo, de Transportes y, la Dirección General de la Policía Nacional; somos proveedores de servicios para la Concesión RUNT.",
    },
    {
      title: "Central de Monitoreo",
      title2: "Especializada 24 Horas",
      foto: sercicio4,
      description: "descripcion",
      mensaje:
        "Necesito asesoria sobre el servicio de Central de Monitoreo Especializada 24 Horas",
      parragrahp:
        "La central especializada de monitoreo funciona las 24 horas del día, los 365 días del año, acompaña a nuestros clientes en lo relacionado con el suministro de información de posición geográfica, control de puntos de paso y geocercas, suministro de claves corporativas a generadoras de carga, acompañamiento en casos de siniestros por piratería terrestre, mantenemos un contacto y coordinación permanente con las autoridades de policía de carreteras en todo el país. Somos su ángel guardián de día y de noche en los movimientos de sus activos fijos y móviles",
    },
    {
      title: "Monitoreo Internacional",
      title2: "de Activos Moviles",
      foto: sercicio5,
      description: "descripcion",
      mensaje:
        "Necesito asesoria sobre el servicio de Monitoreo Internacional de Activos Moviles",
      parragrahp:
        "Prestamos servicio de monitoreo internacional mediante el empleo de micro chip especiales que se conectan con cualquier operador de telefonía móvil en todo el territorio del continente sur americano, contamos con una sucursal internacional sobre territorio de la Republica del Ecuador, con enlaces permanentes hacia el Perú y Bolivia.",
    },
    {
      title: "Asesoria y consultoria",
      title2: "en seguridad electronica",
      foto: sercicio6,
      description: "descripcion",
      mensaje:
      "Necesito asesoria sobre el servicio de Asesoria y consultoria en seguridad electronica",
      parragrahp:
        "Asesoramos a nuestros clientes y suscriptores y, al público en general, dentro de los más altos estándares de confidencialidad, acerca de las mejores opciones en el campo de la seguridad electrónica con tecnología de punta, que abarca desde sencillas cámaras de visión, alarmas digitales, hasta complejos sistemas de visión con programas avanzados de video analítica y reconocimiento facial; sistemas de controles de acceso y perimétricos; combinados la tecnología IP, con la Inteligencia Artificial y, equipos electrónicos de alta gama.",
    },
  ];

  const div2Style = {
    width: "60%",
    height: "100%",
    borderRadius: "10px 10px 0 0",
    backgroundImage: `url(${watermark})`, // Agrega la marca de agua como fondo
  };

  const handleCardClick = (index) => {
    setExpandedIndex((prevIndex) => {
      const newState = [...prevIndex];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <div>
      <BackgroundGradient color1="#fff" color2="#fff">
        <div className="w-100">
          <div className="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center aqua--marker">
            <div className="col-md-6 p-lg-5 mx-auto my-5 text-center">
              <h1 className="display-3 fw-bold text-center">{info.title}</h1>
              <h3 className="fw-normal text-muted mb-3 text-center">
                {info.titleDescription}
              </h3>
              <div className="d-flex gap-3 justify-content-center lead fw-normal">
                <p>Servicios prestados por Asegurar LTDA</p>
              </div>
            </div>
          </div>
          <div className="d-md-flex flex-md-equal w-100 my-md-3 ps-md-2">
            <div className="row w-100">
              {services.map((item, index) => (
                <div
                  className={
                    "col-md-6 pt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden p-3"
                  }
                  key={index}
                >
                  <div className="bg-body-tertiary shadow">
                    <div className="my-3 py-3">
                      <h2 className="display-5">{item.title}</h2>
                      <h2 className="display-5">{item.title2}</h2>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleCardClick(index)}
                      >
                        {expandedIndex[index] ? "Cerrar" : "Saber mas"}
                      </button>
                    </div>
                    <div
                      className="bg-body shadow-sm mx-auto"
                      style={div2Style}
                    >
                      <img
                        src={item.foto}
                        alt={item.title}
                        className="img img-fluid"
                      />
                    </div>
                    {expandedIndex[index] && (
                      <div
                        className={`p-3 p-md-5 expanded-content ${
                          expandedIndex[index] ? "visible" : "hidden"
                        }`}
                      >
                        <p>{item.parragrahp}</p>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleWhatsAppClick(item.mensaje)}
                        >
                          Pedir Asesoría del servicio
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </BackgroundGradient>
      <Footer />
    </div>
  );
}