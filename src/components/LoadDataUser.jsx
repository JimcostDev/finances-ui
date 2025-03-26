import React, { useState, useEffect } from 'react';
import { fetchUserProfile } from '../utils/api';
import EditUserProfileForm from './EditUserProfileForm';

export default function EditUserProfilePage() {
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
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return <EditUserProfileForm initialData={userData} />;
}
