import React, { useState, useEffect } from "react";
import { fetchReportsByMonth } from "../utils/api";

const monthOptions = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

export default function ReportsByMonth() {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const handleFetch = async (month, year) => {
    if (!token) {
      setError("No hay token disponible");
      window.location.href = "/";
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await fetchReportsByMonth(month, year, token);
      setReports(data);
    } catch (err) {
      setError(err.message || "Error al obtener reportes");
    }
    setLoading(false);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!selectedMonth || !selectedYear) {
      setError("Por favor, selecciona mes y año.");
      return;
    }
    handleFetch(selectedMonth, Number(selectedYear));
  };

  const handleCurrentDate = () => {
    const now = new Date();
    const month = monthOptions[now.getMonth()];
    const year = now.getFullYear();
    setSelectedMonth(month);
    setSelectedYear(year);
    handleFetch(month, year);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Consultar Reportes
          </h2>
          <p className="text-gray-600">
            Busca reportes por mes y año específico
          </p>
        </div>

        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 space-y-6">
          {/* Botón fecha actual */}
          <button
            onClick={handleCurrentDate}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Ver Reporte del Mes Actual</span>
          </button>

          {/* Separador */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-sm text-gray-500 font-medium">
                O selecciona manualmente
              </span>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleManualSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Selector de mes */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Mes
                </label>
                <div className="relative">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="block w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                  >
                    <option value="">Seleccionar mes</option>
                    {monthOptions.map((mes) => (
                      <option key={mes} value={mes}>
                        {mes.charAt(0).toUpperCase() + mes.slice(1)}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Input de año */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Año
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Ej. 2025"
                    min="2000"
                    max="2100"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Botón buscar */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Buscar Reportes</span>
            </button>
          </form>

          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-8 space-y-3">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 font-medium">Buscando reportes...</p>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Resultados */}
        {reports.length > 0 && !loading && (
          <div className="mt-8 space-y-6">
            {/* Header de resultados */}
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">
                Reportes Encontrados
              </h3>
              <p className="text-gray-600">
                Se encontraron {reports.length} {reports.length === 1 ? 'reporte' : 'reportes'}
              </p>
            </div>

            {/* Lista de reportes */}
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  {/* Header del Card - Compacto */}
                  <div className="bg-white p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-bold capitalize text-gray-900">
                          {report.month} {report.year}
                        </h3>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600 mb-1">Balance Final</p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                          ${report.liquidacion.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contenido del Card - Compacto */}
                  <div className="p-4 space-y-3">
                    {/* Métricas principales */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                        <p className="text-xs font-medium text-green-700 mb-1">Ingresos</p>
                        <p className="text-lg font-bold text-green-800">
                          ${report.total_ingreso_bruto.toFixed(2)}
                        </p>
                        <p className="text-xs text-green-600">
                          Neto: ${report.ingresos_netos.toFixed(2)}
                        </p>
                      </div>

                      <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                        <p className="text-xs font-medium text-red-700 mb-1">Gastos</p>
                        <p className="text-lg font-bold text-red-800">
                          ${report.total_gastos.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Compromisos religiosos - Compacto */}
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                      <p className="text-xs font-medium text-purple-700 mb-2">Compromisos</p>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <p className="text-xs text-purple-600">Diezmos</p>
                          <p className="text-sm font-bold text-purple-900">
                            ${report.diezmos.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-purple-600">Ofrendas</p>
                          <p className="text-sm font-bold text-purple-900">
                            ${report.ofrendas.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-purple-600">Total</p>
                          <p className="text-sm font-bold text-purple-900">
                            ${report.iglesia.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Botones de acción - Compacto */}
                    <div className="flex gap-2">
                      <a
                        href={`/edit-report/${report.id}`}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-all duration-200 text-sm font-medium border border-amber-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Editar</span>
                      </a>
                      <a
                        href={`/delete-report/${report.id}`}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-all duration-200 text-sm font-medium border border-red-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Eliminar</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botón flotante para volver */}
        <a
          href="/dashboard"
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full shadow-2xl hover:shadow-3xl flex items-center justify-center transform hover:scale-110 transition-all duration-300 z-50"
          title="Volver al Dashboard"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </a>
      </div>
    </div>
  );
}