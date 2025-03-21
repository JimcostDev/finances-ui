import React, { useState, useEffect } from "react";
import { fetchUserProfile } from "../utils/api";
import ReportsByMonth from "./ReportsByMonth";
import ViewSelector from "./ViewSelector";
import UserProfile from "./UserProfile";
import LogoutIcon from "./icons/Logout";
import Title from "./Title";
import SidebarButton from "./SidebarButton";
import CreateReportForm from "./CreateReportForm";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentView, setCurrentView] = useState("reports");
  const [selectedReportId, setSelectedReportId] = useState(null);

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

  const renderContent = () => {
    switch (currentView) {
      case "reports":
        return <ViewSelector />;
      case 'create-report':
          return <CreateReportForm />;
      case "user":
        return <UserProfile />;
      case 'edit-report':
          return <EditReportForm />;
      default:
        return <ReportsByMonth />;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Cargando dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 p-6 rounded-xl max-w-md text-center">
          <p className="text-red-600 font-medium">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-green-20">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-100 shadow-xl fixed h-full p-6 flex flex-col">
        <div className="mb-8">
          <Title as="h2" className="text-xl">
            Mis Finanzas
          </Title>
          <p className="text-sm text-gray-600 mt-2 truncate">
            @{userData.username}
          </p>
        </div>

        <nav className="space-y-1 flex-1">
          <SidebarButton
            view="reports"
            currentView={currentView}
            onClick={setCurrentView}
            icon="📊"
            className="hover:bg-gray-50"
            hasSubmenu
          >
            Reportes
          </SidebarButton>
          {currentView === "reports" && (
            <div className="ml-8 space-y-2 mt-2">
              <button
                onClick={() => setCurrentView("create-report")}
                className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                ➕ Crear Reporte
              </button>
            </div>
          )}

          <SidebarButton
            view="user"
            currentView={currentView}
            onClick={setCurrentView}
            icon="⚙️"
            className="hover:bg-gray-50"
          >
            Perfil
          </SidebarButton>
        </nav>

        <div className="border-t border-gray-100 pt-4 mt-auto">
          {" "}
          {/* mt-auto para pegar al final */}
          <div className="mb-4">
            <p className="font-medium text-gray-900 truncate">
              {userData.fullname}
            </p>
            <p className="text-sm text-gray-600 truncate">{userData.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 text-red-600 hover:text-white hover:bg-red-500 px-4 py-2.5 rounded-lg transition-colors duration-200 mb-6" /* mb-6 para margen inferior */
          >
            <LogoutIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Cerrar sesión</span>
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="ml-64 flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <Title as="h1" className="mb-8 text-3xl font-bold text-gray-900">
            {currentView === "reports" && "Reportes Financieros"}
            {currentView === "user" && "Configuración de Perfil"}
          </Title>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
