import YouTubePlayer from "../../Components/youtubePlayer";
import imageDescription from "../../Assets/Foto Portada/cellvi.jpg";

const styles = `
  .cellvi-page { background: #f8fafc; }

  /* Hero */
  .cellvi-hero { position: relative; width: 100%; max-height: 340px; overflow: hidden; }
  .cellvi-hero img { width: 100%; height: 340px; object-fit: cover; display: block; }
  .cellvi-hero-ov {
    position: absolute; inset: 0;
    background: linear-gradient(0deg, rgba(10,45,110,0.85) 0%, rgba(10,45,110,0.35) 60%, transparent 100%);
    display: flex; align-items: flex-end; padding: 36px 40px;
  }
  .cellvi-hero-ov h1 { color: #fff; font-size: clamp(1.8rem,4vw,2.6rem); font-weight: 900; margin: 0 0 6px; }
  .cellvi-hero-ov p { color: rgba(255,255,255,0.75); font-size: 0.95rem; margin: 0; max-width: 600px; line-height: 1.5; }

  /* Content */
  .cellvi-content { padding: 48px 0 64px; }
  .cellvi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: start; }
  @media (max-width: 768px) { .cellvi-grid { grid-template-columns: 1fr; } }

  /* Video */
  .cellvi-video-card {
    background: #fff; border-radius: 14px; overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e8eef5;
  }
  .cellvi-video-body { padding: 20px 22px; }
  .cellvi-video-body h3 {
    font-size: 1.05rem; font-weight: 800; color: #0a2d6e;
    margin: 0 0 6px; display: flex; align-items: center; gap: 8px;
  }
  .cellvi-video-body p { font-size: 0.88rem; color: #888; margin: 0; }

  /* Login iframe */
  .cellvi-login-card {
    background: #fff; border-radius: 14px; overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e8eef5;
  }
  .cellvi-login-header {
    background: linear-gradient(135deg, #0a2d6e, #1565c0);
    padding: 22px 24px; color: #fff;
  }
  .cellvi-login-header h3 {
    font-size: 1.15rem; font-weight: 900; margin: 0 0 4px;
    display: flex; align-items: center; gap: 8px;
  }
  .cellvi-login-header p { font-size: 0.85rem; color: rgba(255,255,255,0.7); margin: 0; }
  .cellvi-iframe-wrap { padding: 6px; }
  .cellvi-iframe-wrap iframe {
    width: 100%; height: 440px; border: none; border-radius: 10px;
  }

  /* Features */
  .cellvi-features {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
    margin-top: 32px;
  }
  @media (max-width: 768px) { .cellvi-features { grid-template-columns: 1fr; } }
  .cellvi-feat {
    background: #fff; border-radius: 12px; padding: 20px 18px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05); border: 1px solid #e8eef5;
    text-align: center; transition: all 0.3s;
  }
  .cellvi-feat:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(21,101,192,0.1); border-color: #bbdefb; }
  .cellvi-feat-icon {
    width: 48px; height: 48px; border-radius: 12px; display: flex;
    align-items: center; justify-content: center; margin: 0 auto 12px;
    font-size: 1.3rem;
  }
  .cellvi-feat-icon.blue { background: #e3f0ff; color: #1565c0; }
  .cellvi-feat-icon.green { background: #e8f5e9; color: #2e7d32; }
  .cellvi-feat-icon.orange { background: #fff3e0; color: #e65100; }
  .cellvi-feat h4 { font-size: 0.88rem; font-weight: 800; color: #0a2d6e; margin: 0 0 4px; }
  .cellvi-feat p { font-size: 0.8rem; color: #888; margin: 0; line-height: 1.5; }
`;

export default function LogCelvi() {
  return (
    <>
      <style>{styles}</style>
      <div className="cellvi-page">
        {/* Hero */}
        <div className="cellvi-hero">
          <img src={imageDescription} alt="CELLVI" />
          <div className="cellvi-hero-ov">
            <div>
              <h1>Plataforma CELLVI</h1>
              <p>
                Central Especializada de Logística y Localización Vehicular Internacional.
                Monitoree su flota en tiempo real desde cualquier dispositivo.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <section className="cellvi-content">
          <div className="container">
            <div className="cellvi-grid">
              {/* Video tutorial */}
              <div className="cellvi-video-card">
                <YouTubePlayer url="https://youtu.be/anZdB5xSGWY?si=nLihplX2q-_kZjzJ" />
                <div className="cellvi-video-body">
                  <h3><i className="pi pi-play-circle" /> Cómo ingresar</h3>
                  <p>Tutorial paso a paso para acceder a la plataforma CELLVI.</p>
                </div>
              </div>

              {/* Login */}
              <div className="cellvi-login-card">
                <div className="cellvi-login-header">
                  <h3><i className="pi pi-sign-in" /> Ingresa aquí</h3>
                  <p>Use sus credenciales CELLVI para acceder al sistema de monitoreo.</p>
                </div>
                <div className="cellvi-iframe-wrap">
                  <iframe
                    title="Login Cellvi"
                    src="https://cellviweb.asegurar.com.co"
                    allow="clipboard-write; encrypted-media"
                  />
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="cellvi-features">
              <div className="cellvi-feat">
                <div className="cellvi-feat-icon blue"><i className="pi pi-map-marker" /></div>
                <h4>Rastreo en tiempo real</h4>
                <p>Posición GPS de toda su flota actualizada al instante.</p>
              </div>
              <div className="cellvi-feat">
                <div className="cellvi-feat-icon green"><i className="pi pi-mobile" /></div>
                <h4>App móvil</h4>
                <p>Disponible para Android e iOS. Monitoree desde cualquier lugar.</p>
              </div>
              <div className="cellvi-feat">
                <div className="cellvi-feat-icon orange"><i className="pi pi-bell" /></div>
                <h4>Alertas inteligentes</h4>
                <p>Geocercas, excesos de velocidad y notificaciones en tiempo real.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
