import { useState } from 'react';
import ReportsList from './ReportsList';
import ReportsByMonth from './ReportsByMonth';

const ViewSelector = () => {
  const [viewMode, setViewMode] = useState('all'); // 'all' o 'filter'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header con selector de vista mejorado */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Reportes Financieros
              </h1>
              <p className="text-gray-600 mt-1">
                {viewMode === 'all' 
                  ? 'Visualiza todos tus reportes históricos' 
                  : 'Busca reportes específicos por fecha'}
              </p>
            </div>

            {/* Toggle Switch Style */}
            <div className="bg-white rounded-xl p-1.5 shadow-md border border-gray-200 flex">
              <button
                onClick={() => setViewMode('all')}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  viewMode === 'all'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span className="hidden sm:inline">Todos</span>
              </button>
              <button
                onClick={() => setViewMode('filter')}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  viewMode === 'filter'
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="hidden sm:inline">Buscar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div>
          {viewMode === 'all' ? (
            <ReportsList />
          ) : (
            <ReportsByMonth />
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewSelector;