import React, { useState, type ChangeEventHandler } from "react";
import { USER_ACCOUNT_DELETE_CONFIRMATION_PHRASE } from "@interfaces";
import { deleteUserProfile, logoutUser } from "@services";
import { getErrorMessage } from "@utils/error";
import FormStickyActions from "@components/layout/FormStickyActions.tsx";
import Title from "@components/layout/Title.tsx";

/**
 * Sin props en la versión actual: el borrado usa la sesión (cookie HttpOnly).
 * Exportado para documentación / extensiones futuras.
 */
export type DeleteUserProfileFormProps = Record<string, never>;

export default function DeleteUserProfileForm() {
  const [confirmation, setConfirmation] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleConfirmationChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setConfirmation(e.target.value);
    setError("");
  };

  const handleDelete = async () => {
    if (
      confirmation.trim().toLowerCase() !==
      USER_ACCOUNT_DELETE_CONFIRMATION_PHRASE
    ) {
      setError("Debes escribir 'eliminar' para confirmar.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await deleteUserProfile();
      try {
        await logoutUser();
      } catch {
        /* cookie puede quedar inválida igualmente */
      }
      window.location.href = "/";
    } catch (err: unknown) {
      setError(getErrorMessage(err, "No se pudo eliminar la cuenta"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4 pb-36">
      <div className="max-w-2xl w-full space-y-6">
        {/* Card principal con advertencia */}
        <div className="bg-white rounded-2xl shadow-xl border border-red-200 overflow-hidden">
          {/* Header con icono de advertencia */}
          <div className="bg-linear-to-r from-red-600 to-orange-600 p-6 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <Title as="h2" variant="onDark" size="md" className="mb-2">
              Eliminar Cuenta
            </Title>
            <p className="text-red-100">
              Esta acción es permanente e irreversible
            </p>
          </div>

          {/* Contenido */}
          <div className="p-8 space-y-6">
            {/* Advertencias con iconos */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-red-50 rounded-xl border border-red-200">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Perderás todos tus datos</h3>
                  <p className="text-sm text-red-700">Tu perfil, reportes financieros y configuraciones serán eliminados permanentemente.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-orange-900 mb-1">No hay vuelta atrás</h3>
                  <p className="text-sm text-orange-700">Una vez confirmada, esta acción no se puede deshacer.</p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-600 font-medium">Confirmación requerida</span>
              </div>
            </div>

            {/* Instrucciones de confirmación */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <p className="text-gray-700 mb-4">
                Para confirmar la eliminación de tu cuenta, escribe{" "}
                <span className="font-bold text-red-600 bg-red-100 px-2 py-1 rounded">eliminar</span>{" "}
                en el siguiente campo:
              </p>
              
              {/* Input de confirmación */}
              <div className="relative">
                <input
                  type="text"
                  value={confirmation}
                  onChange={handleConfirmationChange}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-lg"
                  placeholder="Escribe 'eliminar' aquí"
                  disabled={loading}
                />
                {confirmation.trim().toLowerCase() ===
                  USER_ACCOUNT_DELETE_CONFIRMATION_PHRASE && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Mensaje de error */}
              {error && (
                <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <svg className="w-5 h-5 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}
            </div>

            {/* Nota final */}
            <p className="text-center text-sm text-gray-500 pt-4">
              ¿Tienes dudas?{" "}
              <a href="/dashboard" className="text-blue-600 hover:text-blue-700 font-medium">
                Volver al dashboard
              </a>
            </p>
          </div>
        </div>

        {/* Card informativo adicional */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">¿Buscas una alternativa?</h3>
              <p className="text-sm text-blue-700">
                Si solo quieres tomar un descanso, considera desactivar temporalmente tu cuenta en lugar de eliminarla. Contacta con soporte para más opciones.
              </p>
            </div>
          </div>
        </div>
      </div>

      <FormStickyActions
        variant="danger"
        primaryButtonType="button"
        onPrimaryClick={handleDelete}
        submitLabel="Hasta la vista, baby"
        loadingLabel="Eliminando…"
        loading={loading}
        primaryDisabled={
          loading ||
          confirmation.trim().toLowerCase() !== USER_ACCOUNT_DELETE_CONFIRMATION_PHRASE
        }
        onCancel={() => {
          window.location.href = "/dashboard";
        }}
        cancelDisabled={loading}
        maxWidthClass="max-w-2xl mx-auto w-full"
      />
    </div>
  );
}