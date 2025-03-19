import React, { useState, useEffect } from 'react';
import { fetchUserProfile } from '../utils/api';  

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
        // Llamar a la API que devuelve el perfil del usuario autenticado
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
    return <div className="text-center py-4">Cargando perfil...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">⚠️ Error: {error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
        👤 Perfil de Usuario
      </h2>
      
      <div className="space-y-4">
        <ProfileItem label="Nombre completo" value={userData.fullname} />
        <ProfileItem label="Nombre de usuario" value={`@${userData.username}`} />
        <ProfileItem label="Correo electrónico" value={userData.email} />
        <ProfileItem 
          label="Miembro desde" 
          value={new Date(userData.created_at).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        />
      </div>
    </div>
  );
}
