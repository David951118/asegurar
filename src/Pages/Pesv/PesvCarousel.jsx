import React, { useMemo, useState } from "react";

const initialData = {
  diagnostico: {
    alcance: "",
    descripcionOperacion: "",
    riesgosPrincipales: "",
    // ✅ ANTES era string. Ahora soporta links + archivos (NO rompe tu UI).
    evidencia: { links: "", files: [] },
    responsable: "",
    fechaActualizacion: "",
  },
  capacitacion: {
    poblacionObjetivo: "",
    temario: "",
    frecuencia: "",
    evidenciasAsistencia: "",
    evaluacion: "",
    responsable: "",
  },
  directivo: {
    politicaFirmadaPor: "",
    fechaFirma: "",
    recursosAsignados: "",
    comiteOResponsablePESV: "",
    actasSeguimiento: "",
    metasKPI: "",
  },
  mantenimiento: {
    flotaInventario: "",
    inspeccionPreoperacional: "",
    planMantenimiento: "",
    periodicidad: "",
    registrosTaller: "",
    responsable: "",
  },
};

const steps = [
  {
    key: "diagnostico",
    title: "Diagnóstico y caracterización de riesgos",
    subtitle: "Define el mapa de riesgo: alcance, operación, riesgos y evidencia.",
    icon: "🧭",
    required: ["alcance", "descripcionOperacion", "riesgosPrincipales", "responsable"],
    fields: [
      { name: "alcance", label: "Alcance (flota / conductores / terceros)", placeholder: "Ej: Flota propia + conductores + contratistas" },
      { name: "descripcionOperacion", label: "Descripción de la operación", placeholder: "Ej: rutas, turnos, zonas críticas, tipo de servicio", textarea: true },
      { name: "riesgosPrincipales", label: "Riesgos principales identificados", placeholder: "Ej: velocidad, fatiga, distractores, clima, vía…", textarea: true },
      // ✅ Mantengo tu field, solo cambia el label (más claro)
      { name: "evidencia", label: "Evidencia (archivos / links)" },
      { name: "responsable", label: "Responsable", placeholder: "Ej: Coordinador SST / Operaciones" },
      { name: "fechaActualizacion", label: "Fecha de actualización", placeholder: "YYYY-MM-DD" },
    ],
    sideTips: [
      "Alinea el diagnóstico con la realidad operativa (rutas, horarios, exposición).",
      "Registra riesgos por severidad y frecuencia (aunque sea cualitativo).",
      "Evidencia: acta, matriz, fotos, reportes, inspecciones.",
    ],
  },
  {
    key: "capacitacion",
    title: "Capacitación en seguridad vial",
    subtitle: "Formación recurrente, medible y con evidencias trazables.",
    icon: "🎓",
    required: ["poblacionObjetivo", "temario", "frecuencia", "responsable"],
    fields: [
      { name: "poblacionObjetivo", label: "Población objetivo", placeholder: "Ej: Conductores, supervisores, contratistas" },
      { name: "temario", label: "Temario", placeholder: "Ej: velocidad, fatiga, celular, alcohol/drogas, maniobras…", textarea: true },
      { name: "frecuencia", label: "Frecuencia", placeholder: "Ej: Mensual / Trimestral / Semestral" },
      { name: "evidenciasAsistencia", label: "Evidencias (listas / fotos / certificados)", placeholder: "Ej: actas, asistencia, LMS, certificados" },
      { name: "evaluacion", label: "Evaluación (cómo mides aprendizaje)", placeholder: "Ej: quiz, práctica, checklist en ruta" },
      { name: "responsable", label: "Responsable", placeholder: "Ej: SST / Talento Humano / Operaciones" },
    ],
    sideTips: [
      "Capacitación sin evaluación = discurso sin control.",
      "Define micro-temas por mes (10–15 min) y refuerzos trimestrales.",
      "Evidencia mínima: listado + material + evaluación + plan de mejora.",
    ],
  },
  {
    key: "directivo",
    title: "Compromiso del nivel directivo",
    subtitle: "Gobernanza, recursos y seguimiento: aquí se define si el plan vive o se archiva.",
    icon: "🏛️",
    required: ["politicaFirmadaPor", "fechaFirma", "recursosAsignados"],
    fields: [
      { name: "politicaFirmadaPor", label: "Política firmada por", placeholder: "Ej: Representante legal / Gerencia General" },
      { name: "fechaFirma", label: "Fecha de firma", placeholder: "YYYY-MM-DD" },
      { name: "recursosAsignados", label: "Recursos asignados (humanos/financieros)", placeholder: "Ej: presupuesto mensual, horas, herramientas, mantenimiento…", textarea: true },
      { name: "comiteOResponsablePESV", label: "Responsable / Comité PESV", placeholder: "Ej: Comité SST + Líder PESV" },
      { name: "actasSeguimiento", label: "Actas / seguimiento", placeholder: "Ej: acta mensual #04, tablero KPI, comité…" },
      { name: "metasKPI", label: "Metas / KPIs", placeholder: "Ej: -20% incidentes, 95% inspecciones, 0 alcohol…", textarea: true },
    ],
    sideTips: [
      "Sin recursos, el PESV es una promesa… y las promesas no auditan.",
      "Define KPIs simples y duros: inspecciones, mantenimiento, incidentes, formación.",
      "Actas y seguimiento: disciplina conservadora que evita caos moderno.",
    ],
  },
  {
    key: "mantenimiento",
    title: "Inspección y mantenimiento periódico",
    subtitle: "Disciplina operativa: inventario, inspecciones, plan y registros.",
    icon: "🛠️",
    required: ["flotaInventario", "inspeccionPreoperacional", "planMantenimiento"],
    fields: [
      { name: "flotaInventario", label: "Inventario de flota", placeholder: "Ej: 12 motos, 3 camionetas, 1 camión" },
      { name: "inspeccionPreoperacional", label: "Inspección preoperacional", placeholder: "Ej: checklist diario, responsable, evidencia…", textarea: true },
      { name: "planMantenimiento", label: "Plan de mantenimiento", placeholder: "Ej: preventivo por km/mes + correctivo por hallazgos", textarea: true },
      { name: "periodicidad", label: "Periodicidad", placeholder: "Ej: semanal / mensual / por kilometraje" },
      { name: "registrosTaller", label: "Registros (OT/facturas/historial)", placeholder: "Ej: órdenes de trabajo, facturas, historial" },
      { name: "responsable", label: "Responsable", placeholder: "Ej: Jefe de flota / Mantenimiento" },
    ],
    sideTips: [
      "Preoperacional diario reduce sorpresas y mantiene la operación rentable.",
      "Registros de taller y OT: el auditor ama el papel bien organizado.",
      "Si hay tercerizados: exige evidencias como parte del contrato.",
    ],
  },
];

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function SectionPill({ active, title }) {
  return (
    <div
      className="d-flex align-items-center gap-2"
      style={{
        padding: "10px 16px",
        borderRadius: 8,
        border: active ? "2px solid rgba(17,24,39,0.3)" : "1px solid rgba(17,24,39,0.15)",
        background: active ? "rgba(17,24,39,0.08)" : "rgba(255,255,255,0.5)",
        fontWeight: 700,
        color: active ? "#111827" : "#6b7280",
        cursor: "pointer",
        fontSize: 13,
        transition: "all 0.2s ease",
      }}
    >
      <span>{title}</span>
    </div>
  );
}

/** ✅ Uploader profesional (sin librerías) */
function EvidenceUploader({ value, onChange }) {
  const files = value?.files || [];
  const links = value?.links || "";

  function addFiles(fileList) {
    const arr = Array.from(fileList || []);
    if (!arr.length) return;

    const mapped = arr.map((f) => ({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: f.name,
      size: f.size,
      type: f.type || "application/octet-stream",
      file: f, // File real (para backend)
      previewUrl: f.type?.startsWith("image/") ? URL.createObjectURL(f) : null,
      uploadedUrl: "",
    }));

    onChange({ links, files: [...files, ...mapped] });
  }

  function removeFile(id) {
    const target = files.find((x) => x.id === id);
    if (target?.previewUrl) {
      try { URL.revokeObjectURL(target.previewUrl); } catch {}
    }
    onChange({ links, files: files.filter((x) => x.id !== id) });
  }

  function updateLinks(nextLinks) {
    onChange({ links: nextLinks, files });
  }

  return (
    <div>
      <div className="row g-2">
        <div className="col-12">
          <input
            className="form-control"
            type="file"
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
            multiple
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
            style={{ borderRadius: 12 }}
          />
          <div className="form-text">
            Sube fotos, PDFs u otros soportes. En auditoría, esto es “la prueba reina”.
          </div>
        </div>

        <div className="col-12">
          <textarea
            className="form-control"
            rows={2}
            value={links}
            onChange={(e) => updateLinks(e.target.value)}
            placeholder="Links de evidencia (Drive/SharePoint/URL interna). Uno por línea si quieres."
            style={{ borderRadius: 12 }}
          />
        </div>
      </div>

      {files.length ? (
        <div className="mt-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div style={{ fontWeight: 800, color: "#111827" }}>Archivos cargados</div>
            <span
              className="badge rounded-pill"
              style={{ background: "#111827", color: "white", padding: "8px 10px", fontWeight: 900 }}
            >
              {files.length}
            </span>
          </div>

          <div className="d-flex flex-column gap-2">
            {files.map((f) => (
              <div
                key={f.id}
                className="d-flex align-items-center justify-content-between"
                style={{
                  border: "1px solid rgba(17,24,39,0.10)",
                  borderRadius: 12,
                  padding: 10,
                  background: "rgba(255,255,255,0.55)",
                  backdropFilter: "blur(6px)",
                }}
              >
                <div className="d-flex align-items-center gap-2" style={{ minWidth: 0 }}>
                  {f.previewUrl ? (
                    <img
                      src={f.previewUrl}
                      alt={f.name}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        objectFit: "cover",
                        border: "1px solid rgba(17,24,39,0.12)",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(17,24,39,0.06)",
                        border: "1px solid rgba(17,24,39,0.12)",
                        fontWeight: 900,
                        color: "#111827",
                        fontSize: 12,
                      }}
                      title={f.type}
                    >
                      FILE
                    </div>
                  )}

                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 800,
                        color: "#111827",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 360,
                      }}
                    >
                      {f.name}
                    </div>
                    <div className="text-muted" style={{ fontSize: 12 }}>
                      {(f.size / 1024).toFixed(1)} KB · {f.type}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => removeFile(f.id)}
                  style={{ borderRadius: 10, fontWeight: 800 }}
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function PesvCarousel() {
  const [idx, setIdx] = useState(0);
  const [data, setData] = useState(initialData);
  const [touched, setTouched] = useState({});
  const [toast, setToast] = useState(null);

  const step = steps[idx];
  const stepData = data[step.key];

  const missing = useMemo(() => {
    return step.required.filter((f) => !String(stepData?.[f] ?? "").trim());
  }, [step.required, stepData]);

  const progress = Math.round(((idx + 1) / steps.length) * 100);

  function setField(sectionKey, name, value) {
    setData((prev) => ({
      ...prev,
      [sectionKey]: { ...prev[sectionKey], [name]: value },
    }));
  }

  function markTouched(sectionKey, name) {
    setTouched((prev) => ({ ...prev, [`${sectionKey}.${name}`]: true }));
  }

  function notify(kind, msg) {
    setToast({ kind, msg });
    window.clearTimeout(notify._t);
    notify._t = window.setTimeout(() => setToast(null), 2500);
  }

  function go(nextIdx) {
    setIdx(clamp(nextIdx, 0, steps.length - 1));
    setToast(null);
  }

  function next() {
    if (missing.length) {
      missing.forEach((f) => markTouched(step.key, f));
      notify("warning", `Faltan ${missing.length} dato(s) clave para avanzar.`);
      return;
    }
    if (idx === steps.length - 1) {
      notify("success", "Listo. Mínimo diligenciado. Ahora: evidencias y seguimiento.");
      return;
    }
    go(idx + 1);
  }

  function back() {
    go(idx - 1);
  }

  function exportJson() {
    const payload = {
      company: "Asegurar",
      module: "PESV",
      version: "1.0",
      updatedAt: new Date().toISOString(),
      data,
    };
    const txt = JSON.stringify(payload, null, 2);

    navigator.clipboard?.writeText(txt).then(
      () => notify("success", "JSON copiado al portapapeles."),
      () => notify("warning", "No pude copiar. Copia manual desde el panel de exportación.")
    );

    return txt;
  }

  // ✅ Preview JSON limpio: no incluye File ni previewUrl (para que no reviente)
  const exportText = useMemo(() => {
    const clean = JSON.parse(
      JSON.stringify(data, (key, val) => {
        if (key === "file") return undefined;
        if (key === "previewUrl") return undefined;
        return val;
      })
    );

    return JSON.stringify({ company: "Asegurar", module: "PESV", version: "1.0", data: clean }, null, 2);
  }, [data]);

  return (
    <div>
      <div className="d-flex flex-wrap gap-2 mb-3">
        {steps.map((s, i) => (
          <button
            key={s.key}
            type="button"
            onClick={() => go(i)}
            className="btn p-0"
            style={{ border: "none", background: "transparent" }}
            title={s.title}
          >
            <SectionPill active={i === idx} icon={s.icon} title={`Paso ${i + 1}`} />
          </button>
        ))}
      </div>

      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mb-3">
        <div>
          <div style={{ fontWeight: 900, fontSize: 18, color: "#111827" }}>{step.title}</div>
          <div className="text-muted" style={{ fontSize: 13 }}>{step.subtitle}</div>
        </div>

        <div style={{ minWidth: 240 }}>
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="text-muted" style={{ fontSize: 12, fontWeight: 700 }}>Progreso</span>
            <span style={{ fontSize: 12, fontWeight: 900, color: "#111827" }}>{progress}%</span>
          </div>
          <div className="progress" style={{ height: 10, borderRadius: 999 }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${progress}%`, backgroundColor: "#111827" }}
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
          <div className="text-muted mt-1" style={{ fontSize: 12 }}>
            Paso {idx + 1} de {steps.length}
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
            <div className="card-body" style={{ padding: 16 }}>
              <div className="row g-3">
                {step.fields.map((f) => {
                  const path = `${step.key}.${f.name}`;
                  const value = stepData?.[f.name] ?? "";
                  const isRequired = step.required.includes(f.name);
                  const isMissing = isRequired && !String(value).trim();
                  const showError = isMissing && touched[path];

                  // ✅ EVIDENCIA: render especial con uploader (sin borrar tu lógica)
                  if (f.name === "evidencia") {
                    return (
                      <div className="col-12" key={path}>
                        <label className="form-label" style={{ fontWeight: 800, color: "#111827" }}>
                          {f.label}
                        </label>

                        <EvidenceUploader
                          value={stepData?.evidencia || { links: "", files: [] }}
                          onChange={(nextEvidence) => setField(step.key, "evidencia", nextEvidence)}
                        />

                        <div className="form-text">
                          Tip: puedes combinar links y archivos. Lo importante es que quede trazable.
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className="col-12" key={path}>
                      <label className="form-label" style={{ fontWeight: 800, color: "#111827" }}>
                        {f.label}{" "}
                        {isRequired ? <span className="text-danger" title="Requerido">*</span> : null}
                      </label>

                      {f.textarea ? (
                        <textarea
                          className={`form-control ${showError ? "is-invalid" : ""}`}
                          value={value}
                          placeholder={f.placeholder}
                          rows={4}
                          onBlur={() => markTouched(step.key, f.name)}
                          onChange={(e) => setField(step.key, f.name, e.target.value)}
                          style={{ borderRadius: 12 }}
                        />
                      ) : (
                        <input
                          className={`form-control ${showError ? "is-invalid" : ""}`}
                          value={value}
                          placeholder={f.placeholder}
                          onBlur={() => markTouched(step.key, f.name)}
                          onChange={(e) => setField(step.key, f.name, e.target.value)}
                          style={{ borderRadius: 12 }}
                        />
                      )}

                      {showError ? (
                        <div className="invalid-feedback" style={{ fontWeight: 700 }}>
                          Este campo es clave para el mínimo del PESV.
                        </div>
                      ) : (
                        <div className="form-text">
                          Tip: adjunta evidencia o referencia trazable para soportar verificación.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="d-flex justify-content-between align-items-center mt-4 gap-2">
                <button
                  type="button"
                  className="btn btn-outline-dark"
                  onClick={back}
                  disabled={idx === 0}
                  style={{ borderRadius: 12, fontWeight: 800 }}
                >
                  ← Atrás
                </button>

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={exportJson}
                    style={{ borderRadius: 12, fontWeight: 800 }}
                  >
                    Exportar JSON
                  </button>

                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={next}
                    style={{ borderRadius: 12, fontWeight: 900 }}
                  >
                    {idx === steps.length - 1 ? "Finalizar" : "Siguiente →"}
                  </button>
                </div>
              </div>

              {toast ? (
                <div
                  className={`alert mt-3 ${
                    toast.kind === "success"
                      ? "alert-success"
                      : toast.kind === "warning"
                      ? "alert-warning"
                      : "alert-secondary"
                  }`}
                  role="alert"
                  style={{ borderRadius: 14, fontWeight: 700 }}
                >
                  {toast.msg}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
            <div className="card-body" style={{ padding: 16 }}>
              <div className="d-flex align-items-center justify-content-between mb-2" style={{ gap: 10 }}>
                <div style={{ fontWeight: 900, color: "#111827" }}>Checklist del paso</div>
                <span
                  className="badge rounded-pill"
                  style={{
                    background: missing.length ? "#f59e0b" : "#16a34a",
                    color: "white",
                    padding: "8px 10px",
                    fontWeight: 900,
                  }}
                >
                  {missing.length ? `${missing.length} pendiente(s)` : "OK"}
                </span>
              </div>

              <div className="small text-muted mb-2">
                Enfoque conservador y efectivo: primero lo infaltable, luego lo sofisticado.
              </div>

              <ul className="list-group list-group-flush">
                {step.required.map((r) => {
                  const ok = String(stepData?.[r] ?? "").trim().length > 0;
                  return (
                    <li
                      key={r}
                      className="list-group-item d-flex justify-content-between align-items-center"
                      style={{ paddingLeft: 0, paddingRight: 0 }}
                    >
                      <span style={{ fontWeight: 700, color: "#111827" }}>{r}</span>
                      <span style={{ fontWeight: 900 }}>{ok ? "✅" : "⚠️"}</span>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-3">
                <div style={{ fontWeight: 900, color: "#111827" }}>Notas de implementación</div>
                <ul className="small text-muted mt-2" style={{ paddingLeft: 18 }}>
                  {step.sideTips.map((t, i) => (
                    <li key={i} style={{ marginBottom: 6 }}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm mt-3" style={{ borderRadius: 16 }}>
            <div className="card-body" style={{ padding: 16 }}>
              <div style={{ fontWeight: 900, color: "#111827" }}>Payload (preview)</div>
              <div className="text-muted small mb-2">
                Ideal para guardar como “draft” y enviar al backend.
              </div>
              <pre
                style={{
                  margin: 0,
                  maxHeight: 240,
                  overflow: "auto",
                  background: "#0b1220",
                  color: "rgba(255,255,255,0.88)",
                  padding: 12,
                  borderRadius: 14,
                  fontSize: 11,
                }}
              >
                {exportText}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}