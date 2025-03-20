import React, { useState, useEffect } from 'react';
import { fetchUserProfile } from '../utils/api';
import Title from './Title';

const ProfileItem = ({ label, value }) => (
  <div className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
    <span className="text-sm font-medium text-gray-600">{label}</span>
    <span className="text-md font-semibold text-gray-900">{value}</span>
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
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-md border border-gray-100">
          <div className="p-4 border-b border-gray-200">
            <Title as="h2" className="text-center">Perfil de Usuario</Title>
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
              value={
                <span className="flex items-center gap-2">
                  <span>
                    {new Date(userData.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      timeZone: 'UTC'
                    })}
                  </span>
                </span>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}