import React, { useEffect, useState } from "react";
import { fetchReports } from "@utils/api";

export default function ReportsList() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, year

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No se encontró token de autenticación.");
      setLoading(false);
      window.location.href = "/";
      return;
    }

    fetchReports(token)
      .then((data) => {
        setReports(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Obtener años únicos para el filtro
  const uniqueYears = [...new Set(reports.map(r => r.year))].sort((a, b) => b - a);

  // Filtrar reportes
  const filteredReports = filter === "all" 
    ? reports 
    : reports.filter(r => r.year === parseInt(filter));

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center border border-red-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Error al cargar reportes</h3>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!reports || reports.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No hay reportes aún</h3>
          <p className="text-gray-600 mb-6">Comienza a agregar tus ingresos y gastos para generar reportes</p>
          <a 
            href="/dashboard"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Ir al Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Mis Reportes Financieros
            </h2>
            <p className="text-gray-600">
              Historial completo de tus movimientos mensuales
            </p>
          </div>

          {/* Filtros y Stats */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Reportes</p>
                <p className="text-2xl font-bold text-gray-900">{filteredReports.length}</p>
              </div>
              <div className="h-10 w-px bg-gray-200"></div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Años</p>
                <p className="text-2xl font-bold text-gray-900">{uniqueYears.length}</p>
              </div>
            </div>

            {/* Filtro por año */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Filtrar:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">Todos los años</option>
                {uniqueYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Grid de Reportes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Header del Card */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-6 border-b border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold capitalize text-gray-900">
                      {report.month}
                    </h3>
                    <p className="text-gray-600 text-lg font-semibold">{report.year}</p>
                  </div>
                </div>

                {/* Liquidación destacada */}
                <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-sm">
                  <p className="text-sm text-gray-600 mb-1">Balance Final</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    ${report.liquidacion.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Contenido del Card */}
              <div className="p-6 space-y-4">
                {/* Métricas principales */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                      </svg>
                      <p className="text-xs font-semibold text-green-700">Ingresos</p>
                    </div>
                    <p className="text-lg font-bold text-green-800">
                      ${report.total_ingreso_bruto.toFixed(2)}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Neto: ${report.ingresos_netos.toFixed(2)}
                    </p>
                  </div>

                  <div className="bg-red-50 rounded-xl p-3 border border-red-100">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.293l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414L9 10.586V7a1 1 0 112 0v3.586l1.293-1.293a1 1 0 011.414 1.414z" clipRule="evenodd" />
                      </svg>
                      <p className="text-xs font-semibold text-red-700">Gastos</p>
                    </div>
                    <p className="text-lg font-bold text-red-800">
                      ${report.total_gastos.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Compromisos religiosos */}
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                    <p className="text-sm font-semibold text-purple-700">Compromisos</p>
                  </div>
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

                {/* Botones de acción */}
                <div className="flex gap-2 pt-2">
                  <a
                    href={`/edit-report/${report.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition-all duration-200 font-medium border border-amber-200 group-hover:border-amber-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className="text-sm">Editar</span>
                  </a>
                  <a
                    href={`/delete-report/${report.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-200 font-medium border border-red-200 group-hover:border-red-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="text-sm">Eliminar</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

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