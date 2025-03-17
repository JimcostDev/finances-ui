import React, { useEffect, useState } from 'react';
import { fetchReports } from '../utils/api';

export default function ReportsList() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener el token almacenado 
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No se encontró token de autenticación.');
      setLoading(false);
      window.location.href = '/';
      return;
    }
    console.log("Token encontrado:", token);
    fetchReports(token)
      .then((data) => {
        setReports(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Cargando reportes...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Verificar que reports no sea null y tenga elementos
  if (!reports || reports.length === 0) {
    return <div>No se encontraron reportes.</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Mis Reportes Financieros</h1>
      <ul className="space-y-2">
        {reports.map((report) => (
          <li key={report.id} className="p-4 border rounded shadow-sm">
            <h2 className="text-xl font-semibold uppercase">{report.month} {report.year}</h2>
            <p><strong>Total Ingreso Bruto:</strong> {report.total_ingreso_bruto}</p>
            <p><strong>Diezmos:</strong> {report.diezmos}</p>
            <p><strong>Ofrendas:</strong> {report.ofrendas}</p>
            <p><strong>Iglesia:</strong> {report.iglesia}</p>
            <p><strong>Ingresos Netos:</strong> {report.ingresos_netos}</p>
            <p><strong>Total Gastos:</strong> {report.total_gastos}</p>
            <p><strong>Liquidación:</strong> {report.liquidacion}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
