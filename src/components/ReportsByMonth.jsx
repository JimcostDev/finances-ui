import React, { useState, useEffect } from "react";
import { fetchReportsByMonth } from "../utils/api";
import Title from "./Title";

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
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Title as="h2" className="mb-8 text-center">
          Reportes por Mes
        </Title>

        <div className="space-y-6">
          <button
            onClick={handleCurrentDate}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Fecha actual
          </button>

          <form onSubmit={handleManualSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mes
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Seleccionar mes</option>
                  {monthOptions.map((mes) => (
                    <option key={mes} value={mes}>
                      {mes.charAt(0).toUpperCase() + mes.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Año
                </label>
                <input
                  type="number"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Ej. 2025"
                  min="2000"
                  max="2100"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Obtener Reportes
            </button>
          </form>

          {loading && (
            <p className="text-center text-gray-600 animate-pulse">
              Cargando reportes...
            </p>
          )}

          {error && (
            <p className="text-center text-red-600 bg-red-50 py-2 px-4 rounded-lg">
              {error}
            </p>
          )}

          {reports.length > 0 && (
            <div className="mt-8 space-y-6">
              <Title as="h3" className="text-center">
                Reportes Encontrados
              </Title>

              {/* 
                Ajuste en la cuadrícula:
                - 1 columna en pantallas pequeñas
                - 2 columnas a partir de md (768px) si lo deseas
              */}
              <ul className="grid grid-cols-1 md:grid-cols-1 gap-4">
                {reports.map((report) => (
                  <li
                    key={report.id}
                    className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    {/* Contenedor principal */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4 sm:mb-6 pb-2 sm:pb-4 border-b border-gray-200">
                      {/* Fecha */}
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 order-1">
                        {report.month.charAt(0).toUpperCase() +
                          report.month.slice(1)}{" "}
                        {report.year}
                      </h3>

                      {/* Botones - se moverán encima en móviles gracias a order */}
                      <div className="flex gap-2 order-2 sm:order-3">
                        <a
                          href={`/edit-report/${report.id}`}
                          className="px-3 py-2 text-sm sm:text-base bg-amber-50 text-yellow-700 rounded-lg hover:bg-yellow-100 hover:text-yellow-800 transition-colors"
                        >
                          Editar
                        </a>
                        <a
                          href={`/delete-report/${report.id}`}
                          className="px-3 py-2 text-sm sm:text-base bg-red-50 text-red-700 rounded-lg hover:bg-red-100 hover:text-red-800 transition-colors"
                        >
                          Eliminar
                        </a>
                      </div>
                    </div>

                    {/* Cuadrícula interna */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      {/* Columna Izquierda */}
                      <div className="space-y-4">
                        <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                          <p className="text-xs sm:text-sm font-medium text-green-700">
                            Ingreso Bruto
                          </p>
                          <p className="text-base sm:text-xl font-bold text-green-800">
                            ${report.total_ingreso_bruto.toFixed(2)}
                          </p>
                        </div>
                        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                          <p className="text-xs sm:text-sm font-medium text-blue-700">
                            Ingresos Netos
                          </p>
                          <p className="text-base sm:text-xl font-bold text-blue-800">
                            ${report.ingresos_netos.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Columna Derecha */}
                      <div className="space-y-4">
                        <div className="bg-red-50 p-3 sm:p-4 rounded-lg">
                          <p className="text-xs sm:text-sm font-medium text-red-700">
                            Total Gastos
                          </p>
                          <p className="text-base sm:text-xl font-bold text-red-800">
                            ${report.total_gastos.toFixed(2)}
                          </p>
                        </div>
                        <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                          <p className="text-xs sm:text-sm font-medium text-purple-700">
                            Liquidación
                          </p>
                          <p className="text-base sm:text-xl font-bold text-purple-800">
                            ${report.liquidacion.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Detalles Adicionales */}
                    <div className="mt-4 sm:mt-6 pt-2 sm:pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Diezmos
                        </p>
                        <p className="text-sm sm:text-base font-medium text-gray-900">
                          ${report.diezmos.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Ofrendas
                        </p>
                        <p className="text-sm sm:text-base font-medium text-gray-900">
                          ${report.ofrendas.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Iglesia
                        </p>
                        <p className="text-sm sm:text-base font-medium text-gray-900">
                          ${report.iglesia.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
