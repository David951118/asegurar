import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/* ──────────────────────────────────────────────
   Consolidado PDF del inventario de cámaras
   (misma paleta corporativa que generarPdf.js)
   ────────────────────────────────────────────── */
const COLOR_AZUL = [10, 45, 110];        // #0a2d6e
const COLOR_AMARILLO = [255, 213, 79];   // #ffd54f
const COLOR_GRIS_TEXTO = [80, 80, 80];
const COLOR_GRIS_SUAVE = [240, 244, 250];
const COLOR_BLANCO = [255, 255, 255];
const COLOR_VERDE = [10, 124, 58];
const COLOR_ROJO = [183, 28, 28];
const COLOR_AZUL_CLARO = [21, 101, 192];

const ESTADO_LABEL = {
  EN_EMPRESA: "En la empresa",
  INSTALADA: "Instalada",
  DESCARTADA: "Descartada",
};
const ESTADO_ORDEN = ["EN_EMPRESA", "INSTALADA", "DESCARTADA"];
const ESTADO_COLOR = {
  EN_EMPRESA: COLOR_VERDE,
  INSTALADA: COLOR_AZUL_CLARO,
  DESCARTADA: COLOR_ROJO,
};

/**
 * Genera y descarga el consolidado de cámaras: resumen, unidades por
 * marca/modelo, detalle por estado y listado completo.
 * @param {{ camaras: Array, resumen: object, usuarioGenerador?: string }} p
 */
export function generarPdfCamaras({ camaras = [], resumen = {}, usuarioGenerador = "Admin" }) {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const margin = 36;
  const pageW = () => doc.internal.pageSize.getWidth();
  const pageH = () => doc.internal.pageSize.getHeight();

  const pintarHeader = () => {
    const w = pageW();
    doc.setFillColor(...COLOR_AZUL);
    doc.rect(0, 0, w, 56, "F");
    doc.setFillColor(...COLOR_AMARILLO);
    doc.rect(0, 56, w, 4, "F");
    doc.setTextColor(...COLOR_BLANCO);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("ASEGURAR LTDA.", margin, 26);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Consolidado de inventario de cámaras", margin, 44);
    const fechaGen = new Date().toLocaleString("es-CO", {
      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
    doc.setFontSize(9);
    doc.setTextColor(...COLOR_AMARILLO);
    doc.text(`Generado: ${fechaGen}`, w - margin, 26, { align: "right" });
    doc.setTextColor(...COLOR_BLANCO);
    doc.text(`Por: ${usuarioGenerador}`, w - margin, 42, { align: "right" });
  };

  const pintarFooter = (n, total) => {
    const w = pageW();
    const h = pageH();
    doc.setFillColor(...COLOR_GRIS_SUAVE);
    doc.rect(0, h - 22, w, 22, "F");
    doc.setFontSize(8);
    doc.setTextColor(...COLOR_GRIS_TEXTO);
    doc.setFont("helvetica", "normal");
    doc.text("Asegurar Ltda. — Inventario de cámaras", margin, h - 8);
    doc.text(`Página ${n} de ${total}`, w - margin, h - 8, { align: "right" });
  };

  const tablaBase = {
    theme: "grid",
    margin: { left: margin, right: margin, top: 80, bottom: 30 },
    headStyles: { fillColor: COLOR_AZUL, textColor: COLOR_BLANCO, fontStyle: "bold", halign: "left", fontSize: 9 },
    bodyStyles: { fontSize: 8, textColor: COLOR_GRIS_TEXTO, cellPadding: 4 },
    alternateRowStyles: { fillColor: COLOR_GRIS_SUAVE },
  };

  let y = 80;
  const asegurarEspacio = (min) => {
    if (y > pageH() - min) {
      doc.addPage("a4", "landscape");
      y = 80;
    }
  };

  /* ── Resumen general ── */
  const porEstado = resumen?.porEstado || {};
  const total = resumen?.total ?? camaras.length;
  y = seccionTitulo(doc, "Resumen general", y, margin);

  const kpis = [
    ["Total de cámaras", total],
    ...ESTADO_ORDEN.map((e) => [
      ESTADO_LABEL[e],
      porEstado[e] ?? camaras.filter((c) => c.estado === e).length,
    ]),
  ];
  autoTable(doc, {
    ...tablaBase,
    startY: y,
    head: [["Indicador", "Cantidad"]],
    body: kpis,
    tableWidth: 300,
    columnStyles: { 1: { halign: "right", fontStyle: "bold", textColor: COLOR_AZUL } },
  });
  const finKpis = doc.lastAutoTable.finalY;

  /* ── Unidades por marca y modelo (a la derecha del resumen) ── */
  const porModelo = resumen?.porModelo || [];
  if (porModelo.length > 0) {
    autoTable(doc, {
      ...tablaBase,
      startY: y,
      margin: { ...tablaBase.margin, left: margin + 320 },
      head: [["Marca", "Modelo", "En empresa", "Instaladas", "Descartadas", "Total"]],
      body: porModelo.map((m) => [
        m.marca || "—", m.modelo || "—", m.enEmpresa ?? 0, m.instaladas ?? 0, m.descartadas ?? 0, m.total ?? 0,
      ]),
      columnStyles: {
        2: { halign: "right" }, 3: { halign: "right" }, 4: { halign: "right" },
        5: { halign: "right", fontStyle: "bold", textColor: COLOR_AZUL },
      },
    });
    y = Math.max(finKpis, doc.lastAutoTable.finalY) + 24;
  } else {
    y = finKpis + 24;
  }

  /* ── Detalle por estado ── */
  const ordenadas = [...camaras].sort((a, b) => String(a.serial).localeCompare(String(b.serial)));
  const columnas = ["Serial", "Marca / Modelo", "Condición", "Estado", "Instalada en", "Instalación", "Último retiro", "Observaciones"];
  const fila = (c) => [
    c.serial || "—",
    `${c.marca?.nombre || ""} ${c.modelo?.nombre || ""}`.trim() || "—",
    c.condicion === "SEGUNDA" ? "Segunda" : "Nueva",
    ESTADO_LABEL[c.estado] || c.estado || "—",
    c.estado === "INSTALADA"
      ? [c.instaladaEn?.placa, c.instaladaEn?.descripcion].filter(Boolean).join(" — ") || "—"
      : "—",
    fmtFecha(c.fechaInstalacion),
    fmtFecha(c.fechaRetiro),
    c.observaciones || "",
  ];

  for (const estado of ESTADO_ORDEN) {
    const grupo = ordenadas.filter((c) => c.estado === estado);
    asegurarEspacio(140);
    y = seccionTitulo(doc, `${ESTADO_LABEL[estado]} (${grupo.length})`, y, margin, ESTADO_COLOR[estado]);
    if (grupo.length === 0) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(...COLOR_GRIS_TEXTO);
      doc.text("Sin cámaras en este estado.", margin + 12, y + 4);
      y += 24;
      continue;
    }
    autoTable(doc, {
      ...tablaBase,
      startY: y,
      head: [columnas],
      body: grupo.map(fila),
      headStyles: { ...tablaBase.headStyles, fillColor: ESTADO_COLOR[estado] },
      columnStyles: {
        0: { fontStyle: "bold", textColor: COLOR_AZUL, cellWidth: 90 },
        1: { cellWidth: 120 },
        2: { cellWidth: 60 },
        3: { cellWidth: 75 },
        4: { cellWidth: 150 },
        5: { cellWidth: 65 },
        6: { cellWidth: 65 },
      },
    });
    y = doc.lastAutoTable.finalY + 22;
  }

  /* ── Listado completo (todas las cámaras en una sola tabla) ── */
  asegurarEspacio(140);
  y = seccionTitulo(doc, `Listado completo (${ordenadas.length} cámaras)`, y, margin);
  autoTable(doc, {
    ...tablaBase,
    startY: y,
    head: [["#", ...columnas]],
    body: ordenadas.map((c, i) => [i + 1, ...fila(c)]),
    columnStyles: {
      0: { cellWidth: 28, halign: "right" },
      1: { fontStyle: "bold", textColor: COLOR_AZUL, cellWidth: 85 },
      2: { cellWidth: 115 },
      3: { cellWidth: 55 },
      4: { cellWidth: 70 },
      5: { cellWidth: 140 },
      6: { cellWidth: 62 },
      7: { cellWidth: 62 },
    },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 4) {
        const c = ordenadas[data.row.index];
        const color = ESTADO_COLOR[c?.estado];
        if (color) {
          data.cell.styles.textColor = color;
          data.cell.styles.fontStyle = "bold";
        }
      }
    },
  });

  /* ── Header y footer en todas las páginas ── */
  const paginas = doc.internal.getNumberOfPages();
  for (let i = 1; i <= paginas; i++) {
    doc.setPage(i);
    pintarHeader();
    pintarFooter(i, paginas);
  }

  const fechaArchivo = new Date().toISOString().slice(0, 10);
  doc.save(`consolidado-camaras-${fechaArchivo}.pdf`);
}

/* ─── helpers ─── */
function seccionTitulo(doc, titulo, y, margin, color = COLOR_AMARILLO) {
  doc.setFillColor(...color);
  doc.rect(margin, y - 12, 4, 18, "F");
  doc.setTextColor(...COLOR_AZUL);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(titulo, margin + 12, y + 2);
  return y + 18;
}

function fmtFecha(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return String(iso);
  }
}
