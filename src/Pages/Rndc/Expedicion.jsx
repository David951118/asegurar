import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { InputSwitch } from "primereact/inputswitch";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import RndcService from "../../Services/rndcApi";
import { useAuth } from "../../Context/AuthContext";

/**
 * EXPEDICIÓN DE MANIFIESTOS RNDC (rol empresa de transporte)
 * Acceso exclusivo CLIENTE_ADMIN / ADMIN — el backend valida de nuevo (403).
 */

const styles = `
  .exp-container {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    min-height: 100vh;
    padding: 20px;
    background: linear-gradient(13deg, #0c508f 0%, #ffffff 100%);
  }
  .exp-wrapper { max-width: 1400px; margin: 0 auto; }
  .exp-header {
    background: white; padding: 20px 30px; border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 20px;
    display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;
  }
  .exp-header h1 { color: #094aa0; font-size: 26px; margin: 0; }
  .exp-header .sub { color: #666; font-size: 13px; margin-top: 4px; }
  .exp-tabs { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
  .exp-tab {
    background: white; padding: 12px 24px; border-radius: 8px; cursor: pointer;
    font-weight: 500; transition: all 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    border: none; font-size: 14px;
  }
  .exp-tab:hover { background: #f0f0f0; }
  .exp-tab.active { background: #094aa0; color: white; }
  .exp-card {
    background: white; padding: 25px; border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1); min-height: 300px; margin-bottom: 20px;
  }
  .exp-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 14px; }
  .exp-field { display: flex; flex-direction: column; gap: 4px; }
  .exp-field label { font-size: 12px; color: #555; font-weight: 600; }
  .exp-field small { color: #999; font-size: 11px; }
  .exp-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 20px; }
  .exp-stat { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
  .exp-stat h3 { color: #666; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px; }
  .exp-stat .valor { font-size: 32px; font-weight: bold; color: #094aa0; }
  .exp-aviso {
    background: #fff8e1; border: 1px solid #ffe082; border-radius: 8px;
    padding: 12px 16px; font-size: 13px; color: #795548; margin-bottom: 16px;
  }
  .exp-ambiente { font-weight: 700; }
  .exp-restringido { text-align: center; padding: 60px 20px; background: white; border-radius: 10px; }
`;

const ESTADO_SEVERITY = {
  BORRADOR: "secondary",
  RADICADA: "success",
  RADICADO: "success",
  ACEPTADO: "info",
  CUMPLIDA: "info",
  CUMPLIDO: "info",
  ANULADA: "danger",
  ANULADO: "danger",
};

// Campos comunes del diccionario RNDC (guía oficial v4/2023)
const CAMPOS_REMESA = [
  ["CODOPERACIONTRANSPORTE", "Cód. operación transporte", "Ej: 1 (General)"],
  ["CODNATURALEZACARGA", "Naturaleza de la carga", "Ej: G (General)"],
  ["CANTIDADCARGADA", "Cantidad cargada", "Ej: 22000"],
  ["UNIDADMEDIDACAPACIDAD", "Unidad de medida", "1=Kilogramos"],
  ["CODTIPOEMPAQUE", "Tipo de empaque", "Ej: 10"],
  ["MERCANCIAREMESA", "Cód. mercancía", "Ej: 000201"],
  ["DESCRIPCIONCORTAPRODUCTO", "Descripción del producto", "Ej: TRIGO BLANCO"],
  ["CODTIPOIDREMITENTE", "Tipo ID remitente", "C=Cédula, N=NIT"],
  ["NUMIDREMITENTE", "Número ID remitente", ""],
  ["CODSEDEREMITENTE", "Sede remitente", ""],
  ["CODTIPOIDDESTINATARIO", "Tipo ID destinatario", "C=Cédula, N=NIT"],
  ["NUMIDDESTINATARIO", "Número ID destinatario", ""],
  ["CODSEDEDESTINATARIO", "Sede destinatario", ""],
  ["DUENOPOLIZA", "Dueño de la póliza", "E=Empresa"],
  ["NUMPOLIZATRANSPORTE", "Número de póliza", ""],
  ["FECHAVENCIMIENTOPOLIZACARGA", "Vencimiento póliza", "DD/MM/AAAA"],
  ["COMPANIASEGURO", "NIT aseguradora", ""],
  ["HORASPACTOCARGA", "Horas pacto cargue", ""],
  ["MINUTOSPACTOCARGA", "Minutos pacto cargue", ""],
  ["HORASPACTODESCARGUE", "Horas pacto descargue", ""],
  ["MINUTOSPACTODESCARGUE", "Minutos pacto descargue", ""],
];

const CAMPOS_MANIFIESTO = [
  ["CODOPERACIONTRANSPORTE", "Cód. operación transporte", "Ej: G (General)"],
  ["FECHAEXPEDICIONMANIFIESTO", "Fecha expedición", "DD/MM/AAAA"],
  ["CODMUNICIPIOORIGENMANIFIESTO", "Municipio origen", "Cód. DANE, ej: 76001000"],
  ["CODMUNICIPIODESTINOMANIFIESTO", "Municipio destino", "Cód. DANE, ej: 11001000"],
  ["CODIDTITULARMANIFIESTO", "Tipo ID titular", "C=Cédula, N=NIT"],
  ["NUMIDTITULARMANIFIESTO", "Número ID titular", ""],
  ["NUMPLACA", "Placa del vehículo", "Ej: WZH111"],
  ["NUMPLACAREMOLQUE", "Placa remolque (opcional)", ""],
  ["CODIDCONDUCTOR", "Tipo ID conductor", "C=Cédula"],
  ["NUMIDCONDUCTOR", "Número ID conductor", ""],
  ["VALORFLETEPACTADOVIAJE", "Valor flete pactado", "Ej: 3250000"],
  ["RETENCIONICAMANIFIESTOCARGA", "Retención ICA (x mil)", "Ej: 3"],
  ["VALORANTICIPOMANIFIESTO", "Valor anticipo", "Ej: 1000000"],
  ["CODMUNICIPIOPAGOSALDO", "Municipio pago saldo", "Cód. DANE"],
  ["FECHAPAGOSALDOMANIFIESTO", "Fecha pago saldo", "DD/MM/AAAA"],
  ["CODRESPONSABLEPAGOCARGUE", "Responsable pago cargue", "E=Empresa"],
  ["CODRESPONSABLEPAGODESCARGUE", "Responsable pago descargue", "E=Empresa"],
  ["OBSERVACIONES", "Observaciones", ""],
];

const CAMPOS_TERCERO = [
  ["CODTIPOIDTERCERO", "Tipo ID", "C=Cédula, N=NIT"],
  ["NUMIDTERCERO", "Número ID", ""],
  ["NOMIDTERCERO", "Nombres / Razón social", ""],
  ["PRIMERAPELLIDOIDTERCERO", "Primer apellido", ""],
  ["SEGUNDOAPELLIDOIDTERCERO", "Segundo apellido", ""],
  ["NUMTELEFONOCONTACTO", "Teléfono", ""],
  ["NOMENCLATURADIRECCION", "Dirección", ""],
  ["CODMUNICIPIORNDC", "Municipio (cód. DANE)", "Ej: 11001000"],
  ["NUMLICENCIACONDUCCION", "Licencia conducción (si es conductor)", ""],
  ["CODCATEGORIALICENCIACONDUCCION", "Categoría licencia", "Ej: C2"],
  ["FECHAVENCIMIENTOLICENCIA", "Vencimiento licencia", "DD/MM/AAAA"],
];

const CAMPOS_VEHICULO = [
  ["NUMPLACA", "Placa", ""],
  ["CODCONFIGURACIONUNIDADCARGA", "Configuración unidad de carga", "Ej: 55"],
  ["CODMARCAVEHICULOCARGA", "Cód. marca", ""],
  ["CODLINEAVEHICULOCARGA", "Cód. línea", ""],
  ["ANOFABRICACIONVEHICULOCARGA", "Año de fabricación", ""],
  ["CODTIPOCOMBUSTIBLE", "Tipo combustible", "1=ACPM"],
  ["PESOVEHICULOVACIO", "Peso vacío (kg)", ""],
  ["CODTIPOCARROCERIA", "Tipo carrocería", ""],
  ["CODTIPOIDPROPIETARIO", "Tipo ID propietario", "C / N"],
  ["NUMIDPROPIETARIO", "Número ID propietario", ""],
  ["CODTIPOIDTENEDOR", "Tipo ID tenedor", "C / N"],
  ["NUMIDTENEDOR", "Número ID tenedor", ""],
  ["NUMSEGUROSOAT", "Número SOAT", ""],
  ["FECHAVENCIMIENTOSOAT", "Vencimiento SOAT", "DD/MM/AAAA"],
  ["NUMNITASEGURADORASOAT", "NIT aseguradora SOAT", ""],
];

/** Formulario genérico de variables del diccionario RNDC */
function FormVariables({ campos, valores, onChange }) {
  return (
    <div className="exp-grid">
      {campos.map(([clave, etiqueta, ayuda]) => (
        <div className="exp-field" key={clave}>
          <label htmlFor={`f-${clave}`}>{etiqueta}</label>
          <InputText
            id={`f-${clave}`}
            value={valores[clave] || ""}
            onChange={(e) => onChange(clave, e.target.value)}
            placeholder={ayuda}
          />
          {ayuda ? <small>{clave}</small> : <small>{clave}</small>}
        </div>
      ))}
    </div>
  );
}

export default function ExpedicionRndc() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const toast = useRef(null);

  const [userData, setUserData] = useState({ username: "", roles: [], persona: "" });
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("rndc_user") || "{}");
    setUserData({
      username: stored.username || "",
      roles: stored.roles || [],
      persona: stored.persona || stored.username || "",
    });
    if (!localStorage.getItem("rndc_token")) navigate("/rndc");
  }, [navigate]);

  const roles = userData.roles || [];
  const puedeExpedir =
    roles.includes("ROLE_ADMIN") ||
    roles.includes("ROLE_SUPER_ADMIN") ||
    roles.includes("ROLE_CLIENTE_ADMIN");

  const [activeTab, setActiveTab] = useState("manifiestos");
  const [loading, setLoading] = useState(false);

  // Credencial
  const [credencial, setCredencial] = useState(null);
  const [formCred, setFormCred] = useState({
    nitEmpresaTransporte: "",
    usuarioWS: "",
    password: "",
    modoPruebas: true,
  });
  const [verificando, setVerificando] = useState(false);

  // Remesas / Manifiestos
  const [remesas, setRemesas] = useState([]);
  const [manifiestos, setManifiestos] = useState([]);
  const [consumo, setConsumo] = useState(null);

  // Formularios
  const [showRemesa, setShowRemesa] = useState(false);
  const [consecutivoRemesa, setConsecutivoRemesa] = useState("");
  const [varsRemesa, setVarsRemesa] = useState({});

  const [showManifiesto, setShowManifiesto] = useState(false);
  const [numManifiesto, setNumManifiesto] = useState("");
  const [remesasSeleccionadas, setRemesasSeleccionadas] = useState([]);
  const [varsManifiesto, setVarsManifiesto] = useState({});
  const [aceptacionElectronica, setAceptacionElectronica] = useState("SI");

  const [showMaestro, setShowMaestro] = useState(null); // 'tercero' | 'vehiculo'
  const [varsMaestro, setVarsMaestro] = useState({});

  const [anulando, setAnulando] = useState(null); // {tipo, registro}
  const [motivoAnulacion, setMotivoAnulacion] = useState("");

  const notificar = (severity, summary, detail) =>
    toast.current?.show({ severity, summary, detail, life: 6000 });

  const cargarTodo = useCallback(async () => {
    setLoading(true);
    try {
      const [cred, rem, man, cons] = await Promise.all([
        RndcService.expedicion.getCredencial(),
        RndcService.expedicion.getRemesas(),
        RndcService.expedicion.getManifiestos(),
        RndcService.expedicion.getConsumo(),
      ]);
      setCredencial(cred.data);
      if (cred.data) {
        setFormCred((f) => ({
          ...f,
          nitEmpresaTransporte: cred.data.nitEmpresaTransporte || "",
          usuarioWS: cred.data.usuarioWS || "",
          modoPruebas: cred.data.modoPruebas !== false,
        }));
      }
      setRemesas(rem.data || []);
      setManifiestos(man.data || []);
      setConsumo(cons.data || null);
    } catch (e) {
      if (e.response?.status === 403) {
        // El backend confirma que este usuario no puede expedir
      } else {
        notificar("error", "Error", e.response?.data?.message || e.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (puedeExpedir) cargarTodo();
  }, [puedeExpedir, cargarTodo]);

  // ═══ Acciones ═══

  const guardarCredencial = async () => {
    if (!formCred.nitEmpresaTransporte || !formCred.usuarioWS || !formCred.password) {
      return notificar("warn", "Faltan datos", "NIT, usuario y contraseña son obligatorios");
    }
    try {
      const r = await RndcService.expedicion.guardarCredencial(formCred);
      notificar("success", "Credencial guardada", r.message);
      setFormCred((f) => ({ ...f, password: "" }));
      cargarTodo();
    } catch (e) {
      notificar("error", "Error", e.response?.data?.message || e.message);
    }
  };

  const verificarCredencial = async () => {
    setVerificando(true);
    try {
      const r = await RndcService.expedicion.verificarCredencial();
      notificar(
        r.success ? "success" : "error",
        r.success ? "Credencial válida" : "Credencial rechazada",
        r.data?.detalle,
      );
      cargarTodo();
    } catch (e) {
      notificar("error", "Error", e.response?.data?.message || e.message);
    } finally {
      setVerificando(false);
    }
  };

  const radicarRemesa = async () => {
    if (!consecutivoRemesa) return notificar("warn", "Falta", "Indique el consecutivo de la remesa");
    try {
      const r = await RndcService.expedicion.expedirRemesa(consecutivoRemesa, varsRemesa);
      notificar(r.success ? "success" : "error", r.success ? "Remesa radicada" : "RNDC rechazó la remesa", r.message);
      if (r.success) {
        setShowRemesa(false);
        setConsecutivoRemesa("");
        setVarsRemesa({});
      }
      cargarTodo();
    } catch (e) {
      notificar("error", "Error", e.response?.data?.message || e.message);
    }
  };

  const radicarManifiesto = async () => {
    if (!numManifiesto) return notificar("warn", "Falta", "Indique el consecutivo del manifiesto");
    if (!remesasSeleccionadas.length)
      return notificar("warn", "Falta", "Seleccione al menos una remesa radicada");
    try {
      const variables = { ...varsManifiesto, ACEPTACIONELECTRONICA: aceptacionElectronica };
      const r = await RndcService.expedicion.expedirManifiesto(
        numManifiesto,
        remesasSeleccionadas,
        variables,
      );
      notificar(r.success ? "success" : "error", r.success ? "Manifiesto radicado" : "RNDC rechazó el manifiesto", r.message);
      if (r.success) {
        setShowManifiesto(false);
        setNumManifiesto("");
        setRemesasSeleccionadas([]);
        setVarsManifiesto({});
      }
      cargarTodo();
    } catch (e) {
      notificar("error", "Error", e.response?.data?.message || e.message);
    }
  };

  const registrarMaestro = async () => {
    try {
      const r =
        showMaestro === "tercero"
          ? await RndcService.expedicion.registrarTercero(varsMaestro)
          : await RndcService.expedicion.registrarVehiculo(varsMaestro);
      notificar(r.success ? "success" : "error", r.success ? "Registrado en el RNDC" : "RNDC rechazó el registro", r.message);
      if (r.success) {
        setShowMaestro(null);
        setVarsMaestro({});
      }
    } catch (e) {
      notificar("error", "Error", e.response?.data?.message || e.message);
    }
  };

  const confirmarAnulacion = async () => {
    if ((motivoAnulacion || "").trim().length < 5)
      return notificar("warn", "Motivo requerido", "Escriba el motivo de la anulación (mínimo 5 caracteres)");
    try {
      const r =
        anulando.tipo === "remesa"
          ? await RndcService.expedicion.anularRemesa(anulando.registro._id, motivoAnulacion)
          : await RndcService.expedicion.anularManifiesto(anulando.registro._id, motivoAnulacion);
      notificar(r.success ? "success" : "error", r.success ? "Anulación radicada" : "RNDC rechazó la anulación", r.message);
      setAnulando(null);
      setMotivoAnulacion("");
      cargarTodo();
    } catch (e) {
      notificar("error", "Error", e.response?.data?.message || e.message);
    }
  };

  const consultarAceptacion = async (m) => {
    try {
      const r = await RndcService.expedicion.consultarAceptacion(m._id);
      notificar("info", "Aceptación electrónica", r.message);
      cargarTodo();
    } catch (e) {
      notificar("error", "Error", e.response?.data?.message || e.message);
    }
  };

  // ═══ Render ═══

  if (!puedeExpedir) {
    return (
      <div className="exp-container">
        <style>{styles}</style>
        <div className="exp-wrapper">
          <div className="exp-restringido">
            <i className="pi pi-lock" style={{ fontSize: 40, color: "#094aa0" }} />
            <h2 style={{ color: "#094aa0" }}>Acceso restringido</h2>
            <p style={{ color: "#666" }}>
              La expedición de manifiestos está disponible únicamente para el
              administrador de la empresa. Si necesita acceso, contacte a Asegurar Ltda.
            </p>
            <Button label="Volver al Dashboard" icon="pi pi-arrow-left" onClick={() => navigate("/rndc/dashboard")} />
          </div>
        </div>
      </div>
    );
  }

  const ambiente = credencial?.modoPruebas === false ? "PRODUCCIÓN" : "PRUEBAS";
  const remesasRadicadas = remesas.filter((r) => r.estado === "RADICADA");

  const tagEstado = (row) => (
    <Tag value={row.estado} severity={ESTADO_SEVERITY[row.estado] || "secondary"} />
  );

  return (
    <div className="exp-container">
      <style>{styles}</style>
      <Toast ref={toast} />
      <div className="exp-wrapper">
        <div className="exp-header">
          <div>
            <h1>Expedición de Manifiestos — RNDC</h1>
            <div className="sub">
              {userData.persona} · Ambiente:{" "}
              <span className="exp-ambiente" style={{ color: ambiente === "PRUEBAS" ? "#f57c00" : "#2e7d32" }}>
                {ambiente}
              </span>
              {consumo?.actual && (
                <> · Manifiestos este mes: <b>{consumo.actual.manifiestosExpedidos}</b></>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button label="Dashboard" icon="pi pi-chart-bar" outlined onClick={() => navigate("/rndc/dashboard")} />
            <Button label="Salir" icon="pi pi-sign-out" severity="secondary" outlined onClick={logout} />
          </div>
        </div>

        {!credencial && (
          <div className="exp-aviso">
            <b>Configure primero la credencial RNDC de su empresa</b> (pestaña
            Configuración): usuario del Web Service del RNDC y NIT de la empresa de
            transporte. Sin ella no es posible expedir.
          </div>
        )}

        <div className="exp-tabs">
          {[
            ["manifiestos", "Manifiestos"],
            ["remesas", "Remesas"],
            ["maestros", "Terceros y Vehículos"],
            ["consumo", "Consumo"],
            ["configuracion", "Configuración"],
          ].map(([id, label]) => (
            <button
              key={id}
              className={`exp-tab ${activeTab === id ? "active" : ""}`}
              onClick={() => setActiveTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ═══ MANIFIESTOS ═══ */}
        {activeTab === "manifiestos" && (
          <div className="exp-card">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15, flexWrap: "wrap", gap: 8 }}>
              <h3 style={{ margin: 0, color: "#094aa0" }}>Manifiestos expedidos</h3>
              <Button
                label="Expedir Manifiesto"
                icon="pi pi-plus"
                disabled={!credencial}
                onClick={() => setShowManifiesto(true)}
              />
            </div>
            <DataTable value={manifiestos} loading={loading} paginator rows={10} emptyMessage="Sin manifiestos aún" size="small" stripedRows>
              <Column field="numManifiestoCarga" header="Consecutivo" sortable />
              <Column body={tagEstado} header="Estado" />
              <Column field="ingresoid" header="Radicado RNDC" />
              <Column field="consecutivosRemesas" header="Remesas" body={(r) => (r.consecutivosRemesas || []).join(", ")} />
              <Column field="ambiente" header="Ambiente" />
              <Column
                field="fechaRadicacion"
                header="Radicado el"
                body={(r) => (r.fechaRadicacion ? new Date(r.fechaRadicacion).toLocaleString("es-CO") : "—")}
              />
              <Column field="ultimoError" header="Último error" body={(r) => r.ultimoError || "—"} />
              <Column
                header="Acciones"
                body={(r) => (
                  <div style={{ display: "flex", gap: 6 }}>
                    {r.estado === "RADICADO" && (
                      <Button size="small" text icon="pi pi-verified" tooltip="Consultar aceptación electrónica" onClick={() => consultarAceptacion(r)} />
                    )}
                    {["RADICADO", "ACEPTADO"].includes(r.estado) && (
                      <Button size="small" text severity="danger" icon="pi pi-ban" tooltip="Anular" onClick={() => setAnulando({ tipo: "manifiesto", registro: r })} />
                    )}
                  </div>
                )}
              />
            </DataTable>
          </div>
        )}

        {/* ═══ REMESAS ═══ */}
        {activeTab === "remesas" && (
          <div className="exp-card">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15, flexWrap: "wrap", gap: 8 }}>
              <h3 style={{ margin: 0, color: "#094aa0" }}>Remesas terrestres de carga</h3>
              <Button label="Expedir Remesa" icon="pi pi-plus" disabled={!credencial} onClick={() => setShowRemesa(true)} />
            </div>
            <DataTable value={remesas} loading={loading} paginator rows={10} emptyMessage="Sin remesas aún" size="small" stripedRows>
              <Column field="consecutivoRemesa" header="Consecutivo" sortable />
              <Column body={tagEstado} header="Estado" />
              <Column field="ingresoid" header="Radicado RNDC" />
              <Column field="ambiente" header="Ambiente" />
              <Column
                field="fechaRadicacion"
                header="Radicada el"
                body={(r) => (r.fechaRadicacion ? new Date(r.fechaRadicacion).toLocaleString("es-CO") : "—")}
              />
              <Column field="ultimoError" header="Último error" body={(r) => r.ultimoError || "—"} />
              <Column
                header="Acciones"
                body={(r) =>
                  r.estado === "RADICADA" ? (
                    <Button size="small" text severity="danger" icon="pi pi-ban" tooltip="Anular" onClick={() => setAnulando({ tipo: "remesa", registro: r })} />
                  ) : null
                }
              />
            </DataTable>
          </div>
        )}

        {/* ═══ MAESTROS ═══ */}
        {activeTab === "maestros" && (
          <div className="exp-card">
            <h3 style={{ marginTop: 0, color: "#094aa0" }}>Maestros del RNDC</h3>
            <p style={{ color: "#666", fontSize: 13 }}>
              Antes de expedir, los conductores, titulares, remitentes/destinatarios
              (terceros) y los vehículos deben existir en el RNDC. Solo se registran
              una vez, o cuando cambie su información.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Button label="Registrar Tercero" icon="pi pi-user-plus" disabled={!credencial} onClick={() => { setVarsMaestro({}); setShowMaestro("tercero"); }} />
              <Button label="Registrar Vehículo" icon="pi pi-truck" disabled={!credencial} onClick={() => { setVarsMaestro({}); setShowMaestro("vehiculo"); }} outlined />
            </div>
          </div>
        )}

        {/* ═══ CONSUMO ═══ */}
        {activeTab === "consumo" && (
          <>
            <div className="exp-stats">
              <div className="exp-stat">
                <h3>Manifiestos este mes</h3>
                <div className="valor">{consumo?.actual?.manifiestosExpedidos ?? 0}</div>
              </div>
              <div className="exp-stat">
                <h3>Remesas este mes</h3>
                <div className="valor">{consumo?.actual?.remesasExpedidas ?? 0}</div>
              </div>
              <div className="exp-stat">
                <h3>Anulaciones</h3>
                <div className="valor">{consumo?.actual?.anulaciones ?? 0}</div>
              </div>
              <div className="exp-stat">
                <h3>En ambiente de pruebas</h3>
                <div className="valor">
                  {(consumo?.actual?.manifiestosPruebas ?? 0) + (consumo?.actual?.remesasPruebas ?? 0)}
                </div>
              </div>
            </div>
            <div className="exp-card">
              <h3 style={{ marginTop: 0, color: "#094aa0" }}>Histórico mensual</h3>
              <DataTable value={consumo?.historico || []} size="small" stripedRows emptyMessage="Sin consumos registrados">
                <Column field="periodo" header="Periodo" sortable />
                <Column field="manifiestosExpedidos" header="Manifiestos" />
                <Column field="remesasExpedidas" header="Remesas" />
                <Column field="anulaciones" header="Anulaciones" />
                <Column field="manifiestosPruebas" header="Manif. pruebas" />
                <Column field="remesasPruebas" header="Rem. pruebas" />
              </DataTable>
            </div>
          </>
        )}

        {/* ═══ CONFIGURACIÓN ═══ */}
        {activeTab === "configuracion" && (
          <div className="exp-card">
            <h3 style={{ marginTop: 0, color: "#094aa0" }}>Credencial RNDC de la empresa</h3>
            <div className="exp-aviso">
              La expedición se hace <b>en nombre de su empresa de transporte</b> con su
              usuario del Web Service del RNDC. Recomendamos crear un{" "}
              <b>usuario dependiente</b> en rndc.mintransporte.gov.co dedicado a la
              plataforma. La contraseña se guarda <b>cifrada</b> y nunca se muestra.
            </div>
            <div className="exp-grid" style={{ maxWidth: 900 }}>
              <div className="exp-field">
                <label>NIT empresa de transporte (sin dígito de verificación)</label>
                <InputText
                  value={formCred.nitEmpresaTransporte}
                  onChange={(e) => setFormCred({ ...formCred, nitEmpresaTransporte: e.target.value.replace(/\D/g, "") })}
                  placeholder="Ej: 900301001"
                />
              </div>
              <div className="exp-field">
                <label>Usuario Web Service RNDC</label>
                <InputText
                  value={formCred.usuarioWS}
                  onChange={(e) => setFormCred({ ...formCred, usuarioWS: e.target.value })}
                  placeholder="usuario@empresa"
                />
              </div>
              <div className="exp-field">
                <label>Contraseña {credencial ? "(dejar en blanco solo si va a reemplazarla)" : ""}</label>
                <Password
                  value={formCred.password}
                  onChange={(e) => setFormCred({ ...formCred, password: e.target.value })}
                  feedback={false}
                  toggleMask
                  placeholder={credencial ? "••••••• (guardada cifrada)" : "Contraseña del WS"}
                />
              </div>
              <div className="exp-field">
                <label>Ambiente de pruebas del Ministerio</label>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <InputSwitch
                    checked={formCred.modoPruebas}
                    onChange={(e) => setFormCred({ ...formCred, modoPruebas: e.value })}
                  />
                  <span style={{ fontSize: 13, color: formCred.modoPruebas ? "#f57c00" : "#2e7d32", fontWeight: 600 }}>
                    {formCred.modoPruebas ? "PRUEBAS (recomendado hasta validar)" : "PRODUCCIÓN (registros reales)"}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
              <Button label="Guardar credencial" icon="pi pi-save" onClick={guardarCredencial} />
              <Button
                label="Probar credencial contra el RNDC"
                icon="pi pi-shield"
                outlined
                loading={verificando}
                disabled={!credencial}
                onClick={verificarCredencial}
              />
            </div>
            {credencial?.ultimaVerificacion && (
              <p style={{ fontSize: 13, marginTop: 15, color: credencial.ultimaVerificacionOk ? "#2e7d32" : "#c62828" }}>
                Última verificación: {new Date(credencial.ultimaVerificacion).toLocaleString("es-CO")} —{" "}
                {credencial.ultimaVerificacionOk ? "válida" : `rechazada: ${credencial.ultimaVerificacionError}`}
              </p>
            )}
          </div>
        )}

        {/* ═══ DIALOGO: REMESA ═══ */}
        <Dialog header="Expedir Remesa Terrestre de Carga (proceso 3 RNDC)" visible={showRemesa} style={{ width: "min(950px, 95vw)" }} modal onHide={() => setShowRemesa(false)}>
          <div className="exp-aviso">
            Ambiente actual: <b>{ambiente}</b>. El NIT de rastreo GPS de Asegurar se
            agrega automáticamente a la remesa.
          </div>
          <div className="exp-field" style={{ maxWidth: 300, marginBottom: 14 }}>
            <label>Consecutivo de la remesa *</label>
            <InputText value={consecutivoRemesa} onChange={(e) => setConsecutivoRemesa(e.target.value)} placeholder="Ej: 0001" />
          </div>
          <FormVariables campos={CAMPOS_REMESA} valores={varsRemesa} onChange={(k, v) => setVarsRemesa({ ...varsRemesa, [k]: v })} />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
            <Button label="Cancelar" text onClick={() => setShowRemesa(false)} />
            <Button label="Radicar en el RNDC" icon="pi pi-send" onClick={radicarRemesa} />
          </div>
        </Dialog>

        {/* ═══ DIALOGO: MANIFIESTO ═══ */}
        <Dialog header="Expedir Manifiesto de Carga (proceso 4 RNDC)" visible={showManifiesto} style={{ width: "min(950px, 95vw)" }} modal onHide={() => setShowManifiesto(false)}>
          <div className="exp-aviso">
            Ambiente actual: <b>{ambiente}</b>. Solo puede asociar remesas ya
            radicadas. {remesasRadicadas.length === 0 && <b>No tiene remesas radicadas: expida primero la remesa.</b>}
          </div>
          <div className="exp-grid" style={{ marginBottom: 14 }}>
            <div className="exp-field">
              <label>Consecutivo del manifiesto *</label>
              <InputText value={numManifiesto} onChange={(e) => setNumManifiesto(e.target.value)} placeholder="Ej: 0001" />
            </div>
            <div className="exp-field">
              <label>Remesas a asociar *</label>
              <MultiSelect
                value={remesasSeleccionadas}
                options={remesasRadicadas.map((r) => ({ label: `${r.consecutivoRemesa} (radicado ${r.ingresoid})`, value: r.consecutivoRemesa }))}
                onChange={(e) => setRemesasSeleccionadas(e.value)}
                placeholder="Seleccione remesas radicadas"
                display="chip"
              />
            </div>
            <div className="exp-field">
              <label>Aceptación electrónica</label>
              <Dropdown
                value={aceptacionElectronica}
                options={[
                  { label: "SÍ (titular/conductor firma electrónicamente)", value: "SI" },
                  { label: "NO", value: "NO" },
                ]}
                onChange={(e) => setAceptacionElectronica(e.value)}
              />
            </div>
          </div>
          <FormVariables campos={CAMPOS_MANIFIESTO} valores={varsManifiesto} onChange={(k, v) => setVarsManifiesto({ ...varsManifiesto, [k]: v })} />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
            <Button label="Cancelar" text onClick={() => setShowManifiesto(false)} />
            <Button label="Radicar en el RNDC" icon="pi pi-send" onClick={radicarManifiesto} />
          </div>
        </Dialog>

        {/* ═══ DIALOGO: MAESTRO ═══ */}
        <Dialog
          header={showMaestro === "tercero" ? "Registrar Tercero en el RNDC (proceso 11)" : "Registrar Vehículo en el RNDC (proceso 12)"}
          visible={!!showMaestro}
          style={{ width: "min(950px, 95vw)" }}
          modal
          onHide={() => setShowMaestro(null)}
        >
          <FormVariables
            campos={showMaestro === "tercero" ? CAMPOS_TERCERO : CAMPOS_VEHICULO}
            valores={varsMaestro}
            onChange={(k, v) => setVarsMaestro({ ...varsMaestro, [k]: v })}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
            <Button label="Cancelar" text onClick={() => setShowMaestro(null)} />
            <Button label="Registrar en el RNDC" icon="pi pi-send" onClick={registrarMaestro} />
          </div>
        </Dialog>

        {/* ═══ DIALOGO: ANULACIÓN ═══ */}
        <Dialog
          header={`Anular ${anulando?.tipo === "remesa" ? "remesa" : "manifiesto"} ${anulando?.registro?.consecutivoRemesa || anulando?.registro?.numManifiestoCarga || ""}`}
          visible={!!anulando}
          style={{ width: "min(500px, 95vw)" }}
          modal
          onHide={() => setAnulando(null)}
        >
          <p style={{ fontSize: 13, color: "#666" }}>
            La anulación se radica ante el RNDC y no se puede deshacer.
          </p>
          <div className="exp-field">
            <label>Motivo de la anulación *</label>
            <InputText value={motivoAnulacion} onChange={(e) => setMotivoAnulacion(e.target.value)} placeholder="Mínimo 5 caracteres" />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
            <Button label="Cancelar" text onClick={() => setAnulando(null)} />
            <Button label="Anular en el RNDC" icon="pi pi-ban" severity="danger" onClick={confirmarAnulacion} />
          </div>
        </Dialog>
      </div>
    </div>
  );
}
