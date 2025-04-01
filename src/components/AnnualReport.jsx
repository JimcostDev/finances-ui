import React, { useState, useEffect } from "react";
import { fetchAnnualReport } from "../utils/api"; // Cambiar a API adecuada
import Title from "./Title";

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

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Title as="h2" className="mb-8 text-center">
          Reporte Anual
        </Title>

        <div className="space-y-6">
          <button
            onClick={handleCurrentDate}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Año actual
          </button>

          <form onSubmit={handleManualSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
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
              Obtener Reporte Anual
            </button>
          </form>

          {loading && (
            <p className="text-center text-gray-600 animate-pulse">
              Cargando reporte anual...
            </p>
          )}

          {error && (
            <p className="text-center text-red-600 bg-red-50 py-2 px-4 rounded-lg">
              {error}
            </p>
          )}

          {report && (
            <div className="mt-8 space-y-6">
              <Title as="h3" className="text-center">
                Reporte Anual {report.year}
              </Title>

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  {/* Encabezado */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4 sm:mb-6 pb-2 sm:pb-4 border-b border-gray-200">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                      Resumen Anual {report.year}
                    </h3>
                  </div>

                  {/* Métricas principales */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {/* Columna Izquierda */}
                    <div className="space-y-4">
                      <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                        <p className="text-xs sm:text-sm font-medium text-green-700">
                          Ingreso Bruto Anual
                        </p>
                        <p className="text-base sm:text-xl font-bold text-green-800">
                          ${report.total_ingreso_bruto}
                        </p>
                      </div>
                      <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                        <p className="text-xs sm:text-sm font-medium text-blue-700">
                          Ingresos Netos Anuales
                        </p>
                        <p className="text-base sm:text-xl font-bold text-blue-800">
                          ${report.total_ingreso_neto}
                        </p>
                      </div>
                    </div>

                    {/* Columna Derecha */}
                    <div className="space-y-4">
                      <div className="bg-red-50 p-3 sm:p-4 rounded-lg">
                        <p className="text-xs sm:text-sm font-medium text-red-700">
                          Gastos Anuales
                        </p>
                        <p className="text-base sm:text-xl font-bold text-red-800">
                          ${report.total_gastos}
                        </p>
                      </div>
                      <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                        <p className="text-xs sm:text-sm font-medium text-purple-700">
                          Liquidación Anual
                        </p>
                        <p className="text-base sm:text-xl font-bold text-purple-800">
                          ${report.liquidacion_final}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Detalles Adicionales */}
                  <div className="mt-4 sm:mt-6 pt-2 sm:pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Diezmos Anuales
                      </p>
                      <p className="text-sm sm:text-base font-medium text-gray-900">
                        ${report.total_diezmos}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Ofrendas Anuales
                      </p>
                      <p className="text-sm sm:text-base font-medium text-gray-900">
                        ${report.total_ofrendas}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Total Iglesia Anual
                      </p>
                      <p className="text-sm sm:text-base font-medium text-gray-900">
                        ${report.total_iglesia}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}