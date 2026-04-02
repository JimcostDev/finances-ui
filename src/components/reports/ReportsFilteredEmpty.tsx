type ReportsFilteredEmptyProps = {
  onClearFilters: () => void;
};

export default function ReportsFilteredEmpty({ onClearFilters }: ReportsFilteredEmptyProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-sm">
      <p className="font-medium text-slate-800">No hay reportes con este filtro</p>
      <p className="mt-1 text-sm text-slate-600">
        Ajusta año o mes, o vuelve a ver el listado completo.
      </p>
      <button
        type="button"
        onClick={onClearFilters}
        className="mt-5 text-sm font-semibold text-blue-600 underline decoration-blue-200 underline-offset-4 hover:text-emerald-600"
      >
        Quitar filtros
      </button>
    </div>
  );
}
