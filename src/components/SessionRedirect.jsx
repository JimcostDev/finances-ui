import { useEffect } from "react";
import { fetchAuthMe } from "@utils/api";

/**
 * Si ya hay sesión (cookie HttpOnly válida), envía al dashboard.
 * Úsalo en páginas públicas (/, /register) para no pedir login de nuevo.
 */
export default function SessionRedirect() {
  useEffect(() => {
    fetchAuthMe()
      .then(() => {
        window.location.href = "/dashboard";
      })
      .catch(() => {
        /* sin sesión o token caducado: se queda en la página */
      });
  }, []);
  return null;
}
