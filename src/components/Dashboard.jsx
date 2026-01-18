import React, { useState, useEffect } from "react";
import { fetchUserProfile } from "../utils/api";

import DashboardLayout from "./DashboardLayout";
import ReportsByMonth from "./ReportsByMonth";
import AnnualReport from "./AnnualReport";
import GeneralBalance from "./GeneralBalance"; 
import ViewSelector from "./ViewSelector";
import UserProfile from "./UserProfile";
import CreateReportForm from "./CreateReportForm";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [currentView, setCurrentView] = useState("reports");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    const loadUserData = async () => {
      try {
        const data = await fetchUserProfile(token);
        setUserData(data);
      } catch (err) {
        setError(err.message);
        if (err.message.includes("401")) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
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
    <DashboardLayout
      userData={userData}
      currentView={currentView}
      setCurrentView={setCurrentView} 
      handleLogout={handleLogout}
    >
      {renderContent()}
    </DashboardLayout>
  );
}