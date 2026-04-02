import React, { useState, useEffect } from "react";
import type { IAuthUser } from "@interfaces";
import { fetchAuthMe, logoutUser } from "@services";
import { getErrorMessage } from "@utils/error";

import { ChurchContributionsProvider } from "./ChurchContributionsContext";
import DashboardLayout from "./DashboardLayout";
import AnnualReport from "../reports/AnnualReport";
import CreateReportForm from "../reports/CreateReportForm";
import GeneralBalance from "../reports/GeneralBalance";
import ReportsByMonth from "../reports/ReportsByMonth";
import ViewSelector from "../reports/ViewSelector";
import UserProfile from "../user/UserProfile";

export default function Dashboard() {
  const [userData, setUserData] = useState<IAuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [currentView, setCurrentView] = useState("reports");

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await fetchAuthMe();
        setUserData(data);
      } catch (err: unknown) {
        setError(getErrorMessage(err));
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } finally {
      window.location.href = "/";
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case "reports": return <ViewSelector />;
      case "annual": return <AnnualReport />;
      case "general": return <GeneralBalance />;
      case "create-report": return <CreateReportForm />;
      case "user": return <UserProfile />;
      default: return <ReportsByMonth />;
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;

  return (
    <ChurchContributionsProvider
      enabled={Boolean(userData?.enable_church_contributions)}
    >
      <DashboardLayout
        userData={userData}
        currentView={currentView}
        setCurrentView={setCurrentView}
        handleLogout={handleLogout}
      >
        {renderContent()}
      </DashboardLayout>
    </ChurchContributionsProvider>
  );
}