import React, { useState, useEffect } from "react";
import { fetchReportsByMonth } from "../utils/api";

const monthOptions = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
];

export default function ReportsByMonth() {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  

  // Obtener el token solo en el lado del cliente
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const handleFetch = async (month, year) => {
    if (!token) {
      setError("No hay token disponible");
      window.location.href = '/';
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await fetchReportsByMonth(month, year, token);
      setReports(data);
    } catch (err) {
      setError(err.message || "Error al obtener reportes");
    }
    setLoading(false);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!selectedMonth || !selectedYear) {
      setError("Por favor, selecciona mes y año.");
      return;
    }
    handleFetch(selectedMonth, Number(selectedYear));
  };

  const handleCurrentDate = () => {
    const now = new Date();
    const month = monthOptions[now.getMonth()];
    const year = now.getFullYear();
    setSelectedMonth(month);
    setSelectedYear(year);
    handleFetch(month, year);
  };

  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Obtener Reportes por Mes</h2>

      <div className="space-y-2">
        <button 
          onClick={handleCurrentDate}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Usar fecha actual
        </button>
      </div>

      <form onSubmit={handleManualSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Mes</label>
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)} 
            className="border p-2 rounded w-full"
          >
            <option value="">Seleccione un mes</option>
            {monthOptions.map((mes) => (
              <option key={mes} value={mes}>{mes.charAt(0).toUpperCase() + mes.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium">Año</label>
          <input 
            type="number" 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)} 
            className="border p-2 rounded w-full" 
            placeholder="Ej. 2025" 
            required 
          />
        </div>
        <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded">
          Obtener Reportes
        </button>
      </form>

      {loading && <p>Cargando reportes...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {reports.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Reportes Encontrados:</h3>
          <ul className="space-y-2">
            {reports.map((report) => (
              <li key={report.id} className="p-4 border rounded shadow-sm">
                <h4 className="text-lg font-bold">{report.month} {report.year}</h4>
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
      )}
    </div>
  );
}
