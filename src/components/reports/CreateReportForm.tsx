import React, { useEffect, useMemo, useState, type SubmitEventHandler } from "react";
import type { ICategory, ICreateReportFormState, IReportPayload } from "@interfaces";
import { createReport, fetchCategories } from "@services";
import { getErrorMessage } from "@utils/error";
import { useChurchContributions } from "../dashboard/ChurchContributionsContext";
import FormStickyActions from "@components/layout/FormStickyActions.tsx";
import Title from "@components/layout/Title.tsx";

const defaultForm = (): ICreateReportFormState => ({
  month: "",
  year: new Date().getFullYear(),
  ingresos: [{ categoria_id: "", concepto: "", monto: "" }],
  gastos: [{ categoria_id: "", concepto: "", monto: "" }],
  porcentaje_ofrenda: "",
});

export default function CreateReportForm() {
  const churchEnabled = useChurchContributions();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [formData, setFormData] = useState<ICreateReportFormState>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [collapsedSections, setCollapsedSections] = useState({
    ingresos: false,
    gastos: false,
  });
  const [mobilePanel, setMobilePanel] = useState<"ingresos" | "gastos">("gastos");

  type SectionKey = "ingresos" | "gastos";
  type LineField = "categoria_id" | "concepto" | "monto";

  const handleInputChange = (section: SectionKey, index: number, field: LineField, value: string) => {
    const newData = [...formData[section]];
    const row = { ...newData[index], [field]: value };
    newData[index] = row;
    setFormData((prev) => ({ ...prev, [section]: newData }));
  };

  const addEntry = (section: SectionKey) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [
        ...prev[section],
        {
          categoria_id: "",
          concepto: "",
          monto: "",
        },
      ],
    }));
  };

  const removeEntry = (section: SectionKey, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const ofrendaPct = churchEnabled
        ? (parseFloat(formData.porcentaje_ofrenda) || 0) / 100
        : 0;

      const payload: IReportPayload = {
        month: formData.month,
        year: parseInt(String(formData.year), 10),
        ingresos: formData.ingresos.map((i) => ({
          ...(i.categoria_id ? { categoria_id: i.categoria_id } : {}),
          concepto: i.concepto || "",
          monto: Math.abs(parseFloat(i.monto)) || 0,
        })),
        gastos: formData.gastos.map((g) => ({
          ...(g.categoria_id ? { categoria_id: g.categoria_id } : {}),
          concepto: g.concepto || "",
          monto: Math.abs(parseFloat(g.monto)) || 0,
        })),
        porcentaje_ofrenda: ofrendaPct,
      };

      await createReport(payload);
      setSuccess("¡Reporte creado exitosamente!");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Error al crear el reporte"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await fetchCategories();
        setCategories(Array.isArray(cats) ? cats : []);
      } catch {
        setCategories([]);
      }
    };
    loadCategories();
  }, []);

  const categoriesByType = useMemo(() => {
    const ingreso: ICategory[] = [];
    const gasto: ICategory[] = [];
    for (const c of categories) {
      if (c.tipo === "ingreso") ingreso.push(c);
      else if (c.tipo === "gasto") gasto.push(c);
    }
    return { ingreso, gasto };
  }, [categories]);

  const getSectionTotal = (section: SectionKey) => {
    return formData[section].reduce((sum, item) => sum + (parseFloat(item.monto) || 0), 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-3 sm:px-4 max-w-full min-w-0 overflow-x-hidden">
      <div className="max-w-6xl mx-auto min-w-0">
        <div className="bg-white rounded-xl shadow-md p-4 mb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start">
            <div className="min-w-0">
              <Title as="h2" size="sm">
                Crear Nuevo Reporte
              </Title>
              <p className="text-gray-600 text-sm">
                Registra tus ingresos y gastos del mes
              </p>
            </div>

            <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:max-w-2xl sm:grid-cols-2 lg:grid-cols-3 lg:justify-items-stretch">
              <div className="min-w-0">
                <label htmlFor="create-report-month" className="mb-1 block text-xs font-medium text-gray-700">
                  Mes
                </label>
                <select
                  id="create-report-month"
                  value={formData.month}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, month: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
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
              </div>

              <div className="min-w-0">
                <label htmlFor="create-report-year" className="mb-1 block text-xs font-medium text-gray-700">
                  Año
                </label>
                <input
                  id="create-report-year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => {
                    const n = e.target.valueAsNumber;
                    setFormData((prev) => ({
                      ...prev,
                      year: Number.isNaN(n) ? prev.year : n,
                    }));
                  }}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 sm:max-w-[8rem]"
                  required
                />
              </div>

              {churchEnabled && (
                <div className="min-w-0 sm:col-span-2 lg:col-span-1">
                  <label htmlFor="create-report-ofrenda" className="mb-1 block text-xs font-medium text-gray-700">
                    Porcentaje de ofrenda
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="create-report-ofrenda"
                      type="number"
                      step="1"
                      min="1"
                      max="99"
                      value={formData.porcentaje_ofrenda}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          porcentaje_ofrenda: e.target.value,
                        }))
                      }
                      className="w-full min-w-0 max-w-[6rem] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      required
                      aria-describedby="create-report-ofrenda-desc"
                    />
                    <span className="text-sm text-gray-600" aria-hidden>
                      %
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pb-36 lg:pb-8">
          <div className="flex lg:hidden rounded-xl p-1 bg-gray-200/80 mb-1 gap-1 shadow-inner">
            <button
              type="button"
              onClick={() => setMobilePanel("ingresos")}
              className={`flex-1 py-2.5 px-2 rounded-lg text-sm font-semibold transition-colors ${
                mobilePanel === "ingresos"
                  ? "bg-white text-green-800 shadow"
                  : "text-gray-600"
              }`}
            >
              Ingresos ({formData.ingresos.length})
            </button>
            <button
              type="button"
              onClick={() => setMobilePanel("gastos")}
              className={`flex-1 py-2.5 px-2 rounded-lg text-sm font-semibold transition-colors ${
                mobilePanel === "gastos"
                  ? "bg-white text-red-800 shadow"
                  : "text-gray-600"
              }`}
            >
              Gastos ({formData.gastos.length})
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div
              className={`bg-white rounded-xl shadow-md overflow-hidden ${
                mobilePanel === "ingresos" ? "block" : "hidden lg:block"
              }`}
            >
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
                <div className="max-h-[min(58vh,24rem)] lg:max-h-96 min-h-0 overflow-y-auto overscroll-contain touch-pan-y p-3 space-y-2 [-webkit-overflow-scrolling:touch]">
                  {formData.ingresos.map((entry, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 gap-2 sm:grid-cols-12 sm:items-center bg-gray-50 p-3 rounded-lg min-w-0 max-w-full hover:bg-gray-100 transition-colors"
                    >
                      <select
                        value={entry.categoria_id || ""}
                        onChange={(e) =>
                          handleInputChange("ingresos", index, "categoria_id", e.target.value)
                        }
                        className="w-full min-w-0 sm:col-span-4 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">-- Sin Clasificar --</option>
                        {categoriesByType.ingreso.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.nombre}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={entry.concepto}
                        onChange={(e) =>
                          handleInputChange("ingresos", index, "concepto", e.target.value)
                        }
                        className="w-full min-w-0 sm:col-span-5 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Detalles (opcional)"
                      />
                      <div className="flex gap-2 items-center min-w-0 sm:contents">
                        <input
                          type="number"
                          step="0.01"
                          value={entry.monto}
                          onChange={(e) =>
                            handleInputChange("ingresos", index, "monto", e.target.value)
                          }
                          className="min-w-0 flex-1 sm:col-span-2 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="$0.00"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => removeEntry("ingresos", index)}
                          className="shrink-0 w-10 h-10 sm:col-span-1 sm:w-8 sm:h-8 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center"
                          aria-label="Eliminar línea"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
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

            <div
              className={`bg-white rounded-xl shadow-md overflow-hidden ${
                mobilePanel === "gastos" ? "block" : "hidden lg:block"
              }`}
            >
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
                <div className="max-h-[min(58vh,24rem)] lg:max-h-96 min-h-0 overflow-y-auto overscroll-contain touch-pan-y p-3 space-y-2 [-webkit-overflow-scrolling:touch]">
                  {formData.gastos.map((entry, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 gap-2 sm:grid-cols-12 sm:items-center bg-gray-50 p-3 rounded-lg min-w-0 max-w-full hover:bg-gray-100 transition-colors"
                    >
                      <select
                        value={entry.categoria_id || ""}
                        onChange={(e) =>
                          handleInputChange("gastos", index, "categoria_id", e.target.value)
                        }
                        className="w-full min-w-0 sm:col-span-4 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="">-- Sin Clasificar --</option>
                        {categoriesByType.gasto.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.nombre}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={entry.concepto}
                        onChange={(e) =>
                          handleInputChange("gastos", index, "concepto", e.target.value)
                        }
                        className="w-full min-w-0 sm:col-span-5 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Detalles (opcional)"
                      />
                      <div className="flex gap-2 items-center min-w-0 sm:contents">
                        <input
                          type="number"
                          step="0.01"
                          value={entry.monto}
                          onChange={(e) =>
                            handleInputChange("gastos", index, "monto", e.target.value)
                          }
                          className="min-w-0 flex-1 sm:col-span-2 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="$0.00"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => removeEntry("gastos", index)}
                          className="shrink-0 w-10 h-10 sm:col-span-1 sm:w-8 sm:h-8 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center"
                          aria-label="Eliminar línea"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
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
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200">
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{success}</span>
            </div>
          )}

          <FormStickyActions
            cancelLabel="Cancelar"
            submitLabel="Crear reporte"
            loadingLabel="Creando…"
            loading={loading}
            onCancel={() => {
              window.location.href = "/dashboard";
            }}
            cancelDisabled={loading}
            primaryDisabled={loading}
          />
        </form>
      </div>
    </div>
  );
}
