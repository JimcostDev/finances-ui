import React, { useEffect, useState, type ReactNode } from "react";
import type { IUser } from "@interfaces";

interface DashboardLayoutProps {
  userData: IUser | null;
  currentView: string;
  setCurrentView: (id: string) => void;
  handleLogout: () => void | Promise<void>;
  children: ReactNode;
}

export default function DashboardLayout({
  userData,
  currentView,
  setCurrentView,
  handleLogout,
  children,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!sidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  // los ítems del menú 
  const navItems = [
    { id: "reports", icon: "📊", label: "Reportes Mensuales" },
    { id: "create-report", icon: "➕", label: "Crear Reporte" },
    { id: "annual", icon: "📅", label: "Reporte Anual" },
    { id: "general", icon: "💰", label: "Balance General" },
    { id: "user", icon: "⚙️", label: "Perfil" },
  ];

  const userFooter = (
    <div className="shrink-0 border-t border-gray-200 bg-white p-4 space-y-3">
      <div className="rounded-xl border border-gray-200 bg-linear-to-br from-gray-50 to-white p-3">
        <p className="truncate font-semibold text-gray-900">{userData?.fullname}</p>
        <p className="truncate text-sm text-gray-600">{userData?.email}</p>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-3 font-medium text-red-600 transition-colors hover:bg-red-600 hover:text-white"
      >
        <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Cerrar sesión
      </button>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar escritorio: altura viewport, nav con scroll interno; perfil y salir siempre visibles abajo */}
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-gray-200 bg-white lg:flex lg:flex-col">
        <div className="shrink-0 border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-green-600">
              <span className="text-xl font-bold text-white">$</span>
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-gray-900">MyFinances</h2>
              <p className="truncate text-sm text-gray-600">@{userData?.username}</p>
            </div>
          </div>
        </div>

        <nav className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain p-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrentView(item.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                currentView === item.id
                  ? "bg-linear-to-r from-blue-600 to-green-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {userFooter}
      </aside>

      {/* Header Mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">$</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900">MyFinances</h2>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {!sidebarOpen ? null : (
        <>
          {/* Overlay: un solo color semitransparente (evita artefactos tipo franja negra) */}
          <button
            type="button"
            aria-label="Cerrar menú"
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside
            className="fixed inset-y-0 right-0 z-50 flex w-[min(20rem,calc(100vw-0.75rem))] max-w-[85vw] flex-col border-l border-gray-200 bg-white shadow-2xl lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-gray-200 p-4">
              <h2 className="text-lg font-bold text-gray-900">Menú</h2>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                aria-label="Cerrar"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain p-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setCurrentView(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                    currentView === item.id
                      ? "bg-linear-to-r from-blue-600 to-green-600 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
            {userFooter}
          </aside>
        </>
      )}

      {/* Contenido Principal Renderizado aquí */}
      <main className="flex-1 min-w-0 max-w-full overflow-x-hidden lg:pt-0 pt-16">
        {children}
      </main>
    </div>
  );
}