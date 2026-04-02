import React, { useEffect, useState } from "react";
import type { IReport } from "@interfaces";
import { fetchReports } from "@services";
import { getErrorMessage } from "@utils/error";
import { useChurchContributions } from "../dashboard/ChurchContributionsContext";
import Title from "@components/layout/Title.tsx";
import ReportsFilteredEmpty from "./ReportsFilteredEmpty.tsx";
import ReportsFiltersBar from "./ReportsFiltersBar.tsx";
import { useReportsFilters } from "./useReportsFilters";

export default function ReportsList() {
  const churchEnabled = useChurchContributions();
  const [reports, setReports] = useState<IReport[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const {
    filterYear,
    setFilterYear,
    filterMonth,
    setFilterMonth,
    uniqueYears,
    yearsForSelect,
    sortedFilteredReports,
    setThisMonth,
    clearFilters,
  } = useReportsFilters(reports);

  useEffect(() => {
    fetchReports()
      .then((data) => {
        setReports(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err: unknown) => {
        setError(getErrorMessage(err, "Error al cargar reportes"));
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 via-white to-green-50">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="font-medium text-gray-600">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 via-white to-green-50 p-4">
        <div className="max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-bold text-gray-900">Error al cargar reportes</h3>
          <p className="text-red-600">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-red-600 px-6 py-2 text-white transition-colors hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!Array.isArray(reports) || reports.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 via-white to-green-50 p-4">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-bold text-gray-900">No hay reportes aún</h3>
          <p className="mb-6 text-gray-600">Comienza a agregar tus ingresos y gastos para generar reportes</p>
          <a
            href="/create-report"
            className="inline-block transform rounded-xl bg-linear-to-r from-blue-600 to-green-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            Ir a Crear Reporte
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-green-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <ReportsFiltersBar
          filteredCount={sortedFilteredReports.length}
          yearsInDataCount={uniqueYears.length}
          filterYear={filterYear}
          filterMonth={filterMonth}
          yearsForSelect={yearsForSelect}
          onYearChange={setFilterYear}
          onMonthChange={setFilterMonth}
          onThisMonthClick={setThisMonth}
        />

        {sortedFilteredReports.length === 0 ? (
          <ReportsFilteredEmpty onClearFilters={clearFilters} />
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {sortedFilteredReports.map((report) => (
              <div
                key={report.id}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <div className="border-b border-gray-200 bg-linear-to-br from-gray-50 to-white p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold capitalize text-gray-900">{report.month}</h3>
                      <p className="text-lg font-semibold text-gray-600">{report.year}</p>
                    </div>
                  </div>

                  <div className="rounded-xl border-2 border-gray-200 bg-white p-4 shadow-sm">
                    <p className="mb-1 text-sm text-gray-600">Balance Final</p>
                    <Title as="p" size="md">
                      ${report.liquidacion.toFixed(2)}
                    </Title>
                  </div>
                </div>

                <div className="space-y-4 p-6">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-green-100 bg-green-50 p-3">
                      <div className="mb-2 flex items-center gap-2">
                        <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <p className="text-xs font-semibold text-green-700">Ingresos</p>
                      </div>
                      <p className="text-lg font-bold text-green-800">${report.total_ingreso_bruto.toFixed(2)}</p>
                      <p className="mt-1 text-xs text-green-600">Neto: ${report.ingresos_netos.toFixed(2)}</p>
                    </div>

                    <div className="rounded-xl border border-red-100 bg-red-50 p-3">
                      <div className="mb-2 flex items-center gap-2">
                        <svg className="h-4 w-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 2a8 8 0 100 16 8 8 0 000-16zm3.707 6.707a1 1 0 00-1.414-1.414L11 9.586V6a1 1 0 10-2 0v3.586L7.707 7.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <p className="text-xs font-semibold text-red-700">Gastos</p>
                      </div>
                      <p className="text-lg font-bold text-red-800">${report.total_gastos.toFixed(2)}</p>
                    </div>
                  </div>

                  {churchEnabled && (
                    <div className="rounded-xl border border-purple-100 bg-purple-50 p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <svg className="h-4 w-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                        </svg>
                        <p className="text-sm font-semibold text-purple-700">Compromisos</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <p className="text-xs text-purple-600">Diezmos</p>
                          <p className="text-sm font-bold text-purple-900">${report.diezmos.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-purple-600">Ofrendas</p>
                          <p className="text-sm font-bold text-purple-900">${report.ofrendas.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-purple-600">Total</p>
                          <p className="text-sm font-bold text-purple-900">${report.iglesia.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <a
                      href={`/edit-report/${report.id}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 font-medium text-amber-700 transition-all duration-200 hover:bg-amber-100 group-hover:border-amber-300"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span className="text-sm">Editar</span>
                    </a>
                    <a
                      href={`/delete-report/${report.id}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 font-medium text-red-700 transition-all duration-200 hover:bg-red-100 group-hover:border-red-300"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span className="text-sm">Eliminar</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}