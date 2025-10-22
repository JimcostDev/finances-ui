import React, { useEffect, useState } from "react";
import { fetchReports } from "@utils/api";
import Title from "./Title";

export default function ReportsList() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 animate-pulse">Cargando reportes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-6 rounded-xl max-w-md text-center">
          <p className="text-red-600 font-medium">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-blue-50 p-6 rounded-xl max-w-md text-center">
          <p className="text-blue-600 font-medium">
            No se encontraron reportes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Title as="h2" className="mb-8 text-center">
          Todos mis reportes
        </Title>

        {/* 
          Ajustes en la cuadrícula:
          - 1 columna en pantallas pequeñas
          - 2 columnas a partir de 'md' (768px)
          - 3 columnas a partir de 'lg' (1024px) si lo deseas
        */}
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {reports.map((report) => (
            <li
              key={report.id}
              className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              {/* Contenedor principal */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4 sm:mb-6 pb-2 sm:pb-4 border-b border-gray-200">
                {/* Fecha */}
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 order-1">
                  {report.month.charAt(0).toUpperCase() + report.month.slice(1)}{" "}
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
              {/* 
                Ajustes en la cuadrícula interna:
                - 1 columna en pantallas muy pequeñas
                - 2 columnas a partir de 'sm' (640px)
              */}
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

              {/* 
                Detalles Adicionales
                - 1 columna en pantallas pequeñas
                - 3 columnas a partir de 'sm'
              */}
              <div className="mt-4 sm:mt-6 pt-2 sm:pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Diezmos</p>
                  <p className="text-sm sm:text-base font-medium text-gray-900">
                    ${report.diezmos.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Ofrendas</p>
                  <p className="text-sm sm:text-base font-medium text-gray-900">
                    ${report.ofrendas.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-cyan-700">Iglesia</p>
                  <p className="text-sm sm:text-base font-medium text-cyan-900">
                    ${report.iglesia.toFixed(2)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
