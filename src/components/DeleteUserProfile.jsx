// src/components/DeleteUserProfileForm.jsx
import React, { useState } from "react";
import { deleteUserProfile } from "../utils/api";

export default function DeleteUserProfileForm() {
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (confirmation.trim().toLowerCase() !== "eliminar") {
      setError("Debes escribir 'eliminar' para confirmar.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No se encontró token de autenticación");
      await deleteUserProfile(token);
      // Al eliminar el usuario, eliminar el token y redirigir al home o login
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md md:mx-auto mx-8 bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
        Eliminar Cuenta
      </h2>
      <p className="mb-4 text-gray-700">
        ¿Estás seguro de que deseas eliminar tu cuenta? Esta acción eliminará
        toda tu información, incluidos tus reportes.
      </p>
      <p className="mb-4 text-gray-700">
        Para confirmar, escribe <span className="font-bold">eliminar</span> en
        el siguiente campo:
      </p>
      <input
        type="text"
        value={confirmation}
        onChange={(e) => setConfirmation(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        placeholder="Escribe 'eliminar' para confirmar"
      />
      {error && <p className="mt-2 text-red-600">{error}</p>}

      <div className="flex flex-col items-center">
        
        <button
          onClick={handleDelete}
          disabled={loading}
          className="w-full mt-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Eliminando..." : "Eliminar Cuenta"}
        </button>
        <button
          type="button"
          onClick={() => window.history.back()} // Esto hace que vuelva a la página anterior
          className="mt-2 text-sm text-blue-500 hover:text-blue-700 transition-colors duration-200"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
