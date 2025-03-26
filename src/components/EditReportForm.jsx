import React, { useState, useEffect } from 'react';
import { getReportById, updateReport } from '../utils/api';

export default function EditReportForm({ reportId }) {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadReport = async () => {
      try {
        //console.log('ID recibido en componente:', reportId); 
        // Validar que el ID sea un string válido
        if (typeof reportId !== 'string' || !/^[0-9a-fA-F]{24}$/.test(reportId)) {
            throw new Error(`ID inválido: ${reportId}`);
        }

        const token = localStorage.getItem('token');
        if (!token) throw new Error('No autenticado');
        
        const report = await getReportById(reportId, token);
        setFormData({
          ...report,
          porcentaje_ofrenda: (report.porcentaje_ofrenda * 100)
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadReport();
  }, [reportId]);

  const handleInputChange = (section, index, field, value) => {
    const newData = [...formData[section]];
    newData[index][field] = value;
    setFormData(prev => ({ ...prev, [section]: newData }));
  };

  const addEntry = (section) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], { 
        concepto: '', 
        monto: '',
        _id: `new-${Date.now()}` // ID temporal para nuevos elementos
      }]
    }));
  };

  const removeEntry = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No autenticado');

      const payload = {
        ...formData,
        ingresos: formData.ingresos.map(i => ({
          ...i,
          monto: parseFloat(i.monto)
        })),
        gastos: formData.gastos.map(g => ({
          ...g,
          monto: parseFloat(g.monto)
        })),
        porcentaje_ofrenda: parseFloat(formData.porcentaje_ofrenda) / 100
      };

      await updateReport(reportId, payload, token);
      setSuccess('Reporte actualizado exitosamente!');
      setTimeout(() => window.location.href = '/dashboard', 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-4">Cargando reporte...</div>;
  if (!formData) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Editar Reporte - {formData.month} {formData.year}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Mes y Año */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mes</label>
            <select
              value={formData.month}
              onChange={(e) => setFormData(prev => ({ ...prev, month: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            >
              {['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
                .map(mes => (
                  <option key={mes} value={mes}>
                    {mes.charAt(0).toUpperCase() + mes.slice(1)}
                  </option>
                ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Año</label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
        </div>

        {/* Secciones dinámicas */}
        {['ingresos', 'gastos'].map((section) => (
          <div key={section} className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 capitalize">
                {section === 'ingresos' ? 'Ingresos' : 'Gastos'}
              </h3>
              <button
                type="button"
                onClick={() => addEntry(section)}
                className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2.5 rounded-lg hover:bg-green-100 hover:text-green-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Agregar {section === 'ingresos' ? 'ingreso' : 'gasto'}
              </button>
            </div>

            {formData[section].map((entry, index) => (
              <div key={entry._id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Concepto</label>
                  <input
                    type="text"
                    value={entry.concepto}
                    onChange={(e) => handleInputChange(section, index, 'concepto', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Monto ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={entry.monto}
                    onChange={(e) => handleInputChange(section, index, 'monto', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <button
                  type="button"
                  onClick={() => removeEntry(section, index)}
                  className="flex items-center justify-center w-10 h-10 bg-red-50 text-red-600 rounded-full hover:bg-red-100 hover:text-red-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ))}

        {/* Porcentaje de Ofrenda */}
        <div className="max-w-xs">
          <label className="block text-sm font-medium text-gray-700 mb-2">Porcentaje de Ofrenda (%)</label>
          <input
            type="number"
            step="1"
            value={formData.porcentaje_ofrenda}
            onChange={(e) => setFormData(prev => ({ ...prev, porcentaje_ofrenda: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Mensajes de estado */}
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
            ⚠️ {error}
          </div>
        )}
        
        {success && (
          <div className="p-4 bg-green-50 text-green-600 rounded-lg border border-green-100">
            ✅ {success}
          </div>
        )}

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Actualizando...
            </span>
          ) : 'Guardar Cambios'}
        </button>
      </form>
    </div>
  );
}