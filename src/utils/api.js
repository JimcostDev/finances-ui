const API_BASE_URL = "https://finances.koyeb.app";
// const API_BASE_URL = "http://localhost:3000";

// Función para registrar un usuario
export async function registerUser(userData) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
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
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
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

// Función para obtener los reportes
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

// Función para obtener los reportes por mes
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

// Función para obtener usuarios
export async function fetchUserProfile(token) {
  const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",  
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));  // Captura errores JSON
    console.error("Error en fetchUserProfile:", errorData);
    throw new Error(errorData.error || `Error ${response.status}: No se pudo obtener el perfil`);
  }

  return await response.json();
}

// Función para crear un reporte
export async function createReport(reportData, token) {
  const response = await fetch(`${API_BASE_URL}/api/reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(reportData)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al crear el reporte");
  }
  return await response.json();
}

// Función para actualizar un reporte
export async function updateReport(reportId, reportData, token) {
  const response = await fetch(`${API_BASE_URL}/api/reports/${reportId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(reportData)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al actualizar el reporte");
  }
  return await response.json();
}

// Función para obtener un reporte por ID
export async function getReportById(reportId, token) {
  const response = await fetch(`${API_BASE_URL}/api/reports/${reportId}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al obtener el reporte");
  }
  return await response.json();
}

// Función para eliminar un reporte 
export async function deleteReport(reportId, token) {
  const response = await fetch(`${API_BASE_URL}/api/reports/${reportId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al eliminar el reporte");
  }
  return await response.json();
}

// Actualizar perfil de usuario
export const updateUserProfile = async (token, userData) => {
  const response = await fetch(`${API_BASE_URL}/users/profile`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudo actualizar el perfil`);
  }

  return response.json();
};

// Eliminar usuario
export const deleteUserProfile = async (token) => {
  const response = await fetch(`${API_BASE_URL}/users/profile`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudo eliminar el usuario`);
  }
};