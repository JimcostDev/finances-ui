import React, { useState } from "react";
import { createReport } from "@utils/api";

export default function CreateReportForm() {
  const [formData, setFormData] = useState({
    month: "",
    year: new Date().getFullYear(),
    ingresos: [{ concepto: "", monto: "" }],
    gastos: [{ concepto: "", monto: "" }],
    porcentaje_ofrenda: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [collapsedSections, setCollapsedSections] = useState({
    ingresos: false,
    gastos: false,
  });

  const handleInputChange = (section, index, field, value) => {
    const newData = [...formData[section]];
    newData[index][field] = value;
    setFormData((prev) => ({ ...prev, [section]: newData }));
  };

  const addEntry = (section) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], { concepto: "", monto: "" }],
    }));
  };

  const removeEntry = (section, index) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  const toggleSection = (section) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No autenticado");

      const payload = {
        ...formData,
        year: parseInt(formData.year, 10),
        ingresos: formData.ingresos.map((i) => ({
          concepto: i.concepto,
          monto: Math.abs(parseFloat(i.monto)) || 0,
        })),
        gastos: formData.gastos.map((g) => ({
          concepto: g.concepto,
          monto: Math.abs(parseFloat(g.monto)) || 0,
        })),
        porcentaje_ofrenda: parseFloat(formData.porcentaje_ofrenda) / 100,
      };

      await createReport(payload, token);
      setSuccess("¡Reporte creado exitosamente!");
      setTimeout(() => (window.location.href = "/dashboard"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSectionTotal = (section) => {
    return formData[section].reduce((sum, item) => sum + (parseFloat(item.monto) || 0), 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header compacto */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Crear Nuevo Reporte
              </h2>
              <p className="text-gray-600 text-sm">
                Registra tus ingresos y gastos del mes
              </p>
            </div>

            {/* Mes, Año y Ofrenda en header */}
            <div className="flex gap-2 w-full sm:w-auto">
              <select
                value={formData.month}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, month: e.target.value }))
                }
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Seleccionar mes</option>
                {[
                  "enero", "febrero", "marzo", "abril", "mayo", "junio",
                  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
                ].map((mes) => (
                  <option key={mes} value={mes}>
                    {mes.charAt(0).toUpperCase() + mes.slice(1)}
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={formData.year}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, year: e.target.value }))
                }
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />

              <input
                type="number"
                step="1"
                value={formData.porcentaje_ofrenda}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    porcentaje_ofrenda: e.target.value,
                  }))
                }
                className="w-30 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="% Ofrenda"
                title="Porcentaje de Ofrenda"
                required
              />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Grid de 2 columnas para Ingresos y Gastos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Sección Ingresos */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Header de sección */}
              <div className="bg-green-50 border-b border-green-100 p-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleSection("ingresos")}
                      className="text-green-700 hover:text-green-900"
                    >
                      <svg
                        className={`w-5 h-5 transition-transform ${
                          collapsedSections.ingresos ? "-rotate-90" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <h3 className="text-lg font-bold text-green-900">
                      Ingresos ({formData.ingresos.length})
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-green-700">
                      ${getSectionTotal("ingresos").toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => addEntry("ingresos")}
                      className="w-8 h-8 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors flex items-center justify-center"
                      title="Agregar ingreso"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Lista de entradas con scroll */}
              {!collapsedSections.ingresos && (
                <div className="max-h-96 overflow-y-auto p-3 space-y-2">
                  {formData.ingresos.map((entry, index) => (
                    <div
                      key={index}
                      className="flex gap-2 items-center bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <input
                        type="text"
                        value={entry.concepto}
                        onChange={(e) =>
                          handleInputChange("ingresos", index, "concepto", e.target.value)
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Concepto"
                        required
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={entry.monto}
                        onChange={(e) =>
                          handleInputChange("ingresos", index, "monto", e.target.value)
                        }
                        className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="$0.00"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeEntry("ingresos", index)}
                        className="w-8 h-8 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center flex-shrink-0"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  {formData.ingresos.length === 0 && (
                    <p className="text-center text-gray-500 text-sm py-4">
                      No hay ingresos. Haz clic en + para agregar.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Sección Gastos */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Header de sección */}
              <div className="bg-red-50 border-b border-red-100 p-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleSection("gastos")}
                      className="text-red-700 hover:text-red-900"
                    >
                      <svg
                        className={`w-5 h-5 transition-transform ${
                          collapsedSections.gastos ? "-rotate-90" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <h3 className="text-lg font-bold text-red-900">
                      Gastos ({formData.gastos.length})
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-red-700">
                      ${getSectionTotal("gastos").toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => addEntry("gastos")}
                      className="w-8 h-8 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors flex items-center justify-center"
                      title="Agregar gasto"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Lista de entradas con scroll */}
              {!collapsedSections.gastos && (
                <div className="max-h-96 overflow-y-auto p-3 space-y-2">
                  {formData.gastos.map((entry, index) => (
                    <div
                      key={index}
                      className="flex gap-2 items-center bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <input
                        type="text"
                        value={entry.concepto}
                        onChange={(e) =>
                          handleInputChange("gastos", index, "concepto", e.target.value)
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Concepto"
                        required
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={entry.monto}
                        onChange={(e) =>
                          handleInputChange("gastos", index, "monto", e.target.value)
                        }
                        className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="$0.00"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeEntry("gastos", index)}
                        className="w-8 h-8 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center flex-shrink-0"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  {formData.gastos.length === 0 && (
                    <p className="text-center text-gray-500 text-sm py-4">
                      No hay gastos. Haz clic en + para agregar.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mensajes de estado */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{success}</span>
            </div>
          )}

          {/* Botones de acción - Sticky al final */}
          <div className="sticky bottom-0 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => window.location.href = "/dashboard"}
                className="flex-1 py-3 px-6 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creando...
                  </span>
                ) : (
                  "Crear Reporte"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
