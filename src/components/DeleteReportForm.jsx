import React, { useState } from 'react';
import { deleteReport } from '../utils/api';

export default function DeleteReportForm({ reportId }) {
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (confirmation.trim().toLowerCase() !== 'eliminar') {
      setError("Debes escribir 'eliminar' para confirmar.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("No se encontró token de autenticación");

      await deleteReport(reportId, token);
      window.location.href = '/reports';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md md:mx-auto mx-8 bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Eliminar Reporte</h2>
      <p className="mb-4 text-gray-700">
        ¿Estás seguro de que deseas eliminar este reporte? Esta acción no se puede deshacer.
      </p>
      <p className="mb-4 text-gray-700">
        Para confirmar, escribe <span className="font-bold">eliminar</span> en el siguiente campo:
      </p>
      
      <input 
        type="text"
        value={confirmation}
        onChange={(e) => setConfirmation(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        placeholder="Escribe 'eliminar' para confirmar"
      />

      {error && <p className="mt-2 text-red-600">{error}</p>}

      <div className="flex gap-4 mt-6">
        <button 
          onClick={handleDelete}
          disabled={loading}
          className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Eliminando..." : "Eliminar"}
        </button>

        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex-1 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
