import React, { useState, useEffect } from "react";
import { fetchAnnualReport } from "@utils/api";

export default function AnnualReport() {
  const [selectedYear, setSelectedYear] = useState("");
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const handleFetch = async (year) => {
    if (!token) {
      setError("No hay token disponible");
      window.location.href = "/";
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await fetchAnnualReport(Number(year), token);
      setReport(data);
    } catch (err) {
      setError(err.message || "Error al obtener el reporte anual");
    }
    setLoading(false);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!selectedYear) {
      setError("Por favor, selecciona un año.");
      return;
    }
    handleFetch(selectedYear);
  };

  const handleCurrentDate = () => {
    const year = new Date().getFullYear();
    setSelectedYear(year);
    handleFetch(year);
  };

  const handleGeneratePDF = async () => {
    // Importar jsPDF dinámicamente
    const { jsPDF } = await import("jspdf");

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = margin;

    // Función auxiliar para agregar texto centrado
    const addCenteredText = (text, y, fontSize = 12, isBold = false) => {
      doc.setFontSize(fontSize);
      if (isBold) doc.setFont(undefined, "bold");
      else doc.setFont(undefined, "normal");
      const textWidth = doc.getTextWidth(text);
      doc.text(text, (pageWidth - textWidth) / 2, y);
    };

    // Función para agregar línea horizontal
    const addLine = (y) => {
      doc.setDrawColor(59, 130, 246); // Azul
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
    };

    // Header
    doc.setFillColor(37, 99, 235); // Azul
    doc.rect(0, 0, pageWidth, 40, "F");
    doc.setTextColor(255, 255, 255);
    addCenteredText("Reporte Anual MyFinances", 20, 20, true);
    addCenteredText(`Año ${report.year}`, 30, 12);

    yPos = 50;
    doc.setTextColor(0, 0, 0);

    // Balance destacado
    doc.setFillColor(239, 246, 255); // Fondo azul claro
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 25, 3, 3, "F");
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text("Balance Anual", margin + 5, yPos + 8);
    doc.setFontSize(18);
    doc.setTextColor(37, 99, 235);
    doc.setFont(undefined, "bold");
    doc.text(
      `${parseFloat(report.liquidacion_final).toFixed(2)}`,
      margin + 5,
      yPos + 20
    );

    yPos += 35;

    // Sección de Ingresos y Gastos
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "bold");
    doc.text("Métricas Principales", margin, yPos);
    yPos += 10;

    // Ingresos
    doc.setFillColor(240, 253, 244); // Verde claro
    doc.roundedRect(
      margin,
      yPos,
      (pageWidth - 2 * margin - 5) / 2,
      20,
      2,
      2,
      "F"
    );
    doc.setFontSize(9);
    doc.setTextColor(21, 128, 61);
    doc.setFont(undefined, "bold");
    doc.text("INGRESOS BRUTO", margin + 3, yPos + 6);
    doc.setFontSize(12);
    doc.setTextColor(22, 101, 52);
    doc.text(
      `${parseFloat(report.total_ingreso_bruto).toFixed(2)}`,
      margin + 3,
      yPos + 13
    );
    doc.setFontSize(8);
    doc.setTextColor(22, 163, 74);
    doc.text(
      `Neto: ${parseFloat(report.total_ingreso_neto).toFixed(2)}`,
      margin + 3,
      yPos + 18
    );

    // Gastos
    const xPosRight = margin + (pageWidth - 2 * margin - 5) / 2 + 5;
    doc.setFillColor(254, 242, 242); // Rojo claro
    doc.roundedRect(
      xPosRight,
      yPos,
      (pageWidth - 2 * margin - 5) / 2,
      20,
      2,
      2,
      "F"
    );
    doc.setFontSize(9);
    doc.setTextColor(153, 27, 27);
    doc.setFont(undefined, "bold");
    doc.text("GASTOS", xPosRight + 3, yPos + 6);
    doc.setFontSize(12);
    doc.setTextColor(153, 27, 27);
    doc.text(
      `${parseFloat(report.total_gastos).toFixed(2)}`,
      xPosRight + 3,
      yPos + 13
    );

    yPos += 30;

    // Compromisos Religiosos
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "bold");
    doc.text("Compromisos Anuales", margin, yPos);
    yPos += 10;

    doc.setFillColor(250, 245, 255); // Morado claro
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 25, 2, 2, "F");

    const colWidth = (pageWidth - 2 * margin) / 3;
    doc.setFontSize(8);
    doc.setTextColor(124, 58, 237);
    doc.text("Diezmos", margin + 5, yPos + 7);
    doc.text("Ofrendas", margin + colWidth + 5, yPos + 7);
    doc.text("Total", margin + 2 * colWidth + 5, yPos + 7);

    doc.setFontSize(11);
    doc.setTextColor(88, 28, 135);
    doc.setFont(undefined, "bold");
    doc.text(
      `${parseFloat(report.total_diezmos).toFixed(2)}`,
      margin + 5,
      yPos + 15
    );
    doc.text(
      `${parseFloat(report.total_ofrendas).toFixed(2)}`,
      margin + colWidth + 5,
      yPos + 15
    );
    doc.text(
      `${parseFloat(report.total_iglesia).toFixed(2)}`,
      margin + 2 * colWidth + 5,
      yPos + 15
    );

    yPos += 35;

    // Promedios Mensuales
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "bold");
    doc.text("Promedios Mensuales", margin, yPos);
    yPos += 10;

    // Promedio Ingresos
    doc.setFillColor(219, 234, 254); // Azul claro
    doc.roundedRect(
      margin,
      yPos,
      (pageWidth - 2 * margin - 5) / 2,
      15,
      2,
      2,
      "F"
    );
    doc.setFontSize(8);
    doc.setTextColor(30, 64, 175);
    doc.text("Promedio Ingresos", margin + 3, yPos + 5);
    doc.setFontSize(11);
    doc.setTextColor(30, 58, 138);
    doc.setFont(undefined, "bold");
    doc.text(
      `${(parseFloat(report.total_ingreso_bruto) / 12).toFixed(2)}`,
      margin + 3,
      yPos + 12
    );

    // Promedio Gastos
    doc.setFillColor(254, 215, 170); // Naranja claro
    doc.roundedRect(
      xPosRight,
      yPos,
      (pageWidth - 2 * margin - 5) / 2,
      15,
      2,
      2,
      "F"
    );
    doc.setFontSize(8);
    doc.setTextColor(194, 65, 12);
    doc.text("Promedio Gastos", xPosRight + 3, yPos + 5);
    doc.setFontSize(11);
    doc.setTextColor(154, 52, 18);
    doc.setFont(undefined, "bold");
    doc.text(
      `${(parseFloat(report.total_gastos) / 12).toFixed(2)}`,
      xPosRight + 3,
      yPos + 12
    );

    yPos += 25;

    // Footer
    addLine(pageHeight - 20);
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.setFont(undefined, "normal");
    const footerText = `MyFinances - Generado el ${new Date().toLocaleDateString(
      "es-ES",
      { year: "numeric", month: "long", day: "numeric" }
    )}`;
    addCenteredText(footerText, pageHeight - 12, 8);

    // Guardar PDF
    doc.save(`Reporte_Anual_${report.year}_MyFinances.pdf`);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-green-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Reporte Anual
          </h2>
          <p className="text-gray-600">
            Visualiza el resumen completo de un año específico
          </p>
        </div>

        {/* Card de búsqueda */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 space-y-6 mb-8">
          {/* Botón año actual */}
          <button
            onClick={handleCurrentDate}
            className="w-full flex items-center justify-center gap-3 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Ver Año Actual ({new Date().getFullYear()})</span>
          </button>

          {/* Separador */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-sm text-gray-500 font-medium">
                O selecciona otro año
              </span>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleManualSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Año
              </label>
              <input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Ej. 2024"
                min="2000"
                max="2100"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <span>Generar Reporte</span>
            </button>
          </form>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-8 space-y-3">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 font-medium">
                Generando reporte anual...
              </p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <svg
                className="w-5 h-5 text-red-600 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Resultado */}
        {report && !loading && (
          <div className="space-y-6 animate-fade-in">
            {/* Vista en pantalla - VISIBLE */}
            {/* Card principal del reporte */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Header del card - Balance destacado */}
              <div className="bg-linear-to-br from-gray-50 to-white p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Balance Anual</p>
                    <p className="text-4xl font-bold bg-linear-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                      ${parseFloat(report.liquidacion_final).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Año</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {report.year}
                    </p>
                  </div>
                </div>
              </div>

              {/* Métricas principales */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Ingresos */}
                  <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                    <p className="text-xs font-medium text-green-700 mb-1">
                      Ingresos Bruto
                    </p>
                    <p className="text-2xl font-bold text-green-800">
                      ${parseFloat(report.total_ingreso_bruto).toFixed(2)}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Neto: ${parseFloat(report.total_ingreso_neto).toFixed(2)}
                    </p>
                  </div>

                  {/* Gastos */}
                  <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                    <p className="text-xs font-medium text-red-700 mb-1">
                      Gastos
                    </p>
                    <p className="text-2xl font-bold text-red-800">
                      ${parseFloat(report.total_gastos).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Compromisos religiosos */}
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <p className="text-xs font-medium text-purple-700 mb-3">
                    Compromisos Anuales
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-purple-600">Diezmos</p>
                      <p className="text-lg font-bold text-purple-900">
                        ${parseFloat(report.total_diezmos).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-purple-600">Ofrendas</p>
                      <p className="text-lg font-bold text-purple-900">
                        ${parseFloat(report.total_ofrendas).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-purple-600">Total</p>
                      <p className="text-lg font-bold text-purple-900">
                        ${parseFloat(report.total_iglesia).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Estadísticas adicionales */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <p className="text-xs text-blue-600 mb-1">
                      Promedio Mensual Ingresos
                    </p>
                    <p className="text-xl font-bold text-blue-800">
                      $
                      {(parseFloat(report.total_ingreso_bruto) / 12).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-xl">
                    <p className="text-xs text-orange-600 mb-1">
                      Promedio Mensual Gastos
                    </p>
                    <p className="text-xl font-bold text-orange-800">
                      ${(parseFloat(report.total_gastos) / 12).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3">
              <button
                onClick={handleGeneratePDF}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                <span>Descargar PDF</span>
              </button>
              <button
                onClick={() => {
                  setReport(null);
                  setSelectedYear("");
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold border border-gray-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Nueva Búsqueda</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
