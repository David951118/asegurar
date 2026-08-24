import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

/**
 * Sección promocional del módulo RNDC — diseño propio: flujo de proceso
 * horizontal animado (Credencial → Remesa → Manifiesto → Cumplido) sobre
 * fondo pizarra con acento cian. Distinto del mockup de navegador del PESV
 * y del celular de Cellvi.
 */

const styles = `
  .rp-band {
    background:
      radial-gradient(ellipse at 80% -20%, rgba(77,208,225,0.14), transparent 55%),
      linear-gradient(150deg, #0b2530 0%, #103545 60%, #0d2e3c 100%);
    padding: 78px 0 70px;
    position: relative;
    overflow: hidden;
  }
  .rp-band::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px);
    background-size: 44px 44px;
    pointer-events: none;
  }

  .rp-reveal { opacity: 0; transform: translateY(30px); transition: opacity .7s ease, transform .7s ease; }
  .rp-band.rp-visible .rp-reveal { opacity: 1; transform: translateY(0); }
  .rp-band.rp-visible .rp-d1 { transition-delay: .12s; }
  .rp-band.rp-visible .rp-d2 { transition-delay: .24s; }
  .rp-band.rp-visible .rp-d3 { transition-delay: .36s; }

  .rp-head { text-align: center; max-width: 720px; margin: 0 auto 46px; position: relative; z-index: 2; }
  .rp-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(77,208,225,0.12); border: 1px solid rgba(77,208,225,0.3);
    border-radius: 999px; padding: 6px 18px;
    font-size: 0.76rem; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase;
    color: #4dd0e1; margin-bottom: 18px;
  }
  .rp-title { color: #fff; font-size: clamp(1.7rem, 3.2vw, 2.4rem); font-weight: 900; line-height: 1.15; margin: 0 0 14px; }
  .rp-title span { color: #4dd0e1; }
  .rp-lead { color: rgba(255,255,255,0.75); font-size: 1rem; line-height: 1.7; margin: 0; }

  /* ── Flujo de pasos ── */
  .rp-flow { position: relative; z-index: 2; max-width: 1000px; margin: 0 auto 20px; }
  .rp-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; position: relative; }
  @media (max-width: 860px) { .rp-steps { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 480px) { .rp-steps { grid-template-columns: 1fr; } }

  /* Línea conectora (solo desktop) */
  .rp-track {
    position: absolute; top: 34px; left: 12%; right: 12%;
    height: 3px; border-radius: 2px; background: rgba(255,255,255,0.1); z-index: 0;
  }
  .rp-track i {
    display: block; height: 100%; border-radius: 2px;
    background: linear-gradient(90deg, #4dd0e1, #80deea);
    box-shadow: 0 0 12px rgba(77,208,225,0.8);
    transition: width 0.8s cubic-bezier(.4,0,.2,1);
  }
  @media (max-width: 860px) { .rp-track { display: none; } }

  .rp-step {
    position: relative; z-index: 1; text-align: center;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 16px; padding: 22px 16px 18px;
    cursor: pointer; transition: all .35s;
  }
  .rp-step:hover { background: rgba(255,255,255,0.07); }
  .rp-step.on {
    background: rgba(77,208,225,0.09);
    border-color: rgba(77,208,225,0.5);
    box-shadow: 0 14px 40px rgba(0,0,0,0.35);
    transform: translateY(-4px);
  }
  .rp-step-num {
    position: absolute; top: 10px; right: 14px;
    font-size: 0.68rem; font-weight: 900; color: rgba(255,255,255,0.25);
  }
  .rp-step.on .rp-step-num { color: rgba(77,208,225,0.7); }
  .rp-step-ic {
    width: 52px; height: 52px; border-radius: 50%;
    margin: 0 auto 12px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.6);
    font-size: 1.25rem; transition: all .35s;
    border: 2px solid transparent;
  }
  .rp-step.on .rp-step-ic {
    background: #4dd0e1; color: #062a35;
    border-color: rgba(255,255,255,0.25);
    box-shadow: 0 0 0 6px rgba(77,208,225,0.15), 0 0 24px rgba(77,208,225,0.5);
  }
  .rp-step b { display: block; color: #fff; font-size: 0.92rem; font-weight: 800; margin-bottom: 5px; }
  .rp-step small { color: rgba(255,255,255,0.55); font-size: 0.78rem; line-height: 1.45; display: block; }

  .rp-step-detail {
    margin-top: 12px; display: inline-flex; align-items: center; gap: 7px;
    background: rgba(6,42,53,0.75); border: 1px solid rgba(77,208,225,0.35);
    color: #9ff1fb; border-radius: 999px; padding: 5px 13px;
    font-size: 0.7rem; font-weight: 700;
    opacity: 0; transform: translateY(6px); transition: all .35s;
  }
  .rp-step.on .rp-step-detail { opacity: 1; transform: translateY(0); }
  .rp-step-detail .dot { width: 7px; height: 7px; border-radius: 50%; background: #66bb6a; animation: rpBlink 1.2s infinite; }
  @keyframes rpBlink { 50% { opacity: 0.3; } }

  /* ── Chips de beneficios ── */
  .rp-chips { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin: 34px 0 30px; position: relative; z-index: 2; }
  .rp-chip {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 999px; padding: 9px 18px;
    color: rgba(255,255,255,0.85); font-size: 0.82rem; font-weight: 600;
  }
  .rp-chip i { color: #4dd0e1; font-size: 0.9rem; }

  /* ── CTAs ── */
  .rp-ctas { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; position: relative; z-index: 2; }
  .rp-btn-primary {
    display: inline-flex; align-items: center; gap: 10px;
    background: #4dd0e1; color: #062a35; font-weight: 900;
    padding: 15px 30px; border-radius: 50px; font-size: 0.95rem; text-decoration: none;
    transition: all .3s; box-shadow: 0 8px 28px rgba(77,208,225,0.3);
  }
  .rp-btn-primary:hover { filter: brightness(0.94); color: #062a35; transform: translateY(-3px); box-shadow: 0 12px 36px rgba(77,208,225,0.45); }
  .rp-btn-outline {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent; color: #fff; font-weight: 700;
    padding: 15px 30px; border-radius: 50px; font-size: 0.95rem; text-decoration: none;
    border: 2px solid rgba(255,255,255,0.4); transition: all .3s;
  }
  .rp-btn-outline:hover { background: rgba(255,255,255,0.1); border-color: #fff; color: #fff; }
`;

const PASOS = [
  {
    icon: "pi pi-key",
    titulo: "Credencial RNDC",
    desc: "Su empresa registra una sola vez su usuario del Ministerio, guardado cifrado.",
    detalle: "Verificada ante el RNDC",
  },
  {
    icon: "pi pi-file-edit",
    titulo: "Remesa",
    desc: "Cree la remesa del viaje con placa y conductor elegidos de su flota.",
    detalle: "Radicada en segundos",
  },
  {
    icon: "pi pi-file-check",
    titulo: "Manifiesto",
    desc: "Expida el manifiesto de carga y gestione la aceptación electrónica del conductor.",
    detalle: "Aceptación electrónica",
  },
  {
    icon: "pi pi-flag",
    titulo: "Cumplido",
    desc: "Al terminar el viaje reporte el cumplido de remesa y manifiesto con un clic.",
    detalle: "Viaje cerrado ante el RNDC",
  },
];

export default function RndcPromo() {
  const [activo, setActivo] = useState(0);
  const [visible, setVisible] = useState(false);
  const [pausado, setPausado] = useState(false);
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
    if (!visible || pausado) return;
    const t = setInterval(() => setActivo((a) => (a + 1) % PASOS.length), 3200);
    return () => clearInterval(t);
  }, [visible, pausado]);

  // Progreso de la línea conectora según el paso activo
  const progreso = (activo / (PASOS.length - 1)) * 100;

  return (
    <section
      ref={bandRef}
      className={`rp-band ${visible ? "rp-visible" : ""}`}
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
    >
      <style>{styles}</style>
      <div className="container">
        <div className="rp-head rp-reveal">
          <div className="rp-badge"><i className="pi pi-truck" /> Transporte de carga</div>
          <h2 className="rp-title">
            Sus trámites ante el <span>RNDC</span>, de principio a fin
          </h2>
          <p className="rp-lead">
            Expedición de remesas y manifiestos, aceptación electrónica y cumplidos ante el
            Registro Nacional de Despachos de Carga del Ministerio de Transporte, integrados
            con el GPS de su flota. Así de simple es el ciclo completo:
          </p>
        </div>

        <div className="rp-flow rp-reveal rp-d1">
          <div className="rp-steps">
            <div className="rp-track"><i style={{ width: `${progreso}%` }} /></div>
            {PASOS.map((p, i) => (
              <div
                key={p.titulo}
                className={`rp-step ${i === activo ? "on" : ""}`}
                onClick={() => setActivo(i)}
              >
                <span className="rp-step-num">{String(i + 1).padStart(2, "0")}</span>
                <div className="rp-step-ic"><i className={p.icon} /></div>
                <b>{p.titulo}</b>
                <small>{p.desc}</small>
                <div className="rp-step-detail">
                  <span className="dot" /> {p.detalle}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rp-chips rp-reveal rp-d2">
          <span className="rp-chip"><i className="pi pi-bolt" /> Radicación en segundos</span>
          <span className="rp-chip"><i className="pi pi-shield" /> Credenciales cifradas</span>
          <span className="rp-chip"><i className="pi pi-map-marker" /> Monitoreo GPS del viaje</span>
          <span className="rp-chip"><i className="pi pi-wallet" /> Pago solo por lo que usa</span>
        </div>

        <div className="rp-ctas rp-reveal rp-d3">
          <NavLink to="/rndc" className="rp-btn-primary">
            <i className="pi pi-sign-in" /> Ingresar al módulo RNDC
          </NavLink>
          <NavLink to="/contacto" className="rp-btn-outline">
            <i className="pi pi-comments" /> Solicitar el servicio
          </NavLink>
        </div>
      </div>
    </section>
  );
}
