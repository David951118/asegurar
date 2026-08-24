import { NavLink } from "react-router-dom";
import PromoBand from "./PromoBand";

const PESV_URL = "https://pesv.asegurar.com.co";

/**
 * Sección promocional del módulo PESV dentro del Portafolio de Servicios.
 */

const THEME = {
  grad: "linear-gradient(135deg, #0a2d6e 0%, #114a9e 55%, #1565c0 100%)",
  accent: "#ffd54f",
  accentRgb: "255,213,79",
  onAccent: "#0a2d6e",
  mockBg: "#0d1b34",
};

function ScreenPreop() {
  return (
    <>
      <h4 className="pb-screen-title pb-anim-in"><i className="pi pi-check-square pb-accent-ic" /> Preoperacional — Vehículo WHK-521</h4>
      <p className="pb-screen-sub pb-anim-in">Hoy, antes del despacho · Conductor: J. Ramírez</p>
      <div className="pb-row pb-anim-in pb-d1">
        <span className="pb-check"><i className="pi pi-check" /></span>
        <div className="pb-row-txt"><b>Frenos y dirección</b><small>Sin novedad</small></div>
      </div>
      <div className="pb-row pb-anim-in pb-d2">
        <span className="pb-check"><i className="pi pi-check" /></span>
        <div className="pb-row-txt"><b>Luces y llantas</b><small>Sin novedad</small></div>
      </div>
      <div className="pb-row pb-anim-in pb-d3">
        <span className="pb-check warn"><i className="pi pi-exclamation-triangle" /></span>
        <div className="pb-row-txt"><b>Nivel de refrigerante bajo</b><small>Novedad reportada con foto</small></div>
        <span className="pb-tag warn">EN CORRECCIÓN</span>
      </div>
      <div className="pb-row pb-anim-in pb-d4">
        <span className="pb-check"><i className="pi pi-verified" /></span>
        <div className="pb-row-txt"><b>Inspección aprobada</b><small>Vehículo autorizado para operar</small></div>
        <span className="pb-tag ok">APROBADA</span>
      </div>
    </>
  );
}

function ScreenMant() {
  return (
    <>
      <h4 className="pb-screen-title pb-anim-in"><i className="pi pi-wrench pb-accent-ic" /> Mantenimiento preventivo</h4>
      <p className="pb-screen-sub pb-anim-in">Kilometraje tomado del GPS en tiempo real</p>
      <div className="pb-progress pb-anim-in pb-d1">
        <label><span>Cambio de aceite · WHK-521</span><span>8.200 / 10.000 km</span></label>
        <div className="pb-progress-track"><span className="pb-progress-fill" style={{ width: "82%", background: "#ffa726" }} /></div>
      </div>
      <div className="pb-progress pb-anim-in pb-d2">
        <label><span>Revisión de frenos · TQR-309</span><span>3.100 / 12.000 km</span></label>
        <div className="pb-progress-track"><span className="pb-progress-fill" style={{ width: "26%", background: "#66bb6a" }} /></div>
      </div>
      <div className="pb-row pb-anim-in pb-d3">
        <span className="pb-check bad"><i className="pi pi-bell" /></span>
        <div className="pb-row-txt"><b>Alerta: sincronización correa</b><small>GHT-112 superó el kilometraje objetivo</small></div>
        <span className="pb-tag bad">CREAR OT</span>
      </div>
      <div className="pb-row pb-anim-in pb-d4">
        <span className="pb-check"><i className="pi pi-check" /></span>
        <div className="pb-row-txt"><b>Orden de trabajo #148 cerrada</b><small>Taller autorizado · factura adjunta</small></div>
        <span className="pb-tag ok">COMPLETADA</span>
      </div>
    </>
  );
}

function ScreenDocs() {
  return (
    <>
      <h4 className="pb-screen-title pb-anim-in"><i className="pi pi-folder-open pb-accent-ic" /> Documentos de flota y conductores</h4>
      <p className="pb-screen-sub pb-anim-in">Alertas automáticas antes del vencimiento</p>
      <div className="pb-row pb-anim-in pb-d1">
        <span className="pb-check"><i className="pi pi-file" /></span>
        <div className="pb-row-txt"><b>SOAT · WHK-521</b><small>Vence en 8 meses</small></div>
        <span className="pb-tag ok">VIGENTE</span>
      </div>
      <div className="pb-row pb-anim-in pb-d2">
        <span className="pb-check warn"><i className="pi pi-file" /></span>
        <div className="pb-row-txt"><b>Tecnomecánica · TQR-309</b><small>Vence en 15 días</small></div>
        <span className="pb-tag warn">POR VENCER</span>
      </div>
      <div className="pb-row pb-anim-in pb-d3">
        <span className="pb-check"><i className="pi pi-id-card" /></span>
        <div className="pb-row-txt"><b>Licencia C2 · J. Ramírez</b><small>Vence en 2 años</small></div>
        <span className="pb-tag ok">VIGENTE</span>
      </div>
      <div className="pb-row pb-anim-in pb-d4">
        <span className="pb-check"><i className="pi pi-cloud-upload" /></span>
        <div className="pb-row-txt"><b>Carga centralizada</b><small>Historial y soportes siempre disponibles</small></div>
      </div>
    </>
  );
}

function ScreenKpis() {
  return (
    <>
      <h4 className="pb-screen-title pb-anim-in"><i className="pi pi-chart-bar pb-accent-ic" /> Indicadores del plan PESV</h4>
      <p className="pb-screen-sub pb-anim-in">Resumen del mes · exportable en PDF y Excel</p>
      <div className="pb-kpis pb-anim-in pb-d1">
        <div className="pb-kpi"><b>98%</b><small>Preop. a tiempo</small></div>
        <div className="pb-kpi"><b>12</b><small>OT cerradas</small></div>
        <div className="pb-kpi"><b>0</b><small>Docs vencidos</small></div>
      </div>
      <div className="pb-progress pb-anim-in pb-d2">
        <label><span>Cumplimiento preoperacionales</span><span>98%</span></label>
        <div className="pb-progress-track"><span className="pb-progress-fill" style={{ width: "98%", background: "#66bb6a" }} /></div>
      </div>
      <div className="pb-progress pb-anim-in pb-d3">
        <label><span>Plan de mantenimiento ejecutado</span><span>87%</span></label>
        <div className="pb-progress-track"><span className="pb-progress-fill" style={{ width: "87%", background: "#ffd54f" }} /></div>
      </div>
      <div className="pb-progress pb-anim-in pb-d4">
        <label><span>Documentación vigente</span><span>100%</span></label>
        <div className="pb-progress-track"><span className="pb-progress-fill" style={{ width: "100%", background: "#66bb6a" }} /></div>
      </div>
    </>
  );
}

const FEATURES = [
  {
    id: "preop",
    icon: "pi pi-check-square",
    titulo: "Inspecciones preoperacionales",
    resumen: "El conductor la diligencia desde el celular antes de cada salida; novedades y aprobación en línea.",
    Screen: ScreenPreop,
  },
  {
    id: "mant",
    icon: "pi pi-wrench",
    titulo: "Mantenimiento de la flota",
    resumen: "Planes preventivos, órdenes de trabajo y alertas automáticas por kilometraje GPS.",
    Screen: ScreenMant,
  },
  {
    id: "docs",
    icon: "pi pi-folder-open",
    titulo: "Documentación al día",
    resumen: "SOAT, tecnomecánica y licencias centralizados, con alertas antes del vencimiento.",
    Screen: ScreenDocs,
  },
  {
    id: "kpis",
    icon: "pi pi-chart-bar",
    titulo: "Indicadores y reportes PESV",
    resumen: "Cumplimiento del plan en tiempo real y reportes descargables en PDF y Excel.",
    Screen: ScreenKpis,
  },
];

export default function PesvPromo() {
  return (
    <PromoBand
      theme={THEME}
      badgeIcon="pi pi-shield"
      badgeText="Plataforma digital para clientes"
      title={<>Gestione su <span>Plan Estratégico de Seguridad Vial</span> en línea</>}
      lead="Nuestros clientes cuentan con el módulo PESV: una plataforma donde la empresa administra sus inspecciones, mantenimiento, documentos e indicadores de seguridad vial, integrada con el GPS de su flota."
      features={FEATURES}
      mockUrl="pesv.asegurar.com.co"
      sideIcons={["pi pi-home", "pi pi-check-square", "pi pi-wrench", "pi pi-folder-open", "pi pi-chart-bar"]}
      ctas={
        <>
          <a href={PESV_URL} target="_blank" rel="noopener noreferrer" className="pb-btn-primary">
            <i className="pi pi-external-link" /> Ingresar al módulo PESV
          </a>
          <NavLink to="/pesv" className="pb-btn-outline">
            <i className="pi pi-info-circle" /> Conocer más
          </NavLink>
        </>
      }
    />
  );
}
