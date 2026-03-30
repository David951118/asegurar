import { NavLink } from "react-router-dom";

const PESV_URL = "https://pesv.asegurar.com.co";

const styles = `
  .pesv-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #0a2d6e 0%, #1565c0 60%, #1e88e5 100%);
    display: flex;
    flex-direction: column;
  }

  .pesv-hero {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    position: relative;
    overflow: hidden;
  }
  .pesv-hero::before {
    content: "";
    position: absolute;
    right: -120px;
    top: 50%;
    transform: translateY(-50%);
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: rgba(255,255,255,0.04);
    border: 2px solid rgba(255,255,255,0.06);
  }

  .pesv-hero-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    max-width: 1100px;
    width: 100%;
    align-items: center;
    position: relative;
    z-index: 2;
  }

  /* Left */
  .pesv-info {
    color: #fff;
    animation: pesvSlideIn 0.6s ease-out;
  }
  .pesv-info-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 999px;
    padding: 6px 18px;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.7);
    margin-bottom: 22px;
  }
  .pesv-info h1 {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 900;
    line-height: 1.1;
    margin: 0 0 16px;
    color: #fff;
  }
  .pesv-info h1 span { color: #ffd54f; }
  .pesv-info > p {
    font-size: 1.05rem;
    color: rgba(255,255,255,0.8);
    line-height: 1.7;
    margin: 0 0 32px;
  }

  .pesv-features {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 36px;
  }
  .pesv-feat {
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 12px 16px;
  }
  .pesv-feat-icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: rgba(255,213,79,0.2);
    color: #ffd54f;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
  }
  .pesv-feat span {
    font-size: 0.9rem;
    color: rgba(255,255,255,0.85);
    font-weight: 500;
  }

  .pesv-cta-group {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
  }
  .pesv-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: #ffd54f;
    color: #0a2d6e;
    font-weight: 900;
    padding: 16px 32px;
    border-radius: 50px;
    font-size: 1rem;
    text-decoration: none;
    transition: all 0.3s;
    border: none;
    cursor: pointer;
    box-shadow: 0 8px 28px rgba(255,213,79,0.3);
  }
  .pesv-btn-primary:hover {
    background: #ffca28;
    color: #0a2d6e;
    transform: translateY(-3px);
    box-shadow: 0 12px 36px rgba(255,213,79,0.4);
  }
  .pesv-btn-outline {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    color: #fff;
    font-weight: 700;
    padding: 16px 32px;
    border-radius: 50px;
    font-size: 1rem;
    text-decoration: none;
    border: 2px solid rgba(255,255,255,0.4);
    transition: all 0.3s;
  }
  .pesv-btn-outline:hover {
    background: rgba(255,255,255,0.1);
    border-color: #fff;
    color: #fff;
  }

  /* Right: Card visual */
  .pesv-card-visual {
    animation: pesvSlideRight 0.6s ease-out;
  }
  .pesv-visual-card {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 24px;
    padding: 36px 32px;
    backdrop-filter: blur(8px);
  }
  .pesv-visual-icon {
    width: 72px;
    height: 72px;
    background: rgba(255,213,79,0.15);
    border: 1px solid rgba(255,213,79,0.25);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: #ffd54f;
    margin: 0 auto 20px;
  }
  .pesv-visual-card h3 {
    color: #fff;
    font-size: 1.3rem;
    font-weight: 900;
    text-align: center;
    margin: 0 0 8px;
  }
  .pesv-visual-card > p {
    color: rgba(255,255,255,0.65);
    font-size: 0.9rem;
    text-align: center;
    margin: 0 0 24px;
    line-height: 1.5;
  }
  .pesv-visual-steps {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .pesv-step {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .pesv-step-num {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #ffd54f;
    color: #0a2d6e;
    font-size: 0.78rem;
    font-weight: 900;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .pesv-step span {
    color: rgba(255,255,255,0.8);
    font-size: 0.88rem;
  }
  .pesv-visual-divider {
    border: none;
    border-top: 1px solid rgba(255,255,255,0.1);
    margin: 20px 0;
  }
  .pesv-visual-note {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    background: rgba(255,213,79,0.08);
    border: 1px solid rgba(255,213,79,0.15);
    border-radius: 10px;
    padding: 12px 14px;
  }
  .pesv-visual-note i {
    color: #ffd54f;
    font-size: 1rem;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .pesv-visual-note p {
    margin: 0;
    color: rgba(255,255,255,0.7);
    font-size: 0.82rem;
    line-height: 1.5;
  }

  @keyframes pesvSlideIn {
    from { opacity: 0; transform: translateX(-50px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes pesvSlideRight {
    from { opacity: 0; transform: translateX(50px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @media (max-width: 900px) {
    .pesv-hero-inner { grid-template-columns: 1fr; gap: 40px; }
    .pesv-card-visual { display: none; }
  }
`;

export default function PesvPage() {
  return (
    <>
      <style>{styles}</style>
      <div className="pesv-page">
        <section className="pesv-hero">
          <div className="pesv-hero-inner">
            {/* Info */}
            <div className="pesv-info">
              <div className="pesv-info-badge">
                <i className="pi pi-shield" />
                Asegurar Ltda.
              </div>
              <h1>
                Portal <span>PESV</span>
              </h1>
              <p>
                Acceda al sistema de preoperativas y contratos FUEC desde nuestro
                portal especializado. Gestione inspecciones vehiculares y documentación
                de transporte de manera digital y centralizada.
              </p>

              <div className="pesv-features">
                <div className="pesv-feat">
                  <div className="pesv-feat-icon"><i className="pi pi-file-edit" /></div>
                  <span>Registro de preoperativas antes de cada despacho</span>
                </div>
                <div className="pesv-feat">
                  <div className="pesv-feat-icon"><i className="pi pi-file" /></div>
                  <span>Creación y gestión de contratos FUEC</span>
                </div>
                <div className="pesv-feat">
                  <div className="pesv-feat-icon"><i className="pi pi-car" /></div>
                  <span>Inspección y mantenimiento periódico de vehículos</span>
                </div>
              </div>

              <div className="pesv-cta-group">
                <a
                  href={PESV_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pesv-btn-primary"
                >
                  <i className="pi pi-external-link" />
                  Ingresar al PESV
                </a>
                <NavLink to="/contacto" className="pesv-btn-outline">
                  <i className="pi pi-envelope" />
                  Solicitar acceso
                </NavLink>
              </div>
            </div>

            {/* Card visual */}
            <div className="pesv-card-visual">
              <div className="pesv-visual-card">
                <div className="pesv-visual-icon">
                  <i className="pi pi-shield" />
                </div>
                <h3>Portal PESV</h3>
                <p>pesv.asegurar.com.co</p>

                <div className="pesv-visual-steps">
                  <div className="pesv-step">
                    <span className="pesv-step-num">1</span>
                    <span>Haga clic en "Ingresar al PESV"</span>
                  </div>
                  <div className="pesv-step">
                    <span className="pesv-step-num">2</span>
                    <span>Inicie sesión con sus credenciales</span>
                  </div>
                  <div className="pesv-step">
                    <span className="pesv-step-num">3</span>
                    <span>Registre preoperativas o cree contratos FUEC</span>
                  </div>
                  <div className="pesv-step">
                    <span className="pesv-step-num">4</span>
                    <span>Descargue reportes y documentación</span>
                  </div>
                </div>

                <hr className="pesv-visual-divider" />

                <div className="pesv-visual-note">
                  <i className="pi pi-info-circle" />
                  <p>
                    Si aún no tiene credenciales de acceso al portal PESV,
                    contáctenos para registrar su empresa y recibir sus datos de ingreso.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
