import React, { useState } from "react";
import { OPCIONES_INFORME_DEFAULT, SECCIONES_INFORME } from "./reporteUtils";

/**
 * Popup previo a generar el informe (PDF o Excel): el usuario marca qué
 * secciones incluir. Las desmarcadas no salen en el archivo. La selección se
 * conserva mientras la página esté abierta.
 */
export default function OpcionesInformeModal({ open, formato, onCancel, onConfirm }) {
  const [secciones, setSecciones] = useState(OPCIONES_INFORME_DEFAULT.secciones);
  const [excluirInstalados, setExcluirInstalados] = useState(
    OPCIONES_INFORME_DEFAULT.excluirInstalados,
  );

  if (!open) return null;

  const etiquetaFormato = formato === "excel" ? "Excel" : "PDF";
  const seleccionadas = SECCIONES_INFORME.filter((s) => secciones[s.key]).length;
  const ninguna = seleccionadas === 0;

  const toggle = (key) => setSecciones((s) => ({ ...s, [key]: !s[key] }));
  const marcarTodas = (valor) =>
    setSecciones(Object.fromEntries(SECCIONES_INFORME.map((s) => [s.key, valor])));

  return (
    <div className="inv-modal-backdrop" onClick={onCancel}>
      <div className="inv-modal inv-modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="inv-modal-header">
          <h3>Contenido del informe ({etiquetaFormato})</h3>
        </div>
        <div className="inv-modal-body">
          <p style={{ margin: "0 0 12px" }}>
            Marque las secciones que quiere incluir. Las que desmarque no saldrán en el archivo.
          </p>

          <div className="inv-check-actions">
            <span>
              {seleccionadas} de {SECCIONES_INFORME.length} secciones
            </span>
            <div className="spacer" />
            <button type="button" className="inv-link" onClick={() => marcarTodas(true)}>
              Todas
            </button>
            <button type="button" className="inv-link" onClick={() => marcarTodas(false)}>
              Ninguna
            </button>
          </div>

          <div className="inv-check-list">
            {SECCIONES_INFORME.map((s) => (
              <label key={s.key} className={`inv-check-item ${secciones[s.key] ? "on" : ""}`}>
                <input
                  type="checkbox"
                  checked={!!secciones[s.key]}
                  onChange={() => toggle(s.key)}
                />
                <div>
                  <div className="inv-check-title">{s.label}</div>
                  <div className="inv-check-desc">{s.descripcion}</div>
                </div>
              </label>
            ))}
          </div>

          <div className="inv-check-divider" />

          <label className={`inv-check-item ${excluirInstalados ? "on" : ""} ${secciones.tecnicos ? "" : "disabled"}`}>
            <input
              type="checkbox"
              checked={excluirInstalados}
              disabled={!secciones.tecnicos}
              onChange={(e) => setExcluirInstalados(e.target.checked)}
            />
            <div>
              <div className="inv-check-title">Excluir equipos instalados en "Equipos por técnico"</div>
              <div className="inv-check-desc">
                Solo se listan los equipos que el técnico aún tiene en su poder
                (disponibles, en tránsito, en revisión, etc.).
              </div>
            </div>
          </label>
        </div>
        <div className="inv-modal-footer">
          <button type="button" className="inv-btn inv-btn-outline" onClick={onCancel}>
            Cancelar
          </button>
          <button
            type="button"
            className="inv-btn"
            disabled={ninguna}
            title={ninguna ? "Seleccione al menos una sección" : ""}
            onClick={() => onConfirm({ secciones, excluirInstalados })}
          >
            ↓ Generar {etiquetaFormato}
          </button>
        </div>
      </div>
    </div>
  );
}
