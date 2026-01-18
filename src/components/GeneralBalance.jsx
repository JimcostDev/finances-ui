import React, { useState, useEffect } from "react";
import { fetchGeneralBalance } from "../utils/api";

export default function GeneralBalance() {
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBalance = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const data = await fetchGeneralBalance(token);
        setReport(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadBalance();
  }, []);

  const handleGeneratePDF = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = margin;

    const addCenteredText = (text, y, fontSize = 12, isBold = false) => {
      doc.setFontSize(fontSize);
      if (isBold) doc.setFont(undefined, "bold");
      else doc.setFont(undefined, "normal");
      const textWidth = doc.getTextWidth(text);
      doc.text(text, (pageWidth - textWidth) / 2, y);
    };

    // Header (Azul consistente con AnnualReport)
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageWidth, 40, "F");
    doc.setTextColor(255, 255, 255);
    addCenteredText("Balance General Histórico", 20, 20, true);
    addCenteredText(`MyFinances - Acumulado Total`, 30, 12);

    yPos = 50;
    doc.setTextColor(0, 0, 0);

    // Balance destacado
    doc.setFillColor(239, 246, 255); // Azul claro
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 25, 3, 3, "F");
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text("Liquidación Total Acumulada", margin + 5, yPos + 8);
    doc.setFontSize(18);
    doc.setTextColor(37, 99, 235);
    doc.setFont(undefined, "bold");
    doc.text(`${parseFloat(report.liquidacion_final).toFixed(2)}`, margin + 5, yPos + 20);

    yPos += 35;

    // Métricas
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "bold");
    doc.text("Resumen Financiero", margin, yPos);
    yPos += 10;

    // Ingresos (Con Neto agregado)
    doc.setFillColor(240, 253, 244); // Verde claro
    doc.roundedRect(margin, yPos, (pageWidth - 2 * margin - 5) / 2, 20, 2, 2, "F");
    doc.setFontSize(9);
    doc.setTextColor(21, 128, 61); // Verde oscuro
    doc.setFont(undefined, "bold");
    doc.text("INGRESOS BRUTO", margin + 3, yPos + 6);
    doc.setFontSize(12);
    doc.setTextColor(22, 101, 52);
    doc.text(`${parseFloat(report.total_ingreso_bruto).toFixed(2)}`, margin + 3, yPos + 13);
    // Neto pequeño
    doc.setFontSize(8);
    doc.setTextColor(22, 163, 74);
    doc.text(`Neto: ${parseFloat(report.total_ingreso_neto).toFixed(2)}`, margin + 3, yPos + 18);


    // Gastos
    const xPosRight = margin + (pageWidth - 2 * margin - 5) / 2 + 5;
    doc.setFillColor(254, 242, 242); // Rojo claro
    doc.roundedRect(xPosRight, yPos, (pageWidth - 2 * margin - 5) / 2, 20, 2, 2, "F");
    doc.setFontSize(9);
    doc.setTextColor(153, 27, 27); // Rojo oscuro
    doc.setFont(undefined, "bold");
    doc.text("TOTAL GASTOS", xPosRight + 3, yPos + 6);
    doc.setFontSize(12);
    doc.setTextColor(153, 27, 27);
    doc.text(`${parseFloat(report.total_gastos).toFixed(2)}`, xPosRight + 3, yPos + 13);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.setFont(undefined, "normal");
    addCenteredText(`Generado el ${new Date().toLocaleDateString()}`, pageHeight - 12, 8);

    doc.save(`Balance_General_MyFinances.pdf`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-3">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 font-medium">Calculando balance histórico...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mx-auto max-w-2xl mt-8">
        <p className="text-red-700 font-medium">{error}</p>
      </div>
    );
  }

  return (
    // Fondo cambiado a Azul-Verde suave
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-green-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 space-y-2">
          {/* Título Azul-Verde */}
          <h2 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Balance General
          </h2>
          <p className="text-gray-600">
            Resumen histórico de todos tus movimientos financieros
          </p>
        </div>

        {report && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in">
            {/* Header Balance */}
            <div className="bg-linear-to-br from-gray-50 to-white p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Liquidación Total</p>
                  {/* Balance con degradado Azul-Verde */}
                  <p className="text-4xl font-bold bg-linear-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    ${parseFloat(report.liquidacion_final).toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    HISTÓRICO
                  </span>
                </div>
              </div>
            </div>

            {/* Métricas */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Ingresos con Neto agregado */}
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <p className="text-xs font-medium text-green-700 mb-1">Ingresos Bruto</p>
                  <p className="text-2xl font-bold text-green-800">
                    ${parseFloat(report.total_ingreso_bruto).toFixed(2)}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Neto: ${parseFloat(report.total_ingreso_neto).toFixed(2)}
                  </p>
                </div>

                {/* Gastos */}
                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                  <p className="text-xs font-medium text-red-700 mb-1">Total Gastos</p>
                  <p className="text-2xl font-bold text-red-800">
                    ${parseFloat(report.total_gastos).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Compromisos Totales  */}
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 mt-4">
                <p className="text-xs font-medium text-purple-700 mb-3">Aportes a Iglesia (Total)</p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-purple-600">Diezmos</p>
                    <p className="text-lg font-bold text-purple-900">${parseFloat(report.total_diezmos).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-purple-600">Ofrendas</p>
                    <p className="text-lg font-bold text-purple-900">${parseFloat(report.total_ofrendas).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-purple-600">Total</p>
                    <p className="text-lg font-bold text-purple-900">${parseFloat(report.total_iglesia).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <button
                onClick={handleGeneratePDF}
                // Botón Azul para igualar al reporte anual
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Descargar Reporte General PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}