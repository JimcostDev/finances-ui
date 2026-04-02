/**
 * Capa de servicios API — los componentes importan desde `@services`.
 */

export {
  fetchAuthMe,
  loginUser,
  logoutUser,
  registerUser,
} from "./auth.service";
export { fetchCategories } from "./category.service";
export {
  createReport,
  deleteReport,
  fetchAnnualReport,
  fetchGeneralBalance,
  fetchReports,
  fetchReportsByMonth,
  getReportById,
  updateReport,
} from "./report.service";
export {
  deleteUserProfile,
  fetchUserProfile,
  updateUserProfile,
} from "./user.service";

export type {
  IFinancialSummary,
  IReportPayload as ReportPayload,
  IUpdateUserPayload as UpdateUserPayload,
} from "../interfaces";
