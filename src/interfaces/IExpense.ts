/** Gasto embebido en reporte (JSON del backend Go). */
export interface IExpense {
  id?: string;
  _id?: string;
  categoria_id?: string;
  concepto?: string;
  monto: number;
}
