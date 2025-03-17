import { useState } from 'react';
import ReportsList from './ReportsList';
import ReportsByMonth from './ReportsByMonth';

const ViewSelector = () => {
  const [viewMode, setViewMode] = useState('all'); // 'all' o 'filter'

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setViewMode('all')}
          className={`px-4 py-2 rounded-lg ${
            viewMode === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Ver todos los reportes
        </button>
        <button
          onClick={() => setViewMode('filter')}
          className={`px-4 py-2 rounded-lg ${
            viewMode === 'filter'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Filtrar por fecha
        </button>
      </div>

      {viewMode === 'all' ? (
        <ReportsList />
      ) : (
        <div>
          <ReportsByMonth />
        </div>
      )}
    </div>
  );
};

export default ViewSelector;