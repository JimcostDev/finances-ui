import { API_BASE_URL } from "../config/apiUrl.js";

const jsonHeaders = {
  "Content-Type": "application/json",
};

/** Opciones base para que el navegador envíe la cookie HttpOnly en peticiones cross-origin */
function cred(init = {}) {
  return {
    credentials: "include",
    ...init,
    headers: { ...jsonHeaders, ...(init.headers || {}) },
  };
}

export async function registerUser(userData) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, cred({
    method: "POST",
    body: JSON.stringify(userData),
  }));
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al registrar el usuario");
  }
  return await response.json();
}

export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, cred({
    method: "POST",
    body: JSON.stringify(credentials),
  }));
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al iniciar sesión");
  }
  return await response.json();
}

/** Cierra sesión en el servidor (borra cookie HttpOnly) */
export async function logoutUser() {
  await fetch(`${API_BASE_URL}/api/auth/logout`, cred({ method: "POST" }));
}

/** Comprueba sesión válida y devuelve el usuario (misma forma que el perfil) */
export async function fetchAuthMe() {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, cred({ method: "GET" }));
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Error ${response.status}`);
  }
  return await response.json();
}

export async function fetchReports() {
  const response = await fetch(`${API_BASE_URL}/api/reports`, cred({ method: "GET" }));
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al obtener reportes");
  }
  return await response.json();
}

export async function fetchReportsByMonth(month, year) {
  const response = await fetch(
    `${API_BASE_URL}/api/reports/by-month?month=${encodeURIComponent(month)}&year=${year}`,
    cred({ method: "GET" })
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al obtener reportes por mes");
  }
  return await response.json();
}

export async function fetchUserProfile() {
  const response = await fetch(`${API_BASE_URL}/api/users/profile`, cred({ method: "GET" }));

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Error en fetchUserProfile:", errorData);
    throw new Error(errorData.error || `Error ${response.status}: No se pudo obtener el perfil`);
  }

  return await response.json();
}

export async function createReport(reportData) {
  const response = await fetch(`${API_BASE_URL}/api/reports`, cred({
    method: "POST",
    body: JSON.stringify(reportData),
  }));

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al crear el reporte");
  }
  return await response.json();
}

export async function updateReport(reportId, reportData) {
  const response = await fetch(`${API_BASE_URL}/api/reports/${reportId}`, cred({
    method: "PUT",
    body: JSON.stringify(reportData),
  }));

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al actualizar el reporte");
  }
  return await response.json();
}

export async function getReportById(reportId) {
  const response = await fetch(`${API_BASE_URL}/api/reports/${reportId}`, cred({ method: "GET" }));

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al obtener el reporte");
  }
  return await response.json();
}

export async function deleteReport(reportId) {
  const response = await fetch(`${API_BASE_URL}/api/reports/${reportId}`, cred({
    method: "DELETE",
  }));
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al eliminar el reporte");
  }
  return await response.json();
}

export const updateUserProfile = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/profile`, cred({
    method: "PUT",
    body: JSON.stringify(userData),
  }));

  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudo actualizar el perfil`);
  }

  return response.json();
};

export const deleteUserProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/api/users/profile`, cred({
    method: "DELETE",
  }));

  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudo eliminar el usuario`);
  }
};

export async function fetchAnnualReport(year) {
  const response = await fetch(`${API_BASE_URL}/api/reports/annual?year=${year}`, cred({
    method: "GET",
  }));
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al obtener el reporte anual");
  }
  return await response.json();
}

export async function fetchGeneralBalance() {
  const response = await fetch(`${API_BASE_URL}/api/reports/general-balance`, cred({
    method: "GET",
  }));

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Error al obtener el balance general");
  }

  return await response.json();
}

export async function fetchCategories() {
  const response = await fetch(`${API_BASE_URL}/api/categories`, cred({ method: "GET" }));
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Error al obtener categorías");
  }
  return await response.json();
}
