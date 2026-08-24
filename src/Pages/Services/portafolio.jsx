import { useState, useContext } from "react";
import { AsegurarContext } from "../../Context";
import sercicio1 from "../../Assets/Tarjetas de servicios/1.jpg";
import sercicio2 from "../../Assets/Tarjetas de servicios/2.jpg";
import sercicio3 from "../../Assets/Tarjetas de servicios/3.jpg";
import sercicio4 from "../../Assets/Tarjetas de servicios/4.jpg";
import sercicio5 from "../../Assets/Tarjetas de servicios/5.jpg";
import sercicio6 from "../../Assets/Tarjetas de servicios/6.jpg";
import Carrusel from "./Carrusel";
import PesvPromo from "./PesvPromo";
import RndcPromo from "./RndcPromo";
import CellviPromo from "./CellviPromo";

const styles = `
  /* ── Hero portafolio ── */
  .port-hero {
    background: linear-gradient(135deg, #0a2d6e 0%, #1565c0 60%, #42a5f5 100%);
    padding: 80px 0 48px;
    text-align: center;
    color: #fff;
    position: relative;
  }
  .port-hero::after {
    content: "";
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 60px;
    background: #f8fafc;
    clip-path: polygon(0 100%, 100% 100%, 100% 0, 0 100%);
  }
  .port-hero-tag {
    display: inline-block;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 999px;
    padding: 5px 18px;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 16px;
  }
  .port-hero h1 {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 900;
    margin: 0 0 12px;
  }
  .port-hero p {
    color: rgba(255,255,255,0.8);
    font-size: 1.05rem;
    max-width: 560px;
    margin: 0 auto 36px;
    line-height: 1.6;
  }

  /* Carousel wrap */
  .port-carousel-wrap {
    max-width: 800px;
    margin: 0 auto;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 12px 40px rgba(0,0,0,0.25);
  }
  .port-carousel-wrap img {
    border-radius: 0 !important;
  }

  /* ── Services grid ── */
  .port-services { padding: 60px 0 80px; background: #f8fafc; }
  .port-section-title {
    font-size: clamp(1.6rem, 3vw, 2.2rem);
    font-weight: 900;
    color: #0a2d6e;
    text-align: center;
    margin: 0 0 12px;
  }
  .port-section-sub {
    color: #666;
    font-size: 1rem;
    text-align: center;
    max-width: 520px;
    margin: 0 auto 48px;
    line-height: 1.6;
  }
  .port-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
  @media (max-width: 768px) { .port-grid { grid-template-columns: 1fr; } }

  .port-card {
    background: #fff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 18px rgba(0,0,0,0.06);
    transition: all 0.3s ease;
    border: 1px solid #e8eef5;
  }
  .port-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 36px rgba(21,101,192,0.12);
    border-color: #bbdefb;
  }
  .port-card-img-wrap {
    position: relative;
    overflow: hidden;
    height: 200px;
  }
  .port-card-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }
  .port-card:hover .port-card-img-wrap img { transform: scale(1.06); }
  .port-card-img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 50%, rgba(10,45,110,0.7) 100%);
    display: flex;
    align-items: flex-end;
    padding: 18px 20px;
  }
  .port-card-img-overlay h3 {
    color: #fff;
    font-size: 1.15rem;
    font-weight: 800;
    margin: 0;
    line-height: 1.3;
    text-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }
  .port-card-body { padding: 20px 22px; }
  .port-card-desc {
    color: #555;
    font-size: 0.9rem;
    line-height: 1.7;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: all 0.3s;
  }
  .port-card-desc.expanded {
    -webkit-line-clamp: unset;
    overflow: visible;
  }
  .port-card-actions {
    display: flex;
    gap: 10px;
    margin-top: 16px;
    flex-wrap: wrap;
  }
  .port-btn-toggle {
    background: #e3f0ff;
    color: #1565c0;
    border: none;
    padding: 8px 18px;
    border-radius: 8px;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
  }
  .port-btn-toggle:hover { background: #bbdefb; }
  .port-btn-whatsapp {
    background: #25d366;
    color: #fff;
    border: none;
    padding: 8px 18px;
    border-radius: 8px;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s;
  }
  .port-btn-whatsapp:hover { background: #1ea952; transform: translateY(-1px); }
`;

const services = [
  {
    title: "Monitoreo de activos móviles",
    foto: sercicio1,
    mensaje: "Necesito asesoría sobre el servicio de Monitoreo de Activos Móviles",
    parrafo: "Servicios de tele acción: Mediante el equipamiento de pequeños dispositivos terminales de datos que envían información a través de las redes de telefonía móvil celular y/o satélites de órbita baja a nuestros servidores, los cuales decodifican y transforman esos datos en mapas vectorizados, digitalizados y georeferenciados, monitoreamos remotamente sus vehículos, personas, activos y, mercancías; colocando a su servicio la posición geográfica en tiempo real desde su PC, su dispositivo móvil Android o IOS o, a través de la central de monitoreo.",
  },
  {
    title: "Monitoreo de activos fijos",
    foto: sercicio2,
    mensaje: "Necesito asesoría sobre el servicio de Monitoreo de Activos Fijos",
    parrafo: "Desde nuestra central de operaciones monitoreamos remotamente cámaras de video, alarmas digitales, controles de acceso o controles perimétricos, disminuyendo los costos de operación de la actividad humana, servicios esenciales para condominios, fincas de recreo, edificios de apartamentos con números reducidos de copropietarios.",
  },
  {
    title: "Monitoreo de maquinaria amarilla",
    foto: sercicio3,
    mensaje: "Necesito asesoría sobre el servicio de Monitoreo de Maquinaria Amarilla",
    parrafo: "En desarrollo del programa Presidencial de Lucha contra la Minería Ilegal, somos proveedores autorizados por la Dirección de Telemática de la Policía Nacional de Colombia de sistemas GPS para maquinaria autopropulsada de construcción (amarilla) y, agrícola industrial (verde), ejecutamos las normas emitidas por los Ministerios de Comercio, Industria y Turismo, de Transportes y, la Dirección General de la Policía Nacional.",
  },
  {
    title: "Central de monitoreo 24/7",
    foto: sercicio4,
    mensaje: "Necesito asesoría sobre la Central de Monitoreo Especializada 24 Horas",
    parrafo: "La central especializada de monitoreo funciona las 24 horas del día, los 365 días del año, acompaña a nuestros clientes en lo relacionado con el suministro de información de posición geográfica, control de puntos de paso y geocercas, acompañamiento en casos de siniestros por piratería terrestre, mantenemos un contacto y coordinación permanente con las Autoridades de Policía de Carreteras en todo el país.",
  },
  {
    title: "Monitoreo internacional de activos",
    foto: sercicio5,
    mensaje: "Necesito asesoría sobre el Monitoreo Internacional de Activos Móviles",
    parrafo: "Prestamos servicio de monitoreo internacional mediante el empleo de micro chip especiales que se conectan con cualquier operador de telefonía móvil en todo el territorio del continente suramericano, contamos con una sucursal internacional sobre territorio de la República del Ecuador, con enlaces permanentes hacia el Perú y Bolivia.",
  },
  {
    title: "Asesoría en seguridad electrónica",
    foto: sercicio6,
    mensaje: "Necesito asesoría sobre el servicio de Seguridad Electrónica",
    parrafo: "Asesoramos a nuestros clientes y suscriptores y, al público en general, dentro de los más altos estándares de confidencialidad, acerca de las mejores opciones en el campo de la seguridad electrónica con tecnología de punta, que abarca desde sencillas cámaras de visión, alarmas digitales, hasta complejos sistemas de visión con video analítica y reconocimiento facial.",
  },
];

export default function Portafolio() {
  const { handleWhatsAppClick } = useContext(AsegurarContext);
  const [expanded, setExpanded] = useState(services.map(() => false));

  const toggle = (i) => {
    setExpanded((prev) => { const n = [...prev]; n[i] = !n[i]; return n; });
  };

  return (
    <>
      <style>{styles}</style>

      {/* Plataformas digitales: PESV, RNDC y Cellvi (cada una con diseño propio) */}
      <PesvPromo />
      <RndcPromo />
      <CellviPromo />

      {/* Hero con carrusel */}
      <section className="port-hero">
        <div className="container">
          <span className="port-hero-tag">Asegurar Ltda.</span>
          <h1>Portafolio de Servicios</h1>
          <p>
            Soluciones integrales en telecomunicaciones, monitoreo vehicular
            y seguridad electrónica para proteger sus activos.
          </p>
          <div className="port-carousel-wrap">
            <Carrusel />
          </div>
        </div>
      </section>

      {/* Grid de servicios */}
      <section className="port-services">
        <div className="container">
          <h2 className="port-section-title">Nuestros Servicios</h2>
          <p className="port-section-sub">
            Conozca en detalle cada una de las soluciones que tenemos para usted.
          </p>
          <div className="port-grid">
            {services.map((s, i) => (
              <div key={i} className="port-card">
                <div className="port-card-img-wrap">
                  <img src={s.foto} alt={s.title} />
                  <div className="port-card-img-overlay">
                    <h3>{s.title}</h3>
                  </div>
                </div>
                <div className="port-card-body">
                  <p className={`port-card-desc ${expanded[i] ? "expanded" : ""}`}>
                    {s.parrafo}
                  </p>
                  <div className="port-card-actions">
                    <button className="port-btn-toggle" onClick={() => toggle(i)}>
                      {expanded[i] ? "Ver menos" : "Leer más"}
                    </button>
                    <button className="port-btn-whatsapp" onClick={() => handleWhatsAppClick(s.mensaje)}>
                      <i className="pi pi-whatsapp" /> Solicitar asesoría
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
