import React, { useState } from "react";
import fotoAboutus from "../../Assets/Mision Vision/ASEGURAR.jpg";
import Mision from "../../Assets/Mision Vision/MISION.jpg";
import Vision from "../../Assets/Mision Vision/VISION.jpg";
import Politicas from "../../Assets/Mision Vision/POLITICAS.jpg";
import imageDescription from "../../Assets/Foto Portada/1.jpg";

const styles = `
  .about-hero {
    position: relative;
    width: 100%;
    max-height: 380px;
    overflow: hidden;
  }
  .about-hero img {
    width: 100%;
    height: 380px;
    object-fit: cover;
    display: block;
  }
  .about-hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(0deg, rgba(10,45,110,0.8) 0%, rgba(10,45,110,0.3) 60%, transparent 100%);
    display: flex;
    align-items: flex-end;
    padding: 40px;
  }
  .about-hero-text h1 {
    color: #fff;
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 900;
    margin: 0 0 8px;
  }
  .about-hero-text p {
    color: rgba(255,255,255,0.8);
    font-size: 1.05rem;
    margin: 0;
  }

  .about-content { padding: 60px 0 80px; background: #f8fafc; }

  /* Tabs */
  .about-tabs {
    display: flex;
    gap: 6px;
    margin-bottom: 40px;
    flex-wrap: wrap;
    background: #fff;
    border-radius: 14px;
    padding: 6px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  }
  .about-tab {
    flex: 1;
    min-width: 120px;
    padding: 12px 18px;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 700;
    color: #555;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.25s;
    text-align: center;
  }
  .about-tab:hover { background: #f0f6ff; color: #1565c0; }
  .about-tab.active {
    background: linear-gradient(135deg, #0a2d6e, #1565c0);
    color: #fff;
    box-shadow: 0 4px 14px rgba(21,101,192,0.25);
  }

  /* Card de contenido */
  .about-card {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    overflow: hidden;
    animation: aboutFadeIn 0.4s ease;
  }
  @keyframes aboutFadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .about-card-img {
    width: 100%;
    height: 300px;
    object-fit: cover;
  }
  .about-card-body { padding: 36px 32px; }
  .about-card-body h2 {
    font-size: 1.6rem;
    font-weight: 900;
    color: #0a2d6e;
    margin: 0 0 20px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .about-card-body h2 .about-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
  }
  .about-card-body h2 .about-icon.blue { background: #e3f0ff; color: #1565c0; }
  .about-card-body h2 .about-icon.green { background: #e8f5e9; color: #2e7d32; }
  .about-card-body h2 .about-icon.purple { background: #f3e5f5; color: #7b1fa2; }
  .about-card-body h2 .about-icon.orange { background: #fff3e0; color: #e65100; }

  .about-card-body p {
    color: #444;
    font-size: 0.95rem;
    line-height: 1.8;
    text-align: justify;
    margin-bottom: 16px;
  }

  /* Políticas lista */
  .politica-item {
    display: flex;
    gap: 14px;
    align-items: flex-start;
    padding: 14px 0;
    border-bottom: 1px solid #f0f0f0;
  }
  .politica-item:last-child { border-bottom: none; }
  .politica-num {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #e3f0ff;
    color: #1565c0;
    font-size: 0.8rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .politica-item p {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.65;
    color: #444;
    text-align: left;
  }
`;

const sections = [
  { key: "Asegurar", label: "Asegurar", icon: "pi pi-building", iconClass: "blue" },
  { key: "Mision", label: "Misión", icon: "pi pi-compass", iconClass: "green" },
  { key: "Vision", label: "Visión", icon: "pi pi-eye", iconClass: "purple" },
  { key: "Politicas", label: "Políticas", icon: "pi pi-list", iconClass: "orange" },
];

const contentInfo = {
  Asegurar: {
    title: "Asegurar Ltda.",
    icon: "pi pi-building",
    iconClass: "blue",
    paragraphs: [
      "Es una Red de Telecomunicaciones en la modalidad de Valor Agregado y Telemático, autorizada por el Ministerio de las Tecnologías de la Información y las Telecomunicaciones TIC., mediante Resolución No. 000656 de mayo del 2002 y, Registro TIC. No. 96000876 del 27 de octubre de 2011; para la prestación de servicios de tele acción: servicio básico de tele alarmas y telemáticos, satisfaciendo necesidades específicas de telecomunicaciones relacionadas con el monitoreo, la medición y la vigilancia.",
      "Proveedores de servicios GPS para maquinaria amarilla autorizados por la Oficina de Telemática de la Dirección General de la Policía Nacional de Colombia e, inscritos como prestadores de servicios ante el RUNT.",
      "Experiencia de 23 años en el ramo de las telecomunicaciones con domicilio principal en la ciudad de San Juan de Pasto – Nariño. Somos marca registrada. Prestamos servicios de monitoreo remoto de activos fijos y, móviles a través de nuestra plataforma tecnológica de telecomunicaciones CELLVI: (Central Especializada de Logística y Localización Vehicular Internacional).",
    ],
    image: fotoAboutus,
  },
  Mision: {
    title: "Misión",
    icon: "pi pi-compass",
    iconClass: "green",
    paragraphs: [
      "Como persona jurídica de derecho privado, presta a sus clientes y, suscriptores servicios de Telecomunicaciones en la modalidad de Valor Agregado y Telemático: (monitoreo remoto de activos fijos y móviles), generando modernas herramientas tecnológicas de control, administración, logística y seguridad; con el objeto de prevenir y disminuir las amenazas que afecten los legítimos derechos sobre los bienes y patrimonio de las personas que reciben nuestros productos y servicios. Para ello, mantenemos una estrecha coordinación con las Autoridades de la República, en todos los aspectos relacionados con la seguridad vial y ciudadana.",
    ],
    image: Mision,
  },
  Vision: {
    title: "Visión",
    icon: "pi pi-eye",
    iconClass: "purple",
    paragraphs: [
      "Haciendo uso adecuado de las nuevas tecnologías de la Información y las Telecomunicaciones, en el corto, mediano y largo plazo buscara posicionarse a la vanguardia de las empresas del ramo de las Telecomunicaciones a nivel regional, nacional e internacional, suministrando a sus clientes bienes, productos y servicios que cumplan con los más altos estándares de excelencia y calidad total; aprovechando los talentos y capacidades de la Ingeniería Nariñense, la clave para el logro de nuestra visión será rodearnos de gente buena, capacitada, empoderada y, que sienta amor por lo que hace.",
    ],
    image: Vision,
  },
  Politicas: {
    title: "Políticas Institucionales",
    icon: "pi pi-list",
    iconClass: "orange",
    intro: "El Equipo de Trabajo de ASEGURAR LTDA., para el cabal cumplimiento de su misión y visión, ejecutará todas sus actividades, orientados siempre por las siguientes normas de comportamiento y conducta:",
    items: [
      "Acatar la Constitución Política de Colombia, las Leyes y, normas que rigen los principios de la libre y, leal competencia comercial de la empresa privada.",
      "El resultado de las actuaciones de sus funcionarios, deben fortalecer la confianza en sus clientes y suscriptores.",
      "Adoptar todas las medidas de prevención y control para evitar que los servicios que presta sean utilizados como instrumentos para la realización de actividades ilegales.",
      "Mantener en todo momento altos niveles de eficiencia a través de una continua capacitación profesional y técnica de sus funcionarios.",
      "Contribuir a las Autoridades de la República en la prevención del delito, sin invadir las orbitas constitucionales.",
      "Prestar apoyo cuando las Autoridades así lo requieran en casos de calamidad publica o graves desastres naturales.",
      "Mantener actualizados todos los registros legales que el Estado le ha otorgado para el funcionamiento como Red de Telecomunicaciones.",
      "Salvaguardar la información confidencial que obtenga de sus clientes en desarrollo de los servicios que presta al público, mediante la política de tratamiento de datos personales.",
      "Atender en debida forma las quejas y, reclamos de los usuarios, que por causa y razón de los servicios que reciben, vean afectado sus intereses, para lo cual implementará una robusta y, oportuna respuesta a través de su portal PQR.",
      "Desarrollar mecanismos de control interno para prevenir que sus trabajadores y contratistas se involucren de manera directa o indirecta en la comisión de actos delictivos.",
      "Dar estricto cumplimiento a las normas que rigen las relaciones obrero patronales, haciendo uso adecuado del reglamento interno de trabajo y, la política publica de salud y seguridad en el trabajo.",
      "Los Socios, el Representante Legal y, los Trabajadores de la Sociedad comercial son ciudadanos Colombianos y/o extranjeros que cumplen los requisitos que las leyes de nuestro país exigen para el desempeño de sus cargos.",
      "En los eventos especiales en que la sociedad contrate con el sector público, observará y, cumplirá a cabalidad con las normas de las leyes de contratación estatal (ley 80 de 1993).",
    ],
    image: Politicas,
  },
};

export default function AboutUs() {
  const [active, setActive] = useState("Asegurar");
  const data = contentInfo[active];

  return (
    <>
      <style>{styles}</style>

      {/* Hero */}
      <div className="about-hero">
        <img src={imageDescription} alt="Acerca de Asegurar" />
        <div className="about-hero-overlay">
          <div className="about-hero-text">
            <h1>Acerca de Nosotros</h1>
            <p>Más de 23 años al servicio de la seguridad y las telecomunicaciones</p>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <section className="about-content">
        <div className="container">
          {/* Tabs */}
          <div className="about-tabs">
            {sections.map((s) => (
              <button
                key={s.key}
                className={`about-tab ${active === s.key ? "active" : ""}`}
                onClick={() => setActive(s.key)}
              >
                <i className={`${s.icon} me-2`} />
                {s.label}
              </button>
            ))}
          </div>

          {/* Card */}
          <div className="about-card" key={active}>
            <img src={data.image} alt={data.title} className="about-card-img" />
            <div className="about-card-body">
              <h2>
                <span className={`about-icon ${data.iconClass}`}>
                  <i className={data.icon} />
                </span>
                {data.title}
              </h2>

              {active === "Politicas" ? (
                <>
                  <p>{data.intro}</p>
                  {data.items.map((item, i) => (
                    <div key={i} className="politica-item">
                      <span className="politica-num">{i + 1}</span>
                      <p>{item}</p>
                    </div>
                  ))}
                </>
              ) : (
                data.paragraphs.map((p, i) => <p key={i}>{p}</p>)
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
