import { REPORT_MONTH_KEYS, reportMonthLabelEs } from "./useReportsFilters";

type ReportsFiltersBarProps = {
  filteredCount: number;
  yearsInDataCount: number;
  filterYear: string;
  filterMonth: string;
  yearsForSelect: number[];
  onYearChange: (value: string) => void;
  onMonthChange: (value: string) => void;
  onThisMonthClick: () => void;
};

export default function ReportsFiltersBar({
  filteredCount,
  yearsInDataCount,
  filterYear,
  filterMonth,
  yearsForSelect,
  onYearChange,
  onMonthChange,
  onThisMonthClick,
}: ReportsFiltersBarProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Reportes</p>
            <p className="text-2xl font-bold text-gray-900">{filteredCount}</p>
          </div>
          <div className="h-10 w-px bg-gray-200" />
          <div className="text-center">
            <p className="text-sm text-gray-600">Años</p>
            <p className="text-2xl font-bold text-gray-900">{yearsInDataCount}</p>
          </div>
        </div>

        <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <label className="sr-only" htmlFor="reports-filter-year">
              Año
            </label>
            <select
              id="reports-filter-year"
              value={filterYear}
              onChange={(e) => onYearChange(e.target.value)}
              className="min-w-[8.5rem] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25"
            >
              <option value="all">Todos los años</option>
              {yearsForSelect.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor="reports-filter-month">
              Mes
            </label>
            <select
              id="reports-filter-month"
              value={filterMonth}
              onChange={(e) => onMonthChange(e.target.value)}
              className="min-w-[9.5rem] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25"
            >
              <option value="all">Todos los meses</option>
              {REPORT_MONTH_KEYS.map((mes) => (
                <option key={mes} value={mes}>
                  {reportMonthLabelEs(mes)}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={onThisMonthClick}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white"
          >
            Mes actual
          </button>
        </div>
      </div>
    </div>
  );
}
