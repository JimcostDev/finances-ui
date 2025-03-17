const API_BASE_URL = "http://localhost:3000"//"https://finances.koyeb.app";

// Función para registrar un usuario
export async function registerUser(userData) {
  const response = await fetch(`${API_BASE_URL}/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al registrar el usuario");
  }
  return await response.json();
}

// Función para iniciar sesión
export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentials)
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al iniciar sesión");
  }
  return await response.json();
}

/**
 * Obtiene todos los reportes del usuario autenticado.
 * @param {string} token - Token de autenticación JWT.
 * @returns {Promise<Array>} - Una promesa que resuelve a la lista de reportes.
 */
export async function fetchReports(token) {
    const response = await fetch(`${API_BASE_URL}/api/reports`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al obtener reportes");
    }
    return await response.json();
  }

  /**
 * Obtiene los reportes filtrados por mes y año.
 * @param {string} month - Mes en formato texto (ej. "marzo").
 * @param {number} year - Año (ej. 2025).
 * @param {string} token - Token de autenticación JWT.
 * @returns {Promise<Array>} - Lista de reportes.
 */
export async function fetchReportsByMonth(month, year, token) {
    const response = await fetch(`${API_BASE_URL}/api/reports/by-month?month=${month}&year=${year}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al obtener reportes por mes");
    }
    return await response.json();
  }
