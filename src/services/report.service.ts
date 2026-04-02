import type { IFinancialSummary, IReport, IReportPayload } from "../interfaces";
import { apiJson, apiVoid } from "./http";

export async function fetchReports(): Promise<IReport[]> {
  return apiJson<IReport[]>("/api/reports", { method: "GET" });
}

export async function fetchReportsByMonth(month: string, year: number): Promise<IReport[]> {
  const q = `month=${encodeURIComponent(month)}&year=${year}`;
  return apiJson<IReport[]>(`/api/reports/by-month?${q}`, { method: "GET" });
}

export async function createReport(reportData: IReportPayload): Promise<IReport> {
  return apiJson<IReport>("/api/reports", {
    method: "POST",
    body: JSON.stringify(reportData),
  });
}

export async function updateReport(reportId: string, reportData: IReportPayload): Promise<IReport> {
  return apiJson<IReport>(`/api/reports/${reportId}`, {
    method: "PUT",
    body: JSON.stringify(reportData),
  });
}

export async function getReportById(reportId: string): Promise<IReport> {
  return apiJson<IReport>(`/api/reports/${reportId}`, { method: "GET" });
}

export async function deleteReport(reportId: string): Promise<void> {
  await apiVoid(`/api/reports/${reportId}`, { method: "DELETE" });
}

export async function fetchAnnualReport(year: number): Promise<IFinancialSummary> {
  return apiJson<IFinancialSummary>(`/api/reports/annual?year=${year}`, {
    method: "GET",
  });
}

export async function fetchGeneralBalance(): Promise<IFinancialSummary> {
  return apiJson<IFinancialSummary>("/api/reports/general-balance", {
    method: "GET",
  });
}
