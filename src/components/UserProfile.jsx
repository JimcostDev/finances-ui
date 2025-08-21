import React, { useState, useEffect } from 'react'; 
import { fetchUserProfile } from '../utils/api';
import Title from './Title';

const ProfileItem = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
    <span className="text-sm font-medium text-gray-600">{label}:</span>
    <span className="mt-1 sm:mt-0 text-base font-semibold text-gray-900">{value}</span>
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-600">
          Cargando perfil...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-6 rounded-xl max-w-md text-center">
          <p className="text-red-600 font-medium">⚠️ Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="m-2 p-2">
      <div className="max-w-2xl md:mx-auto">
        <div className="bg-white rounded-xl shadow-md border border-gray-100">
          {/* Encabezado con botón para editar */}
          <div className="p-4 md:p-6 border-b border-gray-200 flex justify-between items-center">
            
            <div className="flex gap-3">
              <a
                href="/edit-profile"
                className="bg-amber-50 text-yellow-700 rounded-lg hover:bg-yellow-100 hover:text-yellow-800 transition-colors px-4 py-2 text-sm"
              >
                Editar
              </a>
              <a
                href="/delete-user"
                className="bg-red-50 text-red-700 rounded-lg hover:bg-red-100 hover:text-red-800 transition-colors px-4 py-2 text-sm"
              >
                Eliminar
              </a>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            <ProfileItem 
              label="Nombre completo" 
              value={userData.fullname} 
            />
            <ProfileItem 
              label="Nombre de usuario" 
              value={`@${userData.username}`} 
            />
            <ProfileItem 
              label="Correo electrónico" 
              value={userData.email} 
            />
            <ProfileItem 
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
