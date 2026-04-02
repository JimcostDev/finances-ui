import React, { useState } from "react";
import type { ChangeEventHandler, SubmitEventHandler } from "react";
import type { IRegisterRequest } from "@interfaces";
import { registerUser } from "@services";
import { getErrorMessage } from "@utils/error";
import {
  computePasswordStrength,
  passwordStrengthBarClass,
  passwordStrengthLabel,
} from "@utils/passwordStrength";

const inputClass =
  "block w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-[15px] text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/25 disabled:opacity-60";

const inputPasswordClass =
  "block w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-12 text-[15px] text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/25 disabled:opacity-60";

const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

export default function RegisterForm() {
  const [form, setForm] = useState<IRegisterRequest>({
    email: "",
    username: "",
    password: "",
    confirm_password: "",
    fullname: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

    if (e.target.name === "password") {
      setPasswordStrength(computePasswordStrength(e.target.value));
    }
  };

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (form.password !== form.confirm_password) {
      setMessage({ text: "Las contraseñas no coinciden", type: "error" });
      return;
    }

    if (form.password.length < 8) {
      setMessage({ text: "La contraseña debe tener al menos 8 caracteres", type: "error" });
      return;
    }

    setIsLoading(true);

    try {
      await registerUser(form);
      setMessage({
        text: "¡Cuenta creada exitosamente! Redirigiendo...",
        type: "success"
      });
      
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);

    } catch (error: unknown) {
      setMessage({ text: getErrorMessage(error, "Error al crear la cuenta"), type: "error" });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-slate-50 via-white to-emerald-50/40 px-4 py-16 sm:px-6">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-100/90 bg-white/90 p-8 shadow-md shadow-slate-200/60 backdrop-blur-sm sm:p-9">
          <div className="mb-8 text-center">
            <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
              Finanzas personales
            </p>
            <h1 className="text-balance text-2xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-[1.75rem]">
              <span className="bg-linear-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Tu cuenta
              </span>
              <span> en minutos</span>
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-slate-600">
              Nombre, usuario, correo y contraseña segura.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className={labelClass}>
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="tu@email.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label htmlFor="username" className={labelClass}>
                Nombre de usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="nombredeusuario"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Fullname */}
            <div className="space-y-2">
              <label htmlFor="fullname" className={labelClass}>
                Nombre completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <input
                  id="fullname"
                  type="text"
                  name="fullname"
                  value={form.fullname}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Juan Pérez"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className={labelClass}>
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={inputPasswordClass}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 transition-colors hover:text-slate-600"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {form.password && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          level <= passwordStrength ? passwordStrengthBarClass(passwordStrength) : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  {passwordStrength > 0 && (
                    <p className="text-xs text-slate-600">
                      Contraseña: <span className="font-semibold">{passwordStrengthLabel(passwordStrength)}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirm_password" className={labelClass}>
                Confirmar contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <input
                  id="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm_password"
                  value={form.confirm_password}
                  onChange={handleChange}
                  className={inputPasswordClass}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 transition-colors hover:text-slate-600"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Mensaje de error/éxito */}
            {message.text && (
              <div className={`flex items-start gap-2 rounded-xl p-3.5 ${
                message.type === "error"
                  ? "border border-red-100 bg-red-50/90 text-red-800"
                  : "border border-emerald-100 bg-emerald-50/90 text-emerald-900"
              }`}>
                {message.type === "error" ? (
                  <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="text-sm font-medium">{message.text}</span>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-emerald-600 px-4 py-3.5 text-[15px] font-semibold text-white shadow-md shadow-blue-600/15 transition hover:shadow-lg hover:shadow-blue-600/25 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Guardando…</span>
                  </>
                ) : (
                  <>
                    <span>Registrarme</span>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="mt-8 border-t border-slate-100 pt-6 text-center text-sm text-slate-600">
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="font-semibold text-blue-600 underline decoration-blue-200 underline-offset-4 transition hover:text-emerald-600 hover:decoration-emerald-300">
              Entrar
            </a>
          </p>

          <p className="mt-5 text-center">
            <a href="/" className="text-[13px] text-slate-500 transition hover:text-slate-800">
              ← Volver al inicio
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}