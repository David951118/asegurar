import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/* ──────────────────────────────────────────────
   Paleta corporativa Asegurar Ltda. — blanco / azul / amarillo
   ────────────────────────────────────────────── */
const COLOR_AZUL = [10, 45, 110];        // #0a2d6e
const COLOR_AZUL_CLARO = [21, 101, 192]; // #1565c0
const COLOR_AMARILLO = [255, 213, 79];   // #ffd54f
const COLOR_GRIS_TEXTO = [80, 80, 80];
const COLOR_GRIS_SUAVE = [240, 244, 250];
const COLOR_BLANCO = [255, 255, 255];

const TIPO_ACT_LABEL = {
  INSTALACION_NUEVA: "Instalación nueva",
  HOMOLOGACION: "Homologación",
  CAMBIO_2G_4G: "Cambio 2G→4G",
  CAMBIO_CON_COSTO: "Cambio con costo",
  CAMBIO_SIN_COSTO: "Cambio sin costo",
  CAMBIO_COMODATO: "Cambio comodato",
  PRUEBAS: "Pruebas",
  GARANTIA: "Garantía",
  EQUIPO_DANADO: "Equipo dañado",
};

const ESTADO_LABEL = {
  DISPONIBLE: "Disponibles",
  EN_TRANSITO: "En tránsito",
  EN_POSESION_TECNICO: "En posesión técnico",
  INSTALADO: "Instalados",
  EN_REVISION: "En revisión",
  EN_GARANTIA: "En garantía",
  DEVUELTO_CLIENTE: "Devueltos cliente",
  RETIRADO: "Retirados",
};

/* ──────────────────────────────────────────────
   API pública
   ────────────────────────────────────────────── */
export function generarPdfReporte(data, opciones = {}) {
  const { usuarioGenerador = "Admin" } = opciones;

  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 36;

  // ── Header en cada página (se imprime tras renderizar todo) ──
  const pintarHeader = () => {
    doc.setFillColor(...COLOR_AZUL);
    doc.rect(0, 0, pageWidth, 56, "F");
    // Banda amarilla
    doc.setFillColor(...COLOR_AMARILLO);
    doc.rect(0, 56, pageWidth, 4, "F");

    doc.setTextColor(...COLOR_BLANCO);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("ASEGURAR LTDA.", margin, 26);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Reporte de Inventario GPS", margin, 44);

    // Fecha de generación a la derecha
    const fechaGen = new Date().toLocaleString("es-CO", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
    doc.setFontSize(9);
    doc.setTextColor(...COLOR_AMARILLO);
    doc.text(`Generado: ${fechaGen}`, pageWidth - margin, 26, { align: "right" });
    doc.setTextColor(...COLOR_BLANCO);
    doc.text(`Por: ${usuarioGenerador}`, pageWidth - margin, 42, { align: "right" });
  };

  const pintarFooter = (pageN, totalPages) => {
    doc.setFillColor(...COLOR_GRIS_SUAVE);
    doc.rect(0, pageHeight - 22, pageWidth, 22, "F");
    doc.setFontSize(8);
    doc.setTextColor(...COLOR_GRIS_TEXTO);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Asegurar Ltda. — Sistema de Inventario GPS",
      margin,
      pageHeight - 8
    );
    doc.text(
      `Página ${pageN} de ${totalPages}`,
      pageWidth - margin,
      pageHeight - 8,
      { align: "right" }
    );
  };

  let cursorY = 80;

  /* ── Bloque: período y resumen ── */
  const rango = data?.rango || {};
  const desde = fmtFecha(rango.desde);
  const hasta = fmtFecha(rango.hasta);
  const etiqueta = rango.etiqueta || "—";

  doc.setFillColor(...COLOR_GRIS_SUAVE);
  doc.roundedRect(margin, cursorY, pageWidth - margin * 2, 50, 4, 4, "F");
  doc.setTextColor(...COLOR_AZUL);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Período del reporte", margin + 12, cursorY + 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_GRIS_TEXTO);
  doc.text(
    `${desde}  →  ${hasta}    ·    ${capitalizar(etiqueta)}`,
    margin + 12,
    cursorY + 36
  );
  cursorY += 70;

  /* ── KPIs ── */
  const kpis = data?.kpis || {};
  const porEstado = kpis.porEstado || {};
  cursorY = seccionTitulo(doc, "Resumen ejecutivo (snapshot actual)", cursorY, margin);

  const kpiData = [
    ["Total equipos", kpis.totalEquipos ?? 0],
    ["Disponibles en central", kpis.stockCentral ?? 0],
    ...["DISPONIBLE", "EN_TRANSITO", "EN_POSESION_TECNICO", "INSTALADO",
        "EN_REVISION", "EN_GARANTIA", "DEVUELTO_CLIENTE", "RETIRADO"]
      .map((est) => [ESTADO_LABEL[est], porEstado[est] ?? 0]),
  ];
  autoTable(doc, {
    startY: cursorY,
    head: [["Métrica", "Cantidad"]],
    body: kpiData,
    theme: "grid",
    margin: { left: margin, right: margin, bottom: 30 },
    headStyles: {
      fillColor: COLOR_AZUL,
      textColor: COLOR_BLANCO,
      fontStyle: "bold",
      halign: "left",
    },
    bodyStyles: { fontSize: 9, textColor: COLOR_GRIS_TEXTO },
    alternateRowStyles: { fillColor: COLOR_GRIS_SUAVE },
    columnStyles: { 1: { halign: "right", fontStyle: "bold", textColor: COLOR_AZUL } },
  });
  cursorY = doc.lastAutoTable.finalY + 18;

  /* ── Actividades del período ── */
  const actividades = data?.actividadesPeriodo || {};
  if (cursorY > pageHeight - 150) { doc.addPage(); cursorY = 80; }
  cursorY = seccionTitulo(doc, `Actividades del período (${actividades.total ?? 0})`, cursorY, margin);

  if ((actividades.detalle || []).length > 0) {
    autoTable(doc, {
      startY: cursorY,
      head: [["Fecha", "Tipo", "Técnico", "Ciudad", "Placa", "IMEI instalado", "Marca/Modelo"]],
      body: (actividades.detalle || []).map((a) => [
        fmtFecha(a.fechaActividad),
        TIPO_ACT_LABEL[a.tipoActividad] || a.tipoActividad,
        a.tecnico ? `${a.tecnico.nombres || ""} ${a.tecnico.apellidos || ""}`.trim() : "—",
        a.ciudad?.nombre || "—",
        a.placaInstalada || "—",
        a.equipoInstalado?.imei || "—",
        `${a.equipoInstalado?.marca?.nombre || ""} ${a.equipoInstalado?.modelo?.nombre || ""}`.trim() || "—",
      ]),
      theme: "striped",
      styles: { fontSize: 8, cellPadding: 4 },
      headStyles: { fillColor: COLOR_AZUL_CLARO, textColor: COLOR_BLANCO },
      alternateRowStyles: { fillColor: COLOR_GRIS_SUAVE },
      margin: { left: margin, right: margin, bottom: 30 },
    });
    cursorY = doc.lastAutoTable.finalY + 14;
  } else {
    cursorY = textoVacio(doc, "Sin actividades en el período", cursorY, margin);
  }

  /* ── Movimientos del período (resumen por acción) ── */
  const movimientos = data?.movimientosPeriodo || {};
  if (cursorY > pageHeight - 120) { doc.addPage(); cursorY = 80; }
  cursorY = seccionTitulo(doc, `Movimientos del período (${movimientos.total ?? 0})`, cursorY, margin);

  if (movimientos.porAccion && Object.keys(movimientos.porAccion).length > 0) {
    autoTable(doc, {
      startY: cursorY,
      head: [["Acción", "Total"]],
      body: Object.entries(movimientos.porAccion).map(([k, v]) => [k.replace(/_/g, " "), v]),
      theme: "grid",
      headStyles: { fillColor: COLOR_AZUL, textColor: COLOR_BLANCO },
      bodyStyles: { fontSize: 9, textColor: COLOR_GRIS_TEXTO },
      alternateRowStyles: { fillColor: COLOR_GRIS_SUAVE },
      columnStyles: { 1: { halign: "right", fontStyle: "bold", textColor: COLOR_AZUL } },
      margin: { left: margin, right: margin, bottom: 30 },
    });
    cursorY = doc.lastAutoTable.finalY + 14;
  } else {
    cursorY = textoVacio(doc, "Sin movimientos en el período", cursorY, margin);
  }

  /* ── Asignaciones técnico → equipos (solo técnicos con > 0) ── */
  const tecnicosConEquipos = (data?.asignacionesTecnicoEquipo?.tecnicos || [])
    .filter((t) => (t.totalEquipos ?? (t.equipos?.length || 0)) > 0);

  doc.addPage();
  cursorY = 80;
  cursorY = seccionTitulo(doc, "Equipos por técnico", cursorY, margin);
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_GRIS_TEXTO);
  doc.text(
    `${tecnicosConEquipos.length} técnico${tecnicosConEquipos.length !== 1 ? "s" : ""} con equipos asignados`,
    margin,
    cursorY
  );
  cursorY += 14;

  if (tecnicosConEquipos.length === 0) {
    cursorY = textoVacio(doc, "Ningún técnico tiene equipos asignados", cursorY, margin);
  } else {
    tecnicosConEquipos.forEach((row, idx) => {
      if (cursorY > pageHeight - 130) { doc.addPage(); cursorY = 80; }

      const t = row.tecnico || {};
      const nombreCompleto = `${t.nombres || ""} ${t.apellidos || ""}`.trim() || t.identificacion;

      // Banda azul con nombre del técnico
      doc.setFillColor(...COLOR_AZUL);
      doc.roundedRect(margin, cursorY, pageWidth - margin * 2, 22, 3, 3, "F");
      doc.setTextColor(...COLOR_BLANCO);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(nombreCompleto, margin + 10, cursorY + 14);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...COLOR_AMARILLO);
      doc.text(
        `${t.identificacion || "—"} · ${t.ciudad || "—"} · ${row.totalEquipos} equipo${row.totalEquipos !== 1 ? "s" : ""}`,
        pageWidth - margin - 10,
        cursorY + 14,
        { align: "right" }
      );
      cursorY += 26;

      // Tabla de equipos
      autoTable(doc, {
        startY: cursorY,
        head: [["IMEI", "Serial", "Marca/Modelo", "Estado", "Condición", "Placa"]],
        body: (row.equipos || []).map((e) => [
          e.imei || "—",
          e.serial || "—",
          `${e.marca || ""} ${e.modelo || ""}`.trim() || "—",
          e.estado || "—",
          e.condicion || "—",
          e.placaInstalada || "—",
        ]),
        theme: "grid",
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: COLOR_AZUL_CLARO, textColor: COLOR_BLANCO },
        alternateRowStyles: { fillColor: COLOR_GRIS_SUAVE },
        margin: { left: margin, right: margin, bottom: 30 },
      });
      cursorY = doc.lastAutoTable.finalY + 14;
    });
  }

  /* ── Inventario por ciudad ── */
  const tablaCiudad = data?.tablaPorCiudad || {};
  const ciudades = (tablaCiudad.ciudades || []).filter((c) => (c.totalEquipos ?? 0) > 0);

  doc.addPage();
  cursorY = 80;
  cursorY = seccionTitulo(doc, "Inventario por ciudad", cursorY, margin);
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_GRIS_TEXTO);
  doc.text(
    `${ciudades.length} ciudad${ciudades.length !== 1 ? "es" : ""} · ${tablaCiudad.totalEquipos ?? 0} equipos en total`,
    margin,
    cursorY
  );
  cursorY += 18;

  if (ciudades.length === 0) {
    cursorY = textoVacio(doc, "Sin equipos registrados en ciudades", cursorY, margin);
  } else {
    ciudades.forEach((c) => {
      if (cursorY > pageHeight - 130) { doc.addPage(); cursorY = 80; }

      // Banda con nombre de ciudad
      doc.setFillColor(...COLOR_AZUL);
      doc.roundedRect(margin, cursorY, pageWidth - margin * 2, 22, 3, 3, "F");
      doc.setTextColor(...COLOR_BLANCO);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      let titulo = c.ciudad;
      if (c.esCentral) titulo += " (Central)";
      doc.text(titulo, margin + 10, cursorY + 14);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...COLOR_AMARILLO);
      doc.text(
        `${c.totalEquipos} equipo${c.totalEquipos !== 1 ? "s" : ""}`,
        pageWidth - margin - 10,
        cursorY + 14,
        { align: "right" }
      );
      cursorY += 26;

      autoTable(doc, {
        startY: cursorY,
        head: [["Marca", "Modelo", "Nuevos", "Segunda", "Total"]],
        body: (c.modelos || []).map((m) => [
          m.marca || "—",
          m.modelo || "—",
          m.nuevos ?? 0,
          m.segunda ?? 0,
          m.total ?? 0,
        ]),
        theme: "grid",
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: COLOR_AZUL_CLARO, textColor: COLOR_BLANCO },
        alternateRowStyles: { fillColor: COLOR_GRIS_SUAVE },
        columnStyles: {
          2: { halign: "right" },
          3: { halign: "right" },
          4: { halign: "right", fontStyle: "bold", textColor: COLOR_AZUL },
        },
        margin: { left: margin, right: margin, bottom: 30 },
      });
      cursorY = doc.lastAutoTable.finalY + 14;
    });
  }

  /* ── Tabla resumen consolidada al final ── */
  doc.addPage();
  cursorY = 80;
  cursorY = seccionTitulo(doc, "Tabla consolidada — equipos por ciudad y modelo", cursorY, margin);
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_GRIS_TEXTO);
  doc.text(
    "Vista pivote: cada fila es una combinación ciudad × modelo con su total.",
    margin,
    cursorY
  );
  cursorY += 18;

  const filasConsolidado = [];
  ciudades.forEach((c) => {
    (c.modelos || []).forEach((m) => {
      filasConsolidado.push([
        c.ciudad + (c.esCentral ? " (Central)" : ""),
        m.marca || "—",
        m.modelo || "—",
        m.nuevos ?? 0,
        m.segunda ?? 0,
        m.total ?? 0,
      ]);
    });
  });

  if (filasConsolidado.length === 0) {
    textoVacio(doc, "Sin datos consolidados", cursorY, margin);
  } else {
    autoTable(doc, {
      startY: cursorY,
      head: [["Ciudad", "Marca", "Modelo", "Nuevos", "Segunda", "Total"]],
      body: filasConsolidado,
      foot: [[
        "TOTAL GENERAL", "", "",
        filasConsolidado.reduce((s, r) => s + (r[3] || 0), 0),
        filasConsolidado.reduce((s, r) => s + (r[4] || 0), 0),
        filasConsolidado.reduce((s, r) => s + (r[5] || 0), 0),
      ]],
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: COLOR_AZUL, textColor: COLOR_BLANCO, fontStyle: "bold" },
      alternateRowStyles: { fillColor: COLOR_GRIS_SUAVE },
      footStyles: {
        fillColor: COLOR_AMARILLO,
        textColor: COLOR_AZUL,
        fontStyle: "bold",
        fontSize: 10,
      },
      columnStyles: {
        3: { halign: "right" },
        4: { halign: "right" },
        5: { halign: "right", fontStyle: "bold", textColor: COLOR_AZUL },
      },
      margin: { left: margin, right: margin, bottom: 30 },
    });
  }

  /* ── Aplicar header y footer en todas las páginas ── */
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    pintarHeader();
    pintarFooter(i, totalPages);
  }

  /* ── Guardar ── */
  const fechaArchivo = new Date().toISOString().slice(0, 10);
  doc.save(`reporte-inventario-gps-${fechaArchivo}.pdf`);
}

/* ─── helpers ─── */
function seccionTitulo(doc, titulo, y, margin) {
  // Banda amarilla decorativa a la izquierda
  doc.setFillColor(...COLOR_AMARILLO);
  doc.rect(margin, y - 12, 4, 18, "F");
  doc.setTextColor(...COLOR_AZUL);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(titulo, margin + 12, y + 2);
  return y + 18;
}

function textoVacio(doc, texto, y, margin) {
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(...COLOR_GRIS_TEXTO);
  doc.text(texto, margin, y);
  return y + 16;
}

function fmtFecha(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("es-CO", {
      day: "2-digit", month: "2-digit", year: "numeric",
    });
  } catch { return iso; }
}

function capitalizar(s) {
  if (!s) return "";
  return s[0].toUpperCase() + s.slice(1);
}
