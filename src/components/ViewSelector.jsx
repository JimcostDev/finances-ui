import { useState } from 'react';
import ReportsList from './ReportsList';
import ReportsByMonth from './ReportsByMonth';
const ViewSelector = () => {
  const [viewMode, setViewMode] = useState('all'); // 'all' o 'filter'

  return (
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
          <button
            onClick={() => setViewMode('all')}
            className={`px-6 py-3 rounded-xl font-medium transition-colors duration-200 ${
              viewMode === 'all'
                ? 'bg-blue-600 text-white ring-2 ring-blue-500 ring-offset-2'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
            }`}
          >
            Ver todos los reportes
          </button>
          <button
            onClick={() => setViewMode('filter')}
            className={`px-6 py-3 rounded-xl font-medium transition-colors duration-200 ${
              viewMode === 'filter'
                ? 'bg-blue-600 text-white ring-2 ring-blue-500 ring-offset-2'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
            }`}
          >
            Filtrar por fecha
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          {viewMode === 'all' ? (
            <ReportsList />
          ) : (
            <ReportsByMonth />
          )}
        </div>
      </div>
  );
};

export default ViewSelector;