import React, { useState } from "react";

export default function DashboardLayout({ 
  userData, 
  currentView, 
  setCurrentView, 
  handleLogout, 
  children 
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // los ítems del menú 
  const navItems = [
    { id: "reports", icon: "📊", label: "Reportes Mensuales" },
    { id: "create-report", icon: "➕", label: "Crear Reporte" },
    { id: "annual", icon: "📅", label: "Reporte Anual" },
    { id: "general", icon: "💰", label: "Balance General" },
    { id: "user", icon: "⚙️", label: "Perfil" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-gray-200 flex-col">
        {/* Header del sidebar */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">$</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">MyFinances</h2>
              <p className="text-sm text-gray-600">@{userData?.username}</p>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
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

        {/* Footer del sidebar */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-linear-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200 mb-3">
            <p className="font-semibold text-gray-900 truncate">{userData?.fullname}</p>
            <p className="text-sm text-gray-600 truncate">{userData?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-white hover:bg-red-600 px-4 py-3 rounded-lg transition-all duration-200 font-medium border border-red-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar Sesión
          </button>
        </div>
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

      {/* Sidebar Mobile (Drawer) */}
      {sidebarOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="lg:hidden fixed top-0 right-0 bottom-0 w-80 bg-white z-50 flex flex-col shadow-2xl">
             <div className="p-6 border-b border-gray-200">
               <div className="flex items-center justify-between mb-4">
                 <h2 className="text-xl font-bold text-gray-900">Menú</h2>
                 <button onClick={() => setSidebarOpen(false)}>✕</button>
               </div>
             </div>
             <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
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
          </aside>
        </>
      )}

      {/* Contenido Principal Renderizado aquí */}
      <main className="flex-1 lg:pt-0 pt-16">
        {children}
      </main>
    </div>
  );
}