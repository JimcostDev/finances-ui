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

/** Fila de ingreso/gasto en formularios (montos como string en inputs). */
export interface IReportLineForm {
  id?: string;
  _id?: string;
  categoria_id?: string;
  concepto: string;
  monto: string | number;
}

/** Línea enviada al API en POST/PUT de reporte. */
export interface IReportLinePayload {
  id?: string;
  categoria_id?: string;
  concepto: string;
  monto: number;
}

/**
 * Cuerpo de POST/PUT de reporte: metadatos opcionales del reporte existente
 * más líneas normalizadas (el backend puede ignorar totales calculados en creación).
 */
export type IReportPayload = Partial<Omit<IReport, "ingresos" | "gastos">> & {
  ingresos: IReportLinePayload[];
  gastos: IReportLinePayload[];
  year: number;
  porcentaje_ofrenda: number;
};

/** Estado del formulario de edición (porcentaje de ofrenda en escala 0–100 para la UI). */
export type IEditReportFormState = Omit<IReport, "ingresos" | "gastos" | "porcentaje_ofrenda"> & {
  ingresos: IReportLineForm[];
  gastos: IReportLineForm[];
  porcentaje_ofrenda: number;
  year: number | string;
};

/** Estado inicial del formulario de creación de reporte. */
export interface ICreateReportLineForm {
  categoria_id: string;
  concepto: string;
  monto: string;
}

export interface ICreateReportFormState {
  month: string;
  year: number;
  ingresos: ICreateReportLineForm[];
  gastos: ICreateReportLineForm[];
  porcentaje_ofrenda: string;
}
