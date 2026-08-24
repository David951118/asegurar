import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

/**
 * Sección promocional de Cellvi (rastreo GPS) — diseño propio: mockup de
 * celular con radar y mapa animado + lista de capacidades. Distinto del
 * navegador del PESV y del flujo de pasos del RNDC.
 */

const styles = `
  .cv-band {
    background:
      radial-gradient(ellipse at 15% 110%, rgba(140,233,154,0.12), transparent 55%),
      linear-gradient(160deg, #06281a 0%, #0b4229 55%, #0e5c37 100%);
    padding: 80px 0;
    position: relative;
    overflow: hidden;
  }

  .cv-reveal { opacity: 0; transform: translateY(30px); transition: opacity .7s ease, transform .7s ease; }
  .cv-band.cv-visible .cv-reveal { opacity: 1; transform: translateY(0); }
  .cv-band.cv-visible .cv-reveal-delay { transition-delay: .18s; }

  .cv-inner {
    display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 60px; align-items: center;
    position: relative; z-index: 2;
  }
  @media (max-width: 950px) {
    .cv-inner { grid-template-columns: 1fr; gap: 48px; }
    .cv-phone-wrap { order: 2; }
  }

  /* ── Columna teléfono ── */
  .cv-phone-wrap { position: relative; display: flex; justify-content: center; }
  .cv-phone {
    width: min(290px, 78vw);
    background: #0a1f14;
    border: 1px solid rgba(255,255,255,0.16);
    border-radius: 34px;
    padding: 12px;
    box-shadow: 0 30px 80px rgba(0,0,0,0.5);
    position: relative;
    transform: rotate(-3deg);
    transition: transform .4s ease;
  }
  .cv-phone:hover { transform: rotate(0deg); }
  .cv-phone-notch {
    width: 96px; height: 22px; background: #0a1f14;
    border-radius: 0 0 14px 14px;
    position: absolute; top: 12px; left: 50%; transform: translateX(-50%); z-index: 3;
  }
  .cv-screen {
    border-radius: 24px; overflow: hidden; position: relative;
    background:
      linear-gradient(rgba(140,233,154,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(140,233,154,0.06) 1px, transparent 1px),
      linear-gradient(170deg, #123726 0%, #0d2b1d 100%);
    background-size: 26px 26px, 26px 26px, cover;
    height: 480px;
  }
  /* "Vías" del mapa */
  .cv-screen::before {
    content: "";
    position: absolute; inset: 0;
    background:
      linear-gradient(75deg, transparent 47.6%, rgba(255,255,255,0.09) 48%, rgba(255,255,255,0.09) 49.4%, transparent 49.8%),
      linear-gradient(-25deg, transparent 61.6%, rgba(255,255,255,0.07) 62%, rgba(255,255,255,0.07) 63.4%, transparent 63.8%);
  }

  .cv-statusbar {
    position: relative; z-index: 2;
    display: flex; justify-content: space-between; align-items: center;
    padding: 30px 16px 8px; color: rgba(255,255,255,0.85);
    font-size: 0.68rem; font-weight: 700;
  }
  .cv-statusbar .brand { display: flex; align-items: center; gap: 6px; color: #8ce99a; font-size: 0.78rem; letter-spacing: 0.5px; }

  /* Radar y vehículos */
  .cv-dot {
    position: absolute; z-index: 2;
    width: 14px; height: 14px; border-radius: 50%;
    background: #8ce99a; border: 2.5px solid #06281a;
    box-shadow: 0 0 10px rgba(140,233,154,0.9);
  }
  .cv-dot.principal { top: 46%; left: 44%; animation: cvDrive 9s ease-in-out infinite; }
  .cv-dot.dos { top: 26%; left: 68%; background: #ffd54f; box-shadow: 0 0 10px rgba(255,213,79,0.8); animation: cvDrive2 11s ease-in-out infinite; }
  @keyframes cvDrive {
    0%,100% { transform: translate(0,0); }
    30% { transform: translate(34px,-22px); }
    60% { transform: translate(10px,-52px); }
    80% { transform: translate(-18px,-20px); }
  }
  @keyframes cvDrive2 {
    0%,100% { transform: translate(0,0); }
    40% { transform: translate(-30px,26px); }
    70% { transform: translate(-58px,8px); }
  }
  .cv-ring {
    position: absolute; top: 46%; left: 44%; z-index: 1;
    width: 14px; height: 14px; border-radius: 50%;
    border: 2px solid rgba(140,233,154,0.55);
    animation: cvPulse 2.6s ease-out infinite;
  }
  .cv-ring.r2 { animation-delay: 1.3s; }
  @keyframes cvPulse {
    from { transform: scale(1); opacity: 0.9; }
    to { transform: scale(9); opacity: 0; }
  }

  /* Tarjeta inferior del teléfono (info del vehículo, rota) */
  .cv-sheet {
    position: absolute; z-index: 3; left: 10px; right: 10px; bottom: 10px;
    background: rgba(8,28,18,0.92);
    border: 1px solid rgba(140,233,154,0.25);
    border-radius: 16px; padding: 13px 14px;
    backdrop-filter: blur(4px);
  }
  .cv-sheet-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .cv-sheet-head b { color: #fff; font-size: 0.82rem; }
  .cv-sheet-tag {
    font-size: 0.6rem; font-weight: 800; letter-spacing: 0.5px;
    padding: 3px 10px; border-radius: 999px;
    background: rgba(140,233,154,0.15); color: #8ce99a;
  }
  .cv-sheet-tag.warn { background: rgba(255,213,79,0.15); color: #ffd54f; }
  .cv-sheet-row { display: flex; gap: 12px; color: rgba(255,255,255,0.65); font-size: 0.68rem; }
  .cv-sheet-row i { color: #8ce99a; margin-right: 4px; }
  .cv-sheet-anim { animation: cvFadeUp .5s ease both; }
  @keyframes cvFadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

  /* Alerta flotante sobre el teléfono */
  .cv-toast {
    position: absolute; z-index: 4; top: 84px; left: -26px;
    display: flex; align-items: center; gap: 9px;
    background: #fff; border-radius: 12px; padding: 10px 14px;
    box-shadow: 0 14px 40px rgba(0,0,0,0.35);
    font-size: 0.72rem; font-weight: 700; color: #143a26;
    animation: cvToast 8s ease-in-out infinite;
  }
  .cv-toast i { color: #e65100; font-size: 0.95rem; }
  @keyframes cvToast {
    0%, 12% { opacity: 0; transform: translateX(-14px); }
    18%, 55% { opacity: 1; transform: translateX(0); }
    62%, 100% { opacity: 0; transform: translateX(-14px); }
  }
  .cv-chip-float {
    position: absolute; z-index: 4; bottom: 130px; right: -20px;
    display: flex; align-items: center; gap: 8px;
    background: rgba(8,28,18,0.92); border: 1px solid rgba(140,233,154,0.35);
    border-radius: 999px; padding: 8px 15px;
    color: #8ce99a; font-size: 0.72rem; font-weight: 800;
  }
  @media (max-width: 480px) { .cv-toast { left: 4px; } .cv-chip-float { right: 4px; } }

  /* ── Columna texto ── */
  .cv-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(140,233,154,0.12); border: 1px solid rgba(140,233,154,0.3);
    border-radius: 999px; padding: 6px 18px;
    font-size: 0.76rem; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase;
    color: #8ce99a; margin-bottom: 18px;
  }
  .cv-title { color: #fff; font-size: clamp(1.7rem, 3.2vw, 2.4rem); font-weight: 900; line-height: 1.15; margin: 0 0 14px; }
  .cv-title span { color: #8ce99a; }
  .cv-lead { color: rgba(255,255,255,0.76); font-size: 1rem; line-height: 1.7; margin: 0 0 26px; max-width: 500px; }

  .cv-feats { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 30px; }
  @media (max-width: 576px) { .cv-feats { grid-template-columns: 1fr; } }
  .cv-feat {
    display: flex; gap: 12px; align-items: flex-start;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 14px; padding: 14px 15px; transition: all .25s;
  }
  .cv-feat:hover { background: rgba(255,255,255,0.09); transform: translateY(-2px); }
  .cv-feat-ic {
    width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: rgba(140,233,154,0.14); color: #8ce99a; font-size: 1rem;
  }
  .cv-feat b { display: block; color: #fff; font-size: 0.88rem; font-weight: 800; margin-bottom: 3px; }
  .cv-feat small { color: rgba(255,255,255,0.6); font-size: 0.78rem; line-height: 1.45; display: block; }

  .cv-ctas { display: flex; gap: 14px; flex-wrap: wrap; }
  .cv-btn-primary {
    display: inline-flex; align-items: center; gap: 10px;
    background: #8ce99a; color: #06301c; font-weight: 900;
    padding: 15px 30px; border-radius: 50px; font-size: 0.95rem; text-decoration: none;
    transition: all .3s; box-shadow: 0 8px 28px rgba(140,233,154,0.28);
  }
  .cv-btn-primary:hover { filter: brightness(0.94); color: #06301c; transform: translateY(-3px); box-shadow: 0 12px 36px rgba(140,233,154,0.42); }
  .cv-btn-outline {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent; color: #fff; font-weight: 700;
    padding: 15px 30px; border-radius: 50px; font-size: 0.95rem; text-decoration: none;
    border: 2px solid rgba(255,255,255,0.4); transition: all .3s;
  }
  .cv-btn-outline:hover { background: rgba(255,255,255,0.1); border-color: #fff; color: #fff; }
`;

const VEHICULOS = [
  { placa: "WHK-521", estado: "En movimiento", tag: "62 km/h", warn: false, lugar: "Vía Panamericana · Ipiales" },
  { placa: "TQR-309", estado: "Detenido", tag: "25 min", warn: true, lugar: "Bodega Norte · Pasto" },
  { placa: "GHT-112", estado: "En ruta", tag: "48 km/h", warn: false, lugar: "Variante · Popayán" },
];

export default function CellviPromo() {
  const [visible, setVisible] = useState(false);
  const [veh, setVeh] = useState(0);
  const bandRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 },
    );
    if (bandRef.current) obs.observe(bandRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const t = setInterval(() => setVeh((v) => (v + 1) % VEHICULOS.length), 4000);
    return () => clearInterval(t);
  }, [visible]);

  const v = VEHICULOS[veh];

  return (
    <section ref={bandRef} className={`cv-band ${visible ? "cv-visible" : ""}`}>
      <style>{styles}</style>
      <div className="container">
        <div className="cv-inner">
          {/* Teléfono con radar */}
          <div className="cv-phone-wrap cv-reveal cv-reveal-delay">
            <div className="cv-phone">
              <div className="cv-phone-notch" />
              <div className="cv-screen">
                <div className="cv-statusbar">
                  <span className="brand"><i className="pi pi-compass" /> CELLVI</span>
                  <span>GPS · 4G</span>
                </div>
                <span className="cv-ring" />
                <span className="cv-ring r2" />
                <span className="cv-dot principal" />
                <span className="cv-dot dos" />
                <div className="cv-sheet cv-sheet-anim" key={veh}>
                  <div className="cv-sheet-head">
                    <b><i className="pi pi-car" style={{ color: "#8ce99a", marginRight: 6 }} />{v.placa}</b>
                    <span className={`cv-sheet-tag ${v.warn ? "warn" : ""}`}>{v.estado.toUpperCase()}</span>
                  </div>
                  <div className="cv-sheet-row">
                    <span><i className="pi pi-gauge" />{v.tag}</span>
                    <span><i className="pi pi-map-marker" />{v.lugar}</span>
                  </div>
                </div>
              </div>
              <div className="cv-toast">
                <i className="pi pi-bell" /> Alerta: exceso de velocidad · GHT-112
              </div>
              <div className="cv-chip-float">
                <i className="pi pi-circle-fill" style={{ fontSize: "0.5rem" }} /> 17/18 en línea
              </div>
            </div>
          </div>

          {/* Texto */}
          <div className="cv-reveal">
            <div className="cv-badge"><i className="pi pi-compass" /> Rastreo GPS vehicular</div>
            <h2 className="cv-title">
              Su flota siempre visible con <span>Cellvi</span>, nuestro GPS
            </h2>
            <p className="cv-lead">
              La plataforma de rastreo satelital de Asegurar: ubicación en tiempo real,
              historial de rutas, alertas al instante y app móvil, con el respaldo de
              nuestra central de monitoreo 24/7.
            </p>

            <div className="cv-feats">
              <div className="cv-feat">
                <div className="cv-feat-ic"><i className="pi pi-map" /></div>
                <div><b>Tiempo real</b><small>Posición, velocidad y estado de cada vehículo en el mapa.</small></div>
              </div>
              <div className="cv-feat">
                <div className="cv-feat-ic"><i className="pi pi-directions" /></div>
                <div><b>Historial de rutas</b><small>Recorridos, paradas y kilometraje con reportes en PDF.</small></div>
              </div>
              <div className="cv-feat">
                <div className="cv-feat-ic"><i className="pi pi-bell" /></div>
                <div><b>Alertas al instante</b><small>Pánico, velocidad, geocercas, apertura y encendido.</small></div>
              </div>
              <div className="cv-feat">
                <div className="cv-feat-ic"><i className="pi pi-mobile" /></div>
                <div><b>App móvil</b><small>Su flota en el celular con notificaciones push.</small></div>
              </div>
            </div>

            <div className="cv-ctas">
              <NavLink to="/cellvi" className="cv-btn-primary">
                <i className="pi pi-compass" /> Conocer Cellvi
              </NavLink>
              <NavLink to="/contacto" className="cv-btn-outline">
                <i className="pi pi-comments" /> Solicitar cotización
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
