import { useState, useContext } from "react";
import { AsegurarContext } from "../../Context";
import YouTubePlayer from "../../Components/youtubePlayer";
import Map from "../../Components/map";
import planImage from "../../Assets/Planes/1.jpg";
import planImage2 from "../../Assets/Planes/2.jpg";
import planImage3 from "../../Assets/Planes/3.jpg";
import planImage4 from "../../Assets/Planes/4.jpg";
import planImage5 from "../../Assets/Planes/5.jpg";
import planImage6 from "../../Assets/Planes/6.jpg";
import imageDescription from "../../Assets/Foto Portada/1.jpg";
import $ from "jquery";

const styles = `
  /* Hero */
  .ct-hero { position: relative; width: 100%; max-height: 340px; overflow: hidden; }
  .ct-hero img { width: 100%; height: 340px; object-fit: cover; display: block; }
  .ct-hero-ov {
    position: absolute; inset: 0;
    background: linear-gradient(0deg, rgba(10,45,110,0.85) 0%, rgba(10,45,110,0.3) 60%, transparent 100%);
    display: flex; align-items: flex-end; padding: 36px 40px;
  }
  .ct-hero-ov h1 { color: #fff; font-size: clamp(2rem,4vw,2.8rem); font-weight: 900; margin: 0 0 6px; }
  .ct-hero-ov p { color: rgba(255,255,255,0.75); font-size: 1rem; margin: 0; }

  /* Quick nav */
  .ct-nav-bar {
    background: #fff; padding: 14px 0; box-shadow: 0 2px 12px rgba(0,0,0,0.05);
    position: sticky; top: 0; z-index: 10;
  }
  .ct-nav-inner { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
  .ct-nav-btn {
    padding: 8px 22px; border-radius: 8px; font-size: 0.85rem; font-weight: 700;
    border: 1.5px solid #e0e0e0; background: #fff; color: #444; cursor: pointer;
    transition: all 0.2s; text-decoration: none;
  }
  .ct-nav-btn:hover { border-color: #1565c0; color: #1565c0; background: #e3f0ff; }

  /* Plans */
  .ct-plans { padding: 60px 0; background: #f8fafc; }
  .ct-section-title {
    font-size: clamp(1.5rem,3vw,2rem); font-weight: 900; color: #0a2d6e;
    text-align: center; margin: 0 0 10px;
  }
  .ct-section-sub {
    text-align: center; color: #666; font-size: 0.95rem;
    max-width: 480px; margin: 0 auto 40px; line-height: 1.6;
  }
  .ct-plan-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
  @media (max-width: 768px) { .ct-plan-grid { grid-template-columns: 1fr; } }
  .ct-plan-card {
    background: #fff; border-radius: 14px; overflow: hidden;
    box-shadow: 0 3px 16px rgba(0,0,0,0.06); border: 1px solid #e8eef5;
    display: flex; transition: all 0.3s;
  }
  .ct-plan-card:hover { transform: translateY(-4px); box-shadow: 0 10px 30px rgba(21,101,192,0.1); border-color: #bbdefb; }
  .ct-plan-img { width: 140px; min-height: 100%; object-fit: cover; flex-shrink: 0; }
  @media (max-width: 576px) { .ct-plan-img { width: 100px; } }
  .ct-plan-body { padding: 18px 20px; display: flex; flex-direction: column; justify-content: center; }
  .ct-plan-body h4 { font-size: 0.95rem; font-weight: 800; color: #0a2d6e; margin: 0 0 6px; }
  .ct-plan-body p { font-size: 0.84rem; color: #666; line-height: 1.55; margin: 0 0 14px; }
  .ct-plan-wa {
    display: inline-flex; align-items: center; gap: 6px;
    background: #25d366; color: #fff; border: none; padding: 7px 16px;
    border-radius: 8px; font-size: 0.8rem; font-weight: 700; cursor: pointer;
    transition: all 0.2s; width: fit-content;
  }
  .ct-plan-wa:hover { background: #1ea952; }

  /* Contact form + map */
  .ct-contact { padding: 60px 0; background: #fff; }
  .ct-contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: start; }
  @media (max-width: 768px) { .ct-contact-grid { grid-template-columns: 1fr; } }
  .ct-media-col { display: flex; flex-direction: column; gap: 20px; }
  .ct-media-col .ct-video-wrap,
  .ct-media-col .ct-map-wrap {
    border-radius: 14px; overflow: hidden; box-shadow: 0 4px 18px rgba(0,0,0,0.08);
  }
  .ct-form-card {
    background: #f8fafc; border-radius: 14px; padding: 32px 28px;
    box-shadow: 0 4px 18px rgba(0,0,0,0.06); border: 1px solid #e8eef5;
  }
  .ct-form-card h3 { font-size: 1.2rem; font-weight: 800; color: #0a2d6e; margin: 0 0 6px; }
  .ct-form-card > p { font-size: 0.88rem; color: #888; margin: 0 0 24px; }
  .ct-field { margin-bottom: 16px; }
  .ct-field label { display: block; font-weight: 700; font-size: 0.85rem; color: #555; margin-bottom: 6px; }
  .ct-field input, .ct-field textarea {
    width: 100%; padding: 10px 14px; border: 1.5px solid #ddd; border-radius: 10px;
    font-size: 0.92rem; transition: border-color 0.2s; background: #fff;
  }
  .ct-field input:focus, .ct-field textarea:focus { border-color: #1565c0; outline: none; box-shadow: 0 0 0 3px rgba(21,101,192,0.1); }
  .ct-field textarea { min-height: 120px; resize: vertical; }
  .ct-submit-btn {
    width: 100%; padding: 13px; border: none; border-radius: 10px;
    background: linear-gradient(135deg, #0a2d6e, #1565c0); color: #fff;
    font-size: 0.95rem; font-weight: 800; cursor: pointer; transition: all 0.3s;
    margin-top: 6px;
  }
  .ct-submit-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(21,101,192,0.25); }
  .ct-alert { padding: 10px 14px; border-radius: 8px; font-size: 0.88rem; font-weight: 600; margin-bottom: 16px; }
  .ct-alert.error { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
  .ct-alert.success { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
`;

const planes = [
  { src: planImage, title: "Plan Premium", description: "Compra de equipo, mano de obra, accesorios de instalación y año de servicio prepago.", mensaje: "Necesito asesoría sobre el Plan Premium" },
  { src: planImage2, title: "Plan Estándar", description: "Compra de equipo, mano de obra, accesorios de instalación y servicio mensual prepago.", mensaje: "Necesito asesoría sobre el Plan Estándar" },
  { src: planImage3, title: "Plan Comodato", description: "ASEGURAR suministra equipo en comodato, mano de obra, accesorios y año de servicio.", mensaje: "Necesito asesoría sobre el Plan Comodato" },
  { src: planImage4, title: "Plan Homologación", description: "Si su vehículo ya tiene GPS compatible, se reprograma para vincularse a nuestra red.", mensaje: "Necesito asesoría sobre el Plan Homologación" },
  { src: planImage5, title: "Servicios Especiales", description: "Instalación de accesorios adicionales para carro tanques, grúas, volquetas, maquinaria.", mensaje: "Necesito asesoría sobre Servicios Especiales" },
  { src: planImage6, title: "Hablar con un asesor", description: "Contáctenos directamente para recibir información personalizada.", mensaje: "Necesito hablar con un asesor" },
];

export default function Contact() {
  const { handleWhatsAppClick } = useContext(AsegurarContext);
  const [formData, setFormData] = useState({ name: "", emailAddress: "", message: "" });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, emailAddress: email, message } = formData;
    if (!name || !email || !message) { setError("Todos los campos son obligatorios"); setSuccessMessage(null); return; }

    $.ajax({
      type: "POST",
      url: "http://cellviapi.asegurar.com.co/cellvi/correo/contacto",
      data: { name, email, message },
      success: (data) => {
        if (data.result === "success") { setSuccessMessage("¡Mensaje enviado correctamente!"); setError(null); }
        else { setError("Error al enviar. Inténtalo de nuevo."); setSuccessMessage(null); }
      },
      error: () => { setError("Error al enviar. Inténtalo de nuevo."); setSuccessMessage(null); },
      dataType: "json",
    });
  };

  return (
    <>
      <style>{styles}</style>

      {/* Hero */}
      <div className="ct-hero">
        <img src={imageDescription} alt="Contacto" />
        <div className="ct-hero-ov">
          <div>
            <h1>Contacto</h1>
            <p>Llámenos, escríbanos o visítenos. Estaremos encantados de atenderle.</p>
          </div>
        </div>
      </div>

      {/* Quick nav */}
      <div className="ct-nav-bar">
        <div className="container ct-nav-inner">
          <a href="#planes" className="ct-nav-btn"><i className="pi pi-tag me-1" />Planes</a>
          <a href="#contacto" className="ct-nav-btn"><i className="pi pi-envelope me-1" />Formulario</a>
          <a href="#mapa" className="ct-nav-btn"><i className="pi pi-map me-1" />Ubicación</a>
        </div>
      </div>

      {/* Planes */}
      <section className="ct-plans" id="planes">
        <div className="container">
          <h2 className="ct-section-title">Nuestros Planes</h2>
          <p className="ct-section-sub">Elija el plan que mejor se adapte a sus necesidades de monitoreo vehicular.</p>
          <div className="ct-plan-grid">
            {planes.map((p, i) => (
              <div key={i} className="ct-plan-card">
                <img src={p.src} alt={p.title} className="ct-plan-img" />
                <div className="ct-plan-body">
                  <h4>{p.title}</h4>
                  <p>{p.description}</p>
                  <button className="ct-plan-wa" onClick={() => handleWhatsAppClick(p.mensaje)}>
                    <i className="pi pi-whatsapp" /> Más información
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto + Mapa */}
      <section className="ct-contact" id="contacto">
        <div className="container">
          <h2 className="ct-section-title" style={{ marginBottom: 32 }}>Ponte en contacto</h2>
          <div className="ct-contact-grid">
            <div className="ct-media-col">
              <div className="ct-video-wrap">
                <YouTubePlayer url="https://youtu.be/FMLjZqb8oJI?si=uMhs3sjxEfeBNdfB" />
              </div>
              <div className="ct-map-wrap" id="mapa">
                <Map />
              </div>
            </div>
            <div className="ct-form-card">
              <h3><i className="pi pi-send me-2" style={{ color: "#1565c0" }} />Envíanos un mensaje</h3>
              <p>Responderemos a la brevedad posible.</p>

              {error && <div className="ct-alert error">{error}</div>}
              {successMessage && <div className="ct-alert success">{successMessage}</div>}

              <form onSubmit={handleSubmit}>
                <div className="ct-field">
                  <label htmlFor="ct-name">Nombre</label>
                  <input id="ct-name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Su nombre completo" />
                </div>
                <div className="ct-field">
                  <label htmlFor="ct-email">Email</label>
                  <input id="ct-email" name="emailAddress" type="email" value={formData.emailAddress} onChange={handleInputChange} placeholder="correo@ejemplo.com" />
                </div>
                <div className="ct-field">
                  <label htmlFor="ct-msg">Mensaje</label>
                  <textarea id="ct-msg" name="message" value={formData.message} onChange={handleInputChange} placeholder="¿En qué podemos ayudarle?" />
                </div>
                <button type="submit" className="ct-submit-btn">
                  <i className="pi pi-send me-2" />Enviar mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
