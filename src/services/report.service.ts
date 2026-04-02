import type { IFinancialAggregate, IReport, IReportPayload } from "../interfaces";
import { apiJson } from "./http";

export async function fetchReports(): Promise<IReport[]> {
  return apiJson<IReport[]>("/api/reports", { method: "GET" });
}

export async function fetchReportsByMonth(month: string, year: number): Promise<unknown> {
  const q = `month=${encodeURIComponent(month)}&year=${year}`;
  return apiJson<unknown>(`/api/reports/by-month?${q}`, { method: "GET" });
}

export async function createReport(reportData: IReportPayload): Promise<unknown> {
  return apiJson<unknown>("/api/reports", {
    method: "POST",
    body: JSON.stringify(reportData),
  });
}

export async function updateReport(reportId: string, reportData: IReportPayload): Promise<unknown> {
  return apiJson<unknown>(`/api/reports/${reportId}`, {
    method: "PUT",
    body: JSON.stringify(reportData),
  });
}

export async function getReportById(reportId: string): Promise<IReport> {
  return apiJson<IReport>(`/api/reports/${reportId}`, { method: "GET" });
}

export async function deleteReport(reportId: string): Promise<unknown> {
  return apiJson<unknown>(`/api/reports/${reportId}`, { method: "DELETE" });
}

export async function fetchAnnualReport(year: number): Promise<IFinancialAggregate> {
  return apiJson<IFinancialAggregate>(`/api/reports/annual?year=${year}`, {
    method: "GET",
  });
}

export async function fetchGeneralBalance(): Promise<IFinancialAggregate> {
  return apiJson<IFinancialAggregate>("/api/reports/general-balance", {
    method: "GET",
  });
}
