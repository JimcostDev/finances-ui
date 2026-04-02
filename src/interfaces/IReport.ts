import type { IExpense } from "./IExpense";
import type { IIncome } from "./IIncome";

export interface IReport {
  id?: string;
  user_id?: string;
  month: string;
  year: number;
  ingresos: IIncome[];
  gastos: IExpense[];
  porcentaje_ofrenda: number;
  total_ingreso_bruto: number;
  diezmos: number;
  ofrendas: number;
  iglesia: number;
  ingresos_netos: number;
  total_gastos: number;
  liquidacion: number;
  created_at?: string;
  updated_at?: string;
}

/** Body genérico de creación/actualización (coincide con el payload actual del front). */
export type IReportPayload = Record<string, unknown>;
