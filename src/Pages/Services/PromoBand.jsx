import { useEffect, useRef, useState } from "react";

/**
 * Banda promocional genérica: texto + lista de funcionalidades a un lado y
 * mockup animado que rota entre pantallas al otro. Los colores se parametrizan
 * con variables CSS (--pb-*) para reutilizarla en PESV, RNDC y Cellvi.
 */

const styles = `
  .pb-band {
    background: var(--pb-grad);
    padding: 80px 0;
    position: relative;
    overflow: hidden;
  }
  .pb-band::before {
    content: "";
    position: absolute;
    left: -140px;
    bottom: -140px;
    width: 420px;
    height: 420px;
    border-radius: 50%;
    background: rgba(255,255,255,0.04);
    border: 2px solid rgba(255,255,255,0.06);
  }
  .pb-band::after {
    content: "";
    position: absolute;
    right: -100px;
    top: -100px;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    background: rgba(var(--pb-accent-rgb),0.05);
  }

  .pb-inner {
    display: grid;
    grid-template-columns: 1fr 1.05fr;
    gap: 56px;
    align-items: center;
    position: relative;
    z-index: 2;
  }
  .pb-band.pb-flip .pb-inner .pb-col-text { order: 2; }
  .pb-band.pb-flip .pb-inner .pb-col-mock { order: 1; }
  @media (max-width: 950px) {
    .pb-inner { grid-template-columns: 1fr; gap: 44px; }
    .pb-band.pb-flip .pb-inner .pb-col-text { order: 1; }
    .pb-band.pb-flip .pb-inner .pb-col-mock { order: 2; }
  }

  /* Reveal on scroll */
  .pb-reveal { opacity: 0; transform: translateY(34px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .pb-band.pb-visible .pb-reveal { opacity: 1; transform: translateY(0); }
  .pb-band.pb-visible .pb-reveal-delay { transition-delay: 0.18s; }

  /* ── Columna de texto ── */
  .pb-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(var(--pb-accent-rgb),0.14);
    border: 1px solid rgba(var(--pb-accent-rgb),0.3);
    border-radius: 999px;
    padding: 6px 18px;
    font-size: 0.76rem;
    font-weight: 800;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: var(--pb-accent);
    margin-bottom: 18px;
  }
  .pb-title {
    color: #fff;
    font-size: clamp(1.7rem, 3.2vw, 2.4rem);
    font-weight: 900;
    line-height: 1.15;
    margin: 0 0 14px;
  }
  .pb-title span { color: var(--pb-accent); }
  .pb-lead {
    color: rgba(255,255,255,0.78);
    font-size: 1rem;
    line-height: 1.7;
    margin: 0 0 26px;
    max-width: 480px;
  }

  .pb-feats { display: flex; flex-direction: column; gap: 10px; margin-bottom: 30px; }
  .pb-feat {
    display: flex;
    align-items: center;
    gap: 14px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 12px 16px;
    cursor: pointer;
    text-align: left;
    width: 100%;
    font-family: inherit;
    transition: all 0.25s;
  }
  .pb-feat:hover { background: rgba(255,255,255,0.11); }
  .pb-feat.active {
    background: rgba(255,255,255,0.13);
    border-color: rgba(var(--pb-accent-rgb),0.55);
    box-shadow: 0 6px 22px rgba(0,0,0,0.18);
  }
  .pb-feat-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: rgba(var(--pb-accent-rgb),0.16);
    color: var(--pb-accent);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.05rem;
    flex-shrink: 0;
    transition: all 0.25s;
  }
  .pb-feat.active .pb-feat-icon { background: var(--pb-accent); color: var(--pb-on-accent); }
  .pb-feat-txt b {
    display: block;
    color: #fff;
    font-size: 0.92rem;
    font-weight: 700;
    margin-bottom: 2px;
  }
  .pb-feat-txt small {
    color: rgba(255,255,255,0.62);
    font-size: 0.8rem;
    line-height: 1.45;
    display: block;
  }
  .pb-feat-bar {
    height: 3px;
    border-radius: 2px;
    background: rgba(255,255,255,0.12);
    margin-top: 8px;
    overflow: hidden;
    display: none;
  }
  .pb-feat.active .pb-feat-bar { display: block; }
  .pb-feat-bar i {
    display: block;
    height: 100%;
    background: var(--pb-accent);
    width: 0;
    animation: pbBar 5s linear forwards;
  }
  @keyframes pbBar { from { width: 0; } to { width: 100%; } }

  .pb-ctas { display: flex; gap: 14px; flex-wrap: wrap; }
  .pb-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: var(--pb-accent);
    color: var(--pb-on-accent);
    font-weight: 900;
    padding: 15px 30px;
    border-radius: 50px;
    font-size: 0.95rem;
    text-decoration: none;
    transition: all 0.3s;
    box-shadow: 0 8px 28px rgba(var(--pb-accent-rgb),0.28);
  }
  .pb-btn-primary:hover {
    filter: brightness(0.94);
    color: var(--pb-on-accent);
    transform: translateY(-3px);
    box-shadow: 0 12px 36px rgba(var(--pb-accent-rgb),0.4);
  }
  .pb-btn-outline {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    color: #fff;
    font-weight: 700;
    padding: 15px 30px;
    border-radius: 50px;
    font-size: 0.95rem;
    text-decoration: none;
    border: 2px solid rgba(255,255,255,0.4);
    transition: all 0.3s;
  }
  .pb-btn-outline:hover { background: rgba(255,255,255,0.1); border-color: #fff; color: #fff; }

  /* ── Mockup ── */
  .pb-mock {
    background: var(--pb-mock-bg);
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 24px 70px rgba(0,0,0,0.45);
    transform: perspective(1200px) rotateY(-4deg) rotateX(1.5deg);
    transition: transform 0.4s ease;
  }
  .pb-band.pb-flip .pb-mock { transform: perspective(1200px) rotateY(4deg) rotateX(1.5deg); }
  .pb-mock:hover, .pb-band.pb-flip .pb-mock:hover { transform: perspective(1200px) rotateY(0deg) rotateX(0deg); }
  .pb-mock-top {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.06);
    border-bottom: 1px solid rgba(255,255,255,0.08);
    padding: 10px 14px;
  }
  .pb-dot { width: 10px; height: 10px; border-radius: 50%; }
  .pb-mock-url {
    flex: 1;
    background: rgba(255,255,255,0.08);
    border-radius: 6px;
    color: rgba(255,255,255,0.55);
    font-size: 0.72rem;
    padding: 4px 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-left: 8px;
  }
  .pb-mock-url i { font-size: 0.65rem; color: #66bb6a; }

  .pb-mock-body { display: flex; min-height: 320px; }
  .pb-mock-side {
    width: 52px;
    background: rgba(255,255,255,0.04);
    border-right: 1px solid rgba(255,255,255,0.07);
    padding: 14px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
  }
  .pb-side-ic {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255,255,255,0.45);
    font-size: 0.8rem;
  }
  .pb-side-ic.on { background: rgba(var(--pb-accent-rgb),0.18); color: var(--pb-accent); }

  .pb-screen { flex: 1; padding: 18px 20px; }
  .pb-screen-title {
    color: #fff;
    font-size: 0.9rem;
    font-weight: 800;
    margin: 0 0 4px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .pb-screen-title .pb-accent-ic { color: var(--pb-accent); }
  .pb-screen-sub { color: rgba(255,255,255,0.45); font-size: 0.72rem; margin: 0 0 16px; }

  .pb-anim-in { animation: pbFadeUp 0.45s ease both; }
  .pb-d1 { animation-delay: 0.12s; }
  .pb-d2 { animation-delay: 0.28s; }
  .pb-d3 { animation-delay: 0.44s; }
  .pb-d4 { animation-delay: 0.6s; }
  @keyframes pbFadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .pb-row {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 10px;
    padding: 10px 14px;
    margin-bottom: 9px;
  }
  .pb-row-txt { flex: 1; }
  .pb-row-txt b { display: block; color: rgba(255,255,255,0.9); font-size: 0.78rem; font-weight: 700; }
  .pb-row-txt small { color: rgba(255,255,255,0.42); font-size: 0.68rem; }
  .pb-check {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: rgba(102,187,106,0.18);
    color: #66bb6a;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.68rem;
    flex-shrink: 0;
  }
  .pb-check.warn { background: rgba(255,167,38,0.18); color: #ffa726; }
  .pb-check.bad { background: rgba(239,83,80,0.18); color: #ef5350; }
  .pb-tag {
    font-size: 0.62rem;
    font-weight: 800;
    padding: 3px 10px;
    border-radius: 999px;
    letter-spacing: 0.5px;
  }
  .pb-tag.ok { background: rgba(102,187,106,0.16); color: #81c784; }
  .pb-tag.warn { background: rgba(255,167,38,0.16); color: #ffb74d; }
  .pb-tag.bad { background: rgba(239,83,80,0.16); color: #e57373; }

  .pb-kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 14px; }
  .pb-kpi {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 10px;
    padding: 12px 10px;
    text-align: center;
  }
  .pb-kpi b { display: block; color: var(--pb-accent); font-size: 1.15rem; font-weight: 900; }
  .pb-kpi small { color: rgba(255,255,255,0.45); font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.5px; }

  .pb-progress { margin-bottom: 12px; }
  .pb-progress label {
    display: flex;
    justify-content: space-between;
    color: rgba(255,255,255,0.6);
    font-size: 0.7rem;
    margin-bottom: 5px;
  }
  .pb-progress-track {
    height: 8px;
    border-radius: 5px;
    background: rgba(255,255,255,0.08);
    overflow: hidden;
  }
  .pb-progress-fill {
    display: block;
    height: 100%;
    border-radius: 5px;
    transform-origin: left;
    transform: scaleX(0);
    animation: pbGrow 0.9s ease forwards;
  }
  @keyframes pbGrow { to { transform: scaleX(1); } }

  @media (max-width: 950px) {
    .pb-mock, .pb-band.pb-flip .pb-mock { transform: none; }
  }
  @media (max-width: 480px) {
    .pb-mock-side { display: none; }
    .pb-kpis { grid-template-columns: repeat(3, 1fr); gap: 6px; }
  }
`;

export default function PromoBand({
  theme,       // { grad, accent, accentRgb, onAccent, mockBg }
  badgeIcon,
  badgeText,
  title,       // JSX (usa <span> para la parte resaltada)
  lead,
  features,    // [{ id, icon, titulo, resumen, Screen }]
  ctas,        // JSX de los botones (usar clases pb-btn-primary / pb-btn-outline)
  mockUrl,
  sideIcons,
  flip = false,
}) {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const bandRef = useRef(null);

  // Reveal al hacer scroll
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 },
    );
    if (bandRef.current) obs.observe(bandRef.current);
    return () => obs.disconnect();
  }, []);

  // Rotación automática de pantallas (se pausa al pasar el mouse)
  useEffect(() => {
    if (!visible || paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % features.length), 5000);
    return () => clearInterval(t);
  }, [visible, paused, features.length]);

  const feature = features[active];
  const Screen = feature.Screen;

  const cssVars = {
    "--pb-grad": theme.grad,
    "--pb-accent": theme.accent,
    "--pb-accent-rgb": theme.accentRgb,
    "--pb-on-accent": theme.onAccent,
    "--pb-mock-bg": theme.mockBg,
  };

  return (
    <section
      ref={bandRef}
      className={`pb-band ${visible ? "pb-visible" : ""} ${flip ? "pb-flip" : ""}`}
      style={cssVars}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <style>{styles}</style>
      <div className="container">
        <div className="pb-inner">
          {/* Texto + funcionalidades */}
          <div className="pb-reveal pb-col-text">
            <div className="pb-badge">
              <i className={badgeIcon} /> {badgeText}
            </div>
            <h2 className="pb-title">{title}</h2>
            <p className="pb-lead">{lead}</p>

            <div className="pb-feats">
              {features.map((f, i) => (
                <button
                  key={f.id}
                  className={`pb-feat ${i === active ? "active" : ""}`}
                  onClick={() => setActive(i)}
                >
                  <div className="pb-feat-icon"><i className={f.icon} /></div>
                  <div className="pb-feat-txt" style={{ flex: 1 }}>
                    <b>{f.titulo}</b>
                    <small>{f.resumen}</small>
                    <div className="pb-feat-bar">
                      {i === active && !paused && <i key={active} />}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="pb-ctas">{ctas}</div>
          </div>

          {/* Mockup animado */}
          <div className="pb-reveal pb-reveal-delay pb-col-mock">
            <div className="pb-mock">
              <div className="pb-mock-top">
                <span className="pb-dot" style={{ background: "#ef5350" }} />
                <span className="pb-dot" style={{ background: "#ffca28" }} />
                <span className="pb-dot" style={{ background: "#66bb6a" }} />
                <div className="pb-mock-url"><i className="pi pi-lock" /> {mockUrl}</div>
              </div>
              <div className="pb-mock-body">
                <div className="pb-mock-side">
                  {sideIcons.map((ic, i) => (
                    <div key={ic} className={`pb-side-ic ${i === active + 1 ? "on" : ""}`}>
                      <i className={ic} />
                    </div>
                  ))}
                </div>
                <div className="pb-screen" key={feature.id}>
                  <Screen />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
