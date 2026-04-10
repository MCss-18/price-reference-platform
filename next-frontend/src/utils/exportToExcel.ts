import * as XLSX from "xlsx-js-style"

export interface ColumnConfig<T> {
  key: keyof T;
  label: string;
  excluded?: boolean;
}

const GREEN = "2E7D32";
const WHITE = "FFFFFF";

function buildHeaderStyle() {
  return {
    fill: { fgColor: { rgb: GREEN } },
    font: { color: { rgb: WHITE }, bold: true },
    alignment: { horizontal: "center" },
  };
}

function applyStylesToRow(ws: XLSX.WorkSheet, rowIndex: number, colCount: number, style: object) {
  for (let col = 0; col < colCount; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: rowIndex, c: col });
    if (ws[cellRef]) {
      ws[cellRef].s = style;
    }
  }
}

function setColumnWidths(ws: XLSX.WorkSheet, labels: string[]) {
  ws["!cols"] = labels.map((label) => ({ wch: Math.max(label.length + 4, 16) }));
}

export const exportToExcel = <T extends object>(
  data: T[],
  fileName: string = "Exportado.xlsx",
  columns?: ColumnConfig<T>[],
  note?: string
) => {
  if (!data.length) {
    console.warn("No hay datos para exportar");
    return;
  }

  const activeColumns = columns?.filter((c) => !c.excluded) ?? [];
  const labels = activeColumns.map((c) => c.label);
  const colCount = labels.length;

  const disclaimer =
    note ??
    "* Los precios están expresados en soles (PEN). Las compras en dólares (USD) fueron convertidas usando el tipo de cambio de la fecha. Los precios incluyen IGV. Estos datos son recopilados del ERP de la empresa.";

  // Fila 0: título/encabezado principal (celdas fusionadas A1:últimaColumna1)
  // Fila 1: nota/disclaimer
  // Fila 2: vacía
  // Fila 3: encabezados de columna
  // Fila 4+: datos

  const titleRow = ["Lista de Presupuesto", ...Array(colCount - 1).fill("")];
  const noteRow = [disclaimer, ...Array(colCount - 1).fill("")];
  const emptyRow = Array(colCount).fill("");
  const headerRow = labels;
  const dataRows = data.map((row) =>
    activeColumns.map(({ key }) => row[key] ?? "")
  );

  const aoa = [titleRow, noteRow, emptyRow, headerRow, ...dataRows];

  const ws = XLSX.utils.aoa_to_sheet(aoa);

  // Fusionar A1 hasta última columna para el título
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: colCount - 1 } }, // título
    { s: { r: 1, c: 0 }, e: { r: 1, c: colCount - 1 } }, // nota
  ];

  const headerStyle = buildHeaderStyle();
  const noteStyle = {
    font: { italic: true, color: { rgb: "555555" } },
    alignment: { wrapText: true },
  };
  const titleStyle = {
    fill: { fgColor: { rgb: GREEN } },
    font: { color: { rgb: WHITE }, bold: true, sz: 13 },
    alignment: { horizontal: "center", vertical: "center" },
  };

  // Aplicar estilo al título (fila 0)
  const titleCell = ws["A1"];
  if (titleCell) titleCell.s = titleStyle;

  // Aplicar estilo a la nota (fila 1)
  const noteCell = ws["A2"];
  if (noteCell) noteCell.s = noteStyle;

  // Aplicar estilo verde a encabezados de columna (fila 3, índice 3)
  applyStylesToRow(ws, 3, colCount, headerStyle);

  // Altura de filas
  ws["!rows"] = [
    { hpt: 22 }, // título
    { hpt: 36 }, // nota (más alta por el wrap)
    { hpt: 8 },  // vacía
    { hpt: 18 }, // encabezados
  ];

  setColumnWidths(ws, labels);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Presupuesto");
  XLSX.writeFile(wb, fileName);
};