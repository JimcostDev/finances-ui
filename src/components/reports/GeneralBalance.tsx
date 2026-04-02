import React, { useState, useEffect } from "react";
import type { IFinancialSummary } from "@interfaces";
import { fetchGeneralBalance } from "@services";
import { getErrorMessage } from "@utils/error";
import { useChurchContributions } from "../dashboard/ChurchContributionsContext";
import Title from "@components/layout/Title.tsx";

export default function GeneralBalance() {
  const churchEnabled = useChurchContributions();
  const [report, setReport] = useState<IFinancialSummary | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBalance = async () => {
      try {
        const data = await fetchGeneralBalance();
        setReport(data);
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Error al cargar el balance"));
      } finally {
        setLoading(false);
      }
    };

    loadBalance();
  }, []);

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
          <Title as="h2" size="lg">
            Balance General
          </Title>
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
                  <Title as="p" size="lg">
                    {`$${report.liquidacion_final.toFixed(2)}`}
                  </Title>
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
                    {`$${report.total_ingreso_bruto.toFixed(2)}`}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {`Neto: $${report.total_ingreso_neto.toFixed(2)}`}
                  </p>
                </div>

                {/* Gastos */}
                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                  <p className="text-xs font-medium text-red-700 mb-1">Total Gastos</p>
                  <p className="text-2xl font-bold text-red-800">
                    {`$${report.total_gastos.toFixed(2)}`}
                  </p>
                </div>
              </div>

              {churchEnabled && (
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 mt-4">
                  <p className="text-xs font-medium text-purple-700 mb-3">Aportes a Iglesia (Total)</p>
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}