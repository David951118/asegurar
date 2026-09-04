import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  construirMatrizEquiposCiudades,
  nombreTecnico,
  normalizarOpciones,
  prepararCiudades,
  prepararTecnicos,
} from "./reporteUtils";

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

// A partir de este número de ciudades la matriz consolidada va en horizontal
const MAX_CIUDADES_VERTICAL = 6;

/* ──────────────────────────────────────────────
   API pública
   opciones: { usuarioGenerador, secciones: { resumen, actividades, movimientos,
               tecnicos, ciudades, consolidado }, excluirInstalados }
   ────────────────────────────────────────────── */
export function generarPdfReporte(data, opciones = {}) {
  const { usuarioGenerador, secciones, excluirInstalados } = normalizarOpciones(opciones);

  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const margin = 36;
  // Ancho/alto de la página ACTUAL (la matriz consolidada puede ir en horizontal)
  const pageW = () => doc.internal.pageSize.getWidth();
  const pageH = () => doc.internal.pageSize.getHeight();

  // ── Header en cada página (se imprime tras renderizar todo) ──
  const pintarHeader = () => {
    const pageWidth = pageW();
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
    const pageWidth = pageW();
    const pageHeight = pageH();
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

  const nuevaPagina = (orientation = "portrait") => {
    doc.addPage("a4", orientation);
    return 80;
  };

  let cursorY = 80;
  // Cada sección arranca en página nueva salvo la primera que se imprime
  let primeraSeccion = true;
  const iniciarSeccion = ({ enPaginaNueva = false, orientation = "portrait", minEspacio = 150 } = {}) => {
    if (!primeraSeccion && (enPaginaNueva || orientation === "landscape" || cursorY > pageH() - minEspacio)) {
      cursorY = nuevaPagina(orientation);
    }
    primeraSeccion = false;
  };

  /* ── Bloque: período y resumen ── */
  const rango = data?.rango || {};
  const desde = fmtFecha(rango.desde);
  const hasta = fmtFecha(rango.hasta);
  const etiqueta = rango.etiqueta || "—";

  doc.setFillColor(...COLOR_GRIS_SUAVE);
  doc.roundedRect(margin, cursorY, pageW() - margin * 2, 50, 4, 4, "F");
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
  if (secciones.resumen) {
    iniciarSeccion();
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
  }

  /* ── Actividades del período ── */
  if (secciones.actividades) {
    const actividades = data?.actividadesPeriodo || {};
    iniciarSeccion({ minEspacio: 150 });
    cursorY = seccionTitulo(doc, `Actividades del período (${actividades.total ?? 0})`, cursorY, margin);

    if ((actividades.detalle || []).length > 0) {
      autoTable(doc, {
        startY: cursorY,
        head: [["Fecha", "Tipo", "Técnico", "Ciudad", "Placa", "IMEI instalado", "Marca/Modelo"]],
        body: (actividades.detalle || []).map((a) => [
          fmtFecha(a.fechaActividad),
          TIPO_ACT_LABEL[a.tipoActividad] || a.tipoActividad,
          a.tecnico ? nombreTecnico(a.tecnico) : "—",
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
  }

  /* ── Movimientos del período (resumen por acción) ── */
  if (secciones.movimientos) {
    const movimientos = data?.movimientosPeriodo || {};
    iniciarSeccion({ minEspacio: 120 });
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
  }

  /* ── Equipos por técnico (sin los instalados, salvo que se pida lo contrario) ── */
  if (secciones.tecnicos) {
    const tecnicosConEquipos = prepararTecnicos(data, { excluirInstalados });

    iniciarSeccion({ enPaginaNueva: true });
    cursorY = seccionTitulo(doc, "Equipos por técnico", cursorY, margin);
    doc.setFontSize(9);
    doc.setTextColor(...COLOR_GRIS_TEXTO);
    doc.text(
      `${tecnicosConEquipos.length} técnico${tecnicosConEquipos.length !== 1 ? "s" : ""} con equipos a cargo` +
        (excluirInstalados ? " (no se listan los equipos ya instalados)" : ""),
      margin,
      cursorY
    );
    cursorY += 14;

    if (tecnicosConEquipos.length === 0) {
      cursorY = textoVacio(
        doc,
        excluirInstalados
          ? "Ningún técnico tiene equipos pendientes de instalar"
          : "Ningún técnico tiene equipos asignados",
        cursorY,
        margin
      );
    } else {
      tecnicosConEquipos.forEach((row) => {
        if (cursorY > pageH() - 130) { cursorY = nuevaPagina(); }

        const t = row.tecnico || {};
        const nombreCompleto = nombreTecnico(t);
        const resumenEstados = Object.entries(row.porEstado || {})
          .map(([est, n]) => `${ESTADO_LABEL[est] || est}: ${n}`)
          .join(" · ");

        // Banda azul con nombre del técnico
        doc.setFillColor(...COLOR_AZUL);
        doc.roundedRect(margin, cursorY, pageW() - margin * 2, 22, 3, 3, "F");
        doc.setTextColor(...COLOR_BLANCO);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text(nombreCompleto, margin + 10, cursorY + 14);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...COLOR_AMARILLO);
        doc.text(
          `${t.identificacion || "—"} · ${t.ciudad || "—"} · ${row.totalEquipos} equipo${row.totalEquipos !== 1 ? "s" : ""}`,
          pageW() - margin - 10,
          cursorY + 14,
          { align: "right" }
        );
        cursorY += 26;

        if (resumenEstados) {
          doc.setFontSize(8);
          doc.setTextColor(...COLOR_GRIS_TEXTO);
          doc.text(resumenEstados, margin + 2, cursorY + 2);
          cursorY += 12;
        }

        // Tabla de equipos
        autoTable(doc, {
          startY: cursorY,
          head: [["IMEI", "Serial", "Marca/Modelo", "Estado", "Condición", "Placa"]],
          body: (row.equipos || []).map((e) => [
            e.imei || "—",
            e.serial || "—",
            `${e.marca || ""} ${e.modelo || ""}`.trim() || "—",
            ESTADO_LABEL[e.estado] || e.estado || "—",
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
  }

  /* ── Inventario por ciudad (detalle; los modelos en 0 no salen) ── */
  if (secciones.ciudades) {
    const tablaCiudad = data?.tablaPorCiudad || {};
    const ciudades = prepararCiudades(data);

    iniciarSeccion({ enPaginaNueva: true });
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
        if (cursorY > pageH() - 130) { cursorY = nuevaPagina(); }

        // Banda con nombre de ciudad
        doc.setFillColor(...COLOR_AZUL);
        doc.roundedRect(margin, cursorY, pageW() - margin * 2, 22, 3, 3, "F");
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
          pageW() - margin - 10,
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
  }

  /* ── Consolidado: matriz equipos × ciudades ── */
  if (secciones.consolidado) {
    const matriz = construirMatrizEquiposCiudades(data);
    const horizontal = matriz.columnas.length > MAX_CIUDADES_VERTICAL;

    iniciarSeccion({ enPaginaNueva: true, orientation: horizontal ? "landscape" : "portrait" });
    cursorY = seccionTitulo(doc, "Consolidado — equipos por ciudad", cursorY, margin);
    doc.setFontSize(9);
    doc.setTextColor(...COLOR_GRIS_TEXTO);
    doc.text(
      "Cada fila es un equipo (marca y modelo) y cada columna una ciudad. Los equipos y ciudades sin stock no se muestran.",
      margin,
      cursorY
    );
    cursorY += 18;

    if (matriz.filas.length === 0) {
      textoVacio(doc, "Sin datos consolidados", cursorY, margin);
    } else {
      const head = [["Equipo", ...matriz.columnas.map((c) => c.etiqueta), "Total"]];
      const body = matriz.filas.map((f) => [
        f.equipo,
        ...matriz.columnas.map((c) => f.porCiudad[c.nombre] || 0),
        f.total,
      ]);
      const foot = [[
        "TOTAL GENERAL",
        ...matriz.columnas.map((c) => c.total),
        matriz.totalGeneral,
      ]];

      // Columnas numéricas alineadas a la derecha; la última en negrita
      const columnStyles = {};
      for (let i = 1; i <= matriz.columnas.length; i++) {
        columnStyles[i] = { halign: "right" };
      }
      columnStyles[matriz.columnas.length + 1] = {
        halign: "right",
        fontStyle: "bold",
        textColor: COLOR_AZUL,
      };

      autoTable(doc, {
        startY: cursorY,
        head,
        body,
        foot,
        theme: "grid",
        styles: { fontSize: horizontal ? 8 : 9, cellPadding: 4, overflow: "linebreak" },
        headStyles: { fillColor: COLOR_AZUL, textColor: COLOR_BLANCO, fontStyle: "bold", halign: "center" },
        alternateRowStyles: { fillColor: COLOR_GRIS_SUAVE },
        footStyles: {
          fillColor: COLOR_AMARILLO,
          textColor: COLOR_AZUL,
          fontStyle: "bold",
          fontSize: horizontal ? 8 : 10,
          halign: "right",
        },
        columnStyles: { 0: { fontStyle: "bold", halign: "left" }, ...columnStyles },
        margin: { left: margin, right: margin, bottom: 30 },
      });
    }
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
