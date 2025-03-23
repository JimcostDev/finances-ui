import React, { useEffect, useState } from "react";
import { fetchReports } from "../utils/api";
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

        <ul className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
          {reports.map((report) => (
            <li
              key={report.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative" // Añadido 'relative'
            >
              {/* Botón de edición - Nueva sección */}
              <div className="absolute top-4 right-4">
                <a
                  href={`/edit-report/${report.id}`}
                  className="px-4 py-2.5  bg-amber-50 text-yellow-700  rounded-lg hover:bg-yellow-100 hover:text-yellow-800 transition-colors"
                >
                  Editar
                </a>
              </div>

              {/* Sección del título existente */}
              <div className="mb-6 pb-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">
                  {report.month.charAt(0).toUpperCase() + report.month.slice(1)}{" "}
                  {report.year}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {/* Columna Izquierda */}
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-green-700">
                      Ingreso Bruto
                    </p>
                    <p className="text-xl font-bold text-green-800">
                      ${report.total_ingreso_bruto}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-blue-700">
                      Ingresos Netos
                    </p>
                    <p className="text-xl font-bold text-blue-800">
                      ${report.ingresos_netos}
                    </p>
                  </div>
                </div>

                {/* Columna Derecha */}
                <div className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-red-700">
                      Total Gastos
                    </p>
                    <p className="text-xl font-bold text-red-800">
                      ${report.total_gastos}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-purple-700">
                      Liquidación Final
                    </p>
                    <p className="text-xl font-bold text-purple-800">
                      ${report.liquidacion}
                    </p>
                  </div>
                </div>
              </div>

              {/* Detalles Adicionales */}
              <div className="mt-6 pt-4 border-t border-gray-200 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Diezmos</p>
                  <p className="font-medium text-gray-900">${report.diezmos}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ofrendas</p>
                  <p className="font-medium text-gray-900">
                    ${report.ofrendas}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Iglesia</p>
                  <p className="font-medium text-gray-900">${report.iglesia}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
