import React from "react";

export type FormStickyActionsVariant = "primary" | "danger";

export interface FormStickyActionsProps {
  cancelLabel?: string;
  submitLabel: string;
  loadingLabel?: string;
  loading?: boolean;
  onCancel: () => void;
  /** Por defecto `submit` para formularios; usar `button` + `onPrimaryClick` en acciones fuera de submit nativo. */
  primaryButtonType?: "submit" | "button";
  onPrimaryClick?: () => void;
  primaryDisabled?: boolean;
  cancelDisabled?: boolean;
  variant?: FormStickyActionsVariant;
  /** Contenedor interno (reportes: max-w-6xl; perfil: max-w-2xl). */
  maxWidthClass?: string;
}

/**
 * Barra de acciones fija en móvil y sticky en escritorio, mismo patrón que crear/editar reporte.
 */
export default function FormStickyActions({
  cancelLabel = "Cancelar",
  submitLabel,
  loadingLabel,
  loading = false,
  onCancel,
  primaryButtonType = "submit",
  onPrimaryClick,
  primaryDisabled = false,
  cancelDisabled = false,
  variant = "primary",
  maxWidthClass = "max-w-6xl mx-auto",
}: FormStickyActionsProps) {
  const primaryGradient =
    variant === "danger"
      ? "bg-linear-to-r from-red-600 to-orange-600 hover:shadow-lg"
      : "bg-linear-to-r from-blue-600 to-green-600 hover:shadow-lg";

  const handlePrimary =
    primaryButtonType === "button"
      ? (e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          onPrimaryClick?.();
        }
      : undefined;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white/95 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-sm lg:sticky lg:z-auto lg:rounded-xl lg:border lg:shadow-lg">
      <div className={`flex gap-3 px-4 ${maxWidthClass}`}>
        <button
          type="button"
          onClick={onCancel}
          disabled={cancelDisabled || loading}
          className="flex-1 rounded-lg bg-gray-200 px-4 py-3 font-semibold text-gray-800 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
        >
          {cancelLabel}
        </button>
        <button
          type={primaryButtonType}
          onClick={handlePrimary}
          disabled={primaryDisabled || loading}
          className={`flex-1 rounded-lg px-4 py-3 font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 ${primaryGradient} ${
            variant === "danger" && !loading ? "text-sm leading-snug sm:text-base" : ""
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {loadingLabel ?? "Guardando…"}
            </span>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </div>
  );
}
