import React, { useEffect, useState, type SubmitEventHandler } from "react";
import type { IFinancialSummary } from "@interfaces";
import { fetchAnnualReport } from "@services";
import { getErrorMessage } from "@utils/error";
import { useChurchContributions } from "../dashboard/ChurchContributionsContext";
import Title from "@components/layout/Title.tsx";

export default function AnnualReport() {
  const churchEnabled = useChurchContributions();
  const currentCalendarYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(String(currentCalendarYear));
  const [report, setReport] = useState<IFinancialSummary | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const handleFetch = async (year: number) => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAnnualReport(year);
      setReport(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Error al obtener el reporte anual"));
      setReport(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetchAnnualReport(currentCalendarYear)
      .then((data) => {
        if (!cancelled) {
          setReport(data);
          setSelectedYear(String(currentCalendarYear));
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(getErrorMessage(err, "Error al obtener el reporte anual"));
          setReport(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleManualSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!selectedYear) {
      setError("Indica un año.");
      return;
    }
    void handleFetch(Number(selectedYear));
  };

  const handleCurrentYear = () => {
    setSelectedYear(String(currentCalendarYear));
    void handleFetch(currentCalendarYear);
  };

  const resolvedReportYear = (r: IFinancialSummary): number => {
    if (r.year != null && !Number.isNaN(Number(r.year))) {
      return Number(r.year);
    }
    const fromInput = Number.parseInt(String(selectedYear), 10);
    return Number.isNaN(fromInput) ? currentCalendarYear : fromInput;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-green-50 py-4 px-3 sm:px-6 lg:px-8 sm:py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 text-center sm:mb-5">
          <Title as="h2" size="responsive-sm">
            Reporte anual
          </Title>
          <p className="mt-1 text-sm text-gray-600 sm:text-base">
            Resumen de ingresos, gastos y balance por año
          </p>
        </div>

        {/* Resultados primero: ocupan el foco visual */}
        {loading && (
          <div className="mb-4 flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white py-12 shadow-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="mt-3 text-sm font-medium text-gray-600">Cargando datos del año…</p>
          </div>
        )}

        {!loading && error && (
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <svg className="h-5 w-5 shrink-0 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="font-medium text-red-700">{error}</p>
          </div>
        )}

        {report && !loading && (
          <div className="animate-fade-in space-y-4">
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
              <div className="border-b border-gray-200 bg-linear-to-br from-gray-50 to-white p-4 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="mb-0.5 text-xs text-gray-600 sm:text-sm">Balance anual</p>
                    <Title as="p" size="responsive-md">
                      {`$${report.liquidacion_final.toFixed(2)}`}
                    </Title>
                  </div>
                  {/* Misma píldora que «HISTÓRICO» en Balance general */}
                  <span
                    className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 tabular-nums"
                    title={`Año fiscal consultado: ${resolvedReportYear(report)}`}
                  >
                    AÑO {resolvedReportYear(report)}
                  </span>
                </div>
              </div>

              <div className="space-y-4 p-4 sm:p-6">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="rounded-xl border border-green-100 bg-green-50 p-3 sm:p-4">
                    <p className="mb-1 text-xs font-medium text-green-700">Ingresos bruto</p>
                    <p className="text-xl font-bold text-green-800 sm:text-2xl">
                      {`$${report.total_ingreso_bruto.toFixed(2)}`}
                    </p>
                    {churchEnabled && (
                      <p className="mt-1 text-xs text-green-600">
                        {`Neto: $${report.total_ingreso_neto.toFixed(2)}`}
                      </p>
                    )}
                  </div>
                  <div className="rounded-xl border border-red-100 bg-red-50 p-3 sm:p-4">
                    <p className="mb-1 text-xs font-medium text-red-700">Gastos</p>
                    <p className="text-xl font-bold text-red-800 sm:text-2xl">
                      {`$${report.total_gastos.toFixed(2)}`}
                    </p>
                  </div>
                </div>

                {churchEnabled && (
                  <div className="rounded-xl border border-purple-100 bg-purple-50 p-4">
                    <p className="mb-3 text-xs font-medium text-purple-700">Compromisos anuales</p>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      <div>
                        <p className="text-xs text-purple-600">Diezmos</p>
                        <p className="text-base font-bold text-purple-900 sm:text-lg">
                          {`$${report.total_diezmos.toFixed(2)}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-purple-600">Ofrendas</p>
                        <p className="text-base font-bold text-purple-900 sm:text-lg">
                          {`$${report.total_ofrendas.toFixed(2)}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-purple-600">Total</p>
                        <p className="text-base font-bold text-purple-900 sm:text-lg">
                          {`$${report.total_iglesia.toFixed(2)}`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 border-t border-gray-200 pt-4">
                  <div className="rounded-xl bg-blue-50 p-3 text-center">
                    <p className="mb-1 text-xs text-blue-600">Promedio mensual ingresos</p>
                    <p className="text-lg font-bold text-blue-800 sm:text-xl">
                      {`$${(report.total_ingreso_bruto / 12).toFixed(2)}`}
                    </p>
                  </div>
                  <div className="rounded-xl bg-orange-50 p-3 text-center">
                    <p className="mb-1 text-xs text-orange-600">Promedio mensual gastos</p>
                    <p className="text-lg font-bold text-orange-800 sm:text-xl">
                      {`$${(report.total_gastos / 12).toFixed(2)}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Buscador compacto debajo del resultado (no compite por espacio) */}
        <div className="mt-4 rounded-xl border border-gray-200 bg-white/90 p-3 shadow-sm backdrop-blur-sm sm:p-4">
          <p className="mb-2 text-xs font-medium text-gray-500">Cambiar año</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-stretch">
            <button
              type="button"
              onClick={handleCurrentYear}
              disabled={loading}
              className="flex shrink-0 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-800 transition-colors hover:bg-blue-100 disabled:opacity-50"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Año actual ({currentCalendarYear})
            </button>
            <form
              onSubmit={handleManualSubmit}
              className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-end"
            >
              <div className="min-w-0 flex-1 sm:max-w-[10rem]">
                <label htmlFor="annual-year-input" className="sr-only">
                  Año a consultar
                </label>
                <input
                  id="annual-year-input"
                  type="number"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Año"
                  min={2000}
                  max={2100}
                  required
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="shrink-0 rounded-lg bg-linear-to-r from-green-600 to-green-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-green-700 hover:to-green-800 disabled:opacity-50"
              >
                Ver reporte
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
