export interface ICategory {
  id?: string;
  nombre: string;
  tipo: "ingreso" | "gasto" | string;
}
