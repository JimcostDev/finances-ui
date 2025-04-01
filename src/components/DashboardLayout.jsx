import React, { useState, useEffect } from "react";
import { fetchUserProfile } from "../utils/api";
import ReportsByMonth from "./ReportsByMonth";
import AnnualReport from "./AnnualReport"; 
import ViewSelector from "./ViewSelector";
import UserProfile from "./UserProfile";
import LogoutIcon from "./icons/Logout";
import Title from "./Title";
import SidebarButton from "./SidebarButton";
import CreateReportForm from "./CreateReportForm";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentView, setCurrentView] = useState("reports");

  // Estado para el menú hamburguesa en móviles
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      case "annual":
          return <AnnualReport />;
      case "create-report":
        return <CreateReportForm />;
      case "user":
        return <UserProfile />;
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
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Barra superior en móviles */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between md:hidden">
        <div>
          <h2 className="text-lg font-bold">Mis Finanzas</h2>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-700"
        >
          {sidebarOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`
          ${sidebarOpen ? "block" : "hidden"}
          md:block w-64 bg-white border-r border-gray-100 shadow-xl 
          md:relative md:h-auto h-full p-6 my-2 flex flex-col fixed top-0 left-0 
          z-49
        `}
      >
        <div className="mb-8">
          <Title as="h2" className="text-xl">
            Mis Finanzas
          </Title>
          <p className="text-sm text-gray-600 mt-2 truncate">@{userData.username}</p>
        </div>

        <nav className="space-y-1 flex-1">
          <SidebarButton
            view="reports"
            currentView={currentView}
            onClick={(val) => {
              setCurrentView(val);
              setSidebarOpen(false); // Cierra el sidebar en móviles
            }}
            icon="📊"
            className="hover:bg-gray-50"
            hasSubmenu
          >
            Reportes
          </SidebarButton>

          {/* Submenú para crear reporte (si se desea) */}
          {currentView === "reports" && (
            <div className="ml-8 space-y-2 mt-2">
              <button
                onClick={() => {
                  setCurrentView("create-report");
                  setSidebarOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                ➕ Crear Reporte
              </button>
            </div>
          )}

<SidebarButton
            view="annual"
            currentView={currentView}
            onClick={(val) => {
              setCurrentView(val);
              setSidebarOpen(false);
            }}
            icon="📅"
            className="hover:bg-gray-50"
          >
            Reporte Anual
          </SidebarButton>

          <SidebarButton
            view="user"
            currentView={currentView}
            onClick={(val) => {
              setCurrentView(val);
              setSidebarOpen(false);
            }}
            icon="⚙️"
            className="hover:bg-gray-50"
          >
            Perfil
          </SidebarButton>
        </nav>

        <div className="border-t border-gray-100 pt-4 mt-auto">
          <div className="mb-4">
            <p className="font-medium text-gray-900 truncate">{userData.fullname}</p>
            <p className="text-sm text-gray-600 truncate">{userData.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 text-red-600 hover:text-white hover:bg-red-500 px-4 py-2.5 rounded-lg transition-colors duration-200 mb-6"
          >
            <LogoutIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Cerrar sesión</span>
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-8 md:ml-auto">
        {/* Título de sección */}
        <div className="mb-6">
        </div>
        {renderContent()}
      </div>
    </div>
  );
}
