/**
 * Resumen agregado devuelto por GET /api/reports/annual y /api/reports/general-balance.
 * Coincide con los campos usados en la UI (PDF y tarjetas).
 */
export interface IFinancialSummary {
  year?: number;
  liquidacion_final: number;
  total_ingreso_bruto: number;
  total_ingreso_neto: number;
  total_gastos: number;
  total_diezmos: number;
  total_ofrendas: number;
  total_iglesia: number;
}
