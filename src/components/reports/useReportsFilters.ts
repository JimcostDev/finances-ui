import { useCallback, useMemo, useState } from "react";
import type { IReport } from "@interfaces";

const MONTH_ORDER: Record<string, number> = {
  enero: 0,
  febrero: 1,
  marzo: 2,
  abril: 3,
  mayo: 4,
  junio: 5,
  julio: 6,
  agosto: 7,
  septiembre: 8,
  octubre: 9,
  noviembre: 10,
  diciembre: 11,
};

export const REPORT_MONTH_KEYS = Object.keys(MONTH_ORDER) as readonly string[];

export function reportMonthLabelEs(m: string): string {
  return m.charAt(0).toUpperCase() + m.slice(1);
}

function reportChronoKey(r: IReport): number {
  const y = typeof r.year === "number" ? r.year : parseInt(String(r.year), 10);
  const m = String(r.month ?? "").toLowerCase();
  const mi = MONTH_ORDER[m] ?? 0;
  return y * 12 + mi;
}

export function filterReportsByYearMonth(
  reports: IReport[],
  filterYear: string,
  filterMonth: string
): IReport[] {
  return reports.filter((r) => {
    if (filterYear !== "all") {
      const y = typeof r.year === "number" ? r.year : parseInt(String(r.year), 10);
      if (y !== parseInt(filterYear, 10)) return false;
    }
    if (filterMonth !== "all") {
      const m = String(r.month ?? "").toLowerCase();
      if (m !== filterMonth) return false;
    }
    return true;
  });
}

export function useReportsFilters(reports: IReport[]) {
  const [filterYear, setFilterYear] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");

  const uniqueYears = useMemo(
    () =>
      reports.length > 0
        ? [...new Set(reports.map((r) => r.year))].sort((a, b) => b - a)
        : [],
    [reports]
  );

  const yearsForSelect = useMemo(() => {
    const cy = new Date().getFullYear();
    return [...new Set([...uniqueYears, cy])].sort((a, b) => b - a);
  }, [uniqueYears]);

  const sortedFilteredReports = useMemo(() => {
    const filtered = filterReportsByYearMonth(reports, filterYear, filterMonth);
    return [...filtered].sort((a, b) => reportChronoKey(b) - reportChronoKey(a));
  }, [reports, filterYear, filterMonth]);

  const setThisMonth = useCallback(() => {
    const now = new Date();
    setFilterMonth(REPORT_MONTH_KEYS[now.getMonth()]);
    setFilterYear(String(now.getFullYear()));
  }, []);

  const clearFilters = useCallback(() => {
    setFilterYear("all");
    setFilterMonth("all");
  }, []);

  return {
    filterYear,
    setFilterYear,
    filterMonth,
    setFilterMonth,
    uniqueYears,
    yearsForSelect,
    sortedFilteredReports,
    setThisMonth,
    clearFilters,
  };
}
