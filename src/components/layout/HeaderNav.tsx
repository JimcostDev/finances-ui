import React, { useEffect, useState } from "react";
import { fetchAuthMe } from "@services";

interface HeaderNavProps {
  pathname: string;
}

type AuthState = "loading" | "in" | "out";

/** Rutas que exigen sesión: no mostramos «Iniciar / Crear cuenta»; si falla /me, redirigimos al login. */
function isProtectedPath(pathname: string): boolean {
  if (pathname === "/reports") return true;
  return (
    pathname.startsWith("/edit-report") ||
    pathname.startsWith("/create-report") ||
    pathname.startsWith("/delete-report") ||
    pathname.startsWith("/annual-report") ||
    pathname.startsWith("/general-balance") ||
    pathname.startsWith("/edit-profile") ||
    pathname.startsWith("/delete-user")
  );
}

async function fetchAuthMeWithRetry() {
  let lastErr: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await fetchAuthMe();
    } catch (e) {
      lastErr = e;
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 350));
      }
    }
  }
  throw lastErr;
}

export default function HeaderNav({ pathname }: HeaderNavProps) {
  const [auth, setAuth] = useState<AuthState>("loading");

  const hideAuthButtons = pathname === "/login" || pathname === "/register";
  const protectedRoute = isProtectedPath(pathname);

  useEffect(() => {
    if (hideAuthButtons) return;
    let cancelled = false;
    fetchAuthMeWithRetry()
      .then(() => {
        if (!cancelled) setAuth("in");
      })
      .catch(() => {
        if (!cancelled) setAuth("out");
      });
    return () => {
      cancelled = true;
    };
  }, [pathname, hideAuthButtons]);

  useEffect(() => {
    if (hideAuthButtons || !protectedRoute || auth !== "out") return;
    const next = `${pathname}${typeof window !== "undefined" ? window.location.search : ""}`;
    window.location.replace(`/login?redirect=${encodeURIComponent(next)}`);
  }, [auth, hideAuthButtons, pathname, protectedRoute]);

  if (hideAuthButtons) {
    return null;
  }

  if (protectedRoute && auth === "loading") {
    return (
      <div className="h-9 w-9 shrink-0 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center" aria-label="Cargando sesión">
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (protectedRoute && auth === "out") {
    return (
      <p className="text-sm text-gray-500 px-2 max-w-[10rem] truncate">Redirigiendo…</p>
    );
  }

  if (auth === "loading") {
    return (
      <div className="h-9 w-9 shrink-0 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center" aria-label="Cargando sesión">
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (auth === "out") {
    return (
      <>
        <a
          href="/login"
          className="px-3 sm:px-4 py-2 text-slate-700 hover:text-blue-600 font-medium transition-colors rounded-xl hover:bg-slate-100 text-sm sm:text-base"
        >
          Entrar
        </a>
        <a
          href="/register"
          className="px-4 sm:px-5 py-2 bg-linear-to-r from-blue-600 to-emerald-600 text-white font-medium rounded-xl shadow-md shadow-blue-600/15 hover:shadow-lg hover:shadow-blue-600/25 transition-all text-sm sm:text-base whitespace-nowrap"
        >
          Crear cuenta
        </a>
      </>
    );
  }

  /* Sesión iniciada: el dashboard ya tiene navegación y cierre de sesión; no duplicar en el header. */
  return null;
}
