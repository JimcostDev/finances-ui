import React, { useState, useEffect } from 'react'; 
import { fetchUserProfile } from '@utils/api';

const ProfileItem = ({ icon, label, value }) => (
  <div className="group p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 rounded-xl transition-all duration-300 border border-transparent hover:border-gray-200">
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
        <span className="text-xl">{icon}</span>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
        <p className="text-base font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const loadUserData = async () => {
      try {
        const data = await fetchUserProfile(token);
        setUserData(data);
      } catch (err) {
        setError(err.message);
        if (err.message.includes("401")) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center border border-red-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Error al cargar perfil</h3>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header con avatar y acciones */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Banner superior */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-green-600 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl shadow-xl flex items-center justify-center border-4 border-white">
                <span className="text-5xl font-bold text-white">
                  {userData.fullname.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Info del usuario */}
          <div className="pt-20 px-8 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {userData.fullname}
                </h1>
                <p className="text-gray-600 text-lg">@{userData.username}</p>
              </div>
              
              {/* Botones de acción */}
              <div className="flex gap-3">
                <a
                  href="/edit-profile"
                  className="flex items-center gap-2 px-5 py-2.5 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition-all duration-200 font-medium border border-amber-200 hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </a>
                <a
                  href="/delete-user"
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-200 font-medium border border-red-200 hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Eliminar
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Información detallada */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Información Personal
          </h2>
          
          <div className="space-y-2">
            <ProfileItem 
              icon="👤"
              label="Nombre completo" 
              value={userData.fullname} 
            />
            <ProfileItem 
              icon="🔖"
              label="Nombre de usuario" 
              value={`@${userData.username}`} 
            />
            <ProfileItem 
              icon="📧"
              label="Correo electrónico" 
              value={userData.email} 
            />
            <ProfileItem 
              icon="📅"
              label="Miembro desde" 
              value={new Date(userData.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'UTC'
              })}
            />
          </div>
        </div>        
      </div>
    </div>
  );
}