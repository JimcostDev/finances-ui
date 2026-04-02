/** Ingreso embebido en reporte (JSON del backend Go). */
export interface IIncome {
  id?: string;
  _id?: string;
  categoria_id?: string;
  concepto?: string;
  monto: number;
}
