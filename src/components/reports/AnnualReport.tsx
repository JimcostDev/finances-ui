import React, { useState, type SubmitEventHandler } from "react";
import type { IFinancialSummary } from "@interfaces";
import { fetchAnnualReport } from "@services";
import { getErrorMessage } from "@utils/error";
import { useChurchContributions } from "../dashboard/ChurchContributionsContext";

export default function AnnualReport() {
  const churchEnabled = useChurchContributions();
  const [selectedYear, setSelectedYear] = useState("");
  const [report, setReport] = useState<IFinancialSummary | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleFetch = async (year: number) => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAnnualReport(year);
      setReport(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Error al obtener el reporte anual"));
    }
    setLoading(false);
  };

  const handleManualSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!selectedYear) {
      setError("Por favor, selecciona un año.");
      return;
    }
    handleFetch(Number(selectedYear));
  };

  const handleCurrentDate = () => {
    const year = new Date().getFullYear();
    setSelectedYear(String(year));
    handleFetch(year);
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
                      {`$${report.liquidacion_final.toFixed(2)}`}
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
                      {`$${report.total_ingreso_bruto.toFixed(2)}`}
                    </p>
                    {churchEnabled && (
                      <p className="text-xs text-green-600 mt-1">
                        {`Neto: $${report.total_ingreso_neto.toFixed(2)}`}
                      </p>
                    )}
                  </div>

                  {/* Gastos */}
                  <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                    <p className="text-xs font-medium text-red-700 mb-1">
                      Gastos
                    </p>
                    <p className="text-2xl font-bold text-red-800">
                      {`$${report.total_gastos.toFixed(2)}`}
                    </p>
                  </div>
                </div>

                {churchEnabled && (
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                    <p className="text-xs font-medium text-purple-700 mb-3">
                      Compromisos Anuales
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-xs text-purple-600">Diezmos</p>
                        <p className="text-lg font-bold text-purple-900">
                          {`$${report.total_diezmos.toFixed(2)}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-purple-600">Ofrendas</p>
                        <p className="text-lg font-bold text-purple-900">
                          {`$${report.total_ofrendas.toFixed(2)}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-purple-600">Total</p>
                        <p className="text-lg font-bold text-purple-900">
                          {`$${report.total_iglesia.toFixed(2)}`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Estadísticas adicionales */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <p className="text-xs text-blue-600 mb-1">
                      Promedio Mensual Ingresos
                    </p>
                    <p className="text-xl font-bold text-blue-800">
                      {`$${(report.total_ingreso_bruto / 12).toFixed(2)}`}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-xl">
                    <p className="text-xs text-orange-600 mb-1">
                      Promedio Mensual Gastos
                    </p>
                    <p className="text-xl font-bold text-orange-800">
                      {`$${(report.total_gastos / 12).toFixed(2)}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setReport(null);
                  setSelectedYear("");
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold border border-gray-300"
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
