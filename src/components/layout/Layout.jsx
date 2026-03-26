import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wallet, Tags, BarChart3, Menu, X } from 'lucide-react';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans print:h-auto print:bg-white overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-800/50 z-20 md:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 print:hidden ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 shrink-0">
          <div className="flex items-center">
            <Wallet className="w-6 h-6 text-indigo-600 mr-2" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              MiEconomía
            </span>
          </div>
          <button onClick={closeSidebar} className="md:hidden text-slate-500 hover:text-slate-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavLink 
            to="/" 
            onClick={closeSidebar}
            className={({isActive}) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </NavLink>
          <NavLink 
            to="/transactions" 
            onClick={closeSidebar}
            className={({isActive}) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Wallet className="w-5 h-5 mr-3" />
            Movimientos
          </NavLink>
          <NavLink 
            to="/categories" 
            onClick={closeSidebar}
            className={({isActive}) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Tags className="w-5 h-5 mr-3" />
            Categorías
          </NavLink>
          <NavLink 
            to="/report" 
            onClick={closeSidebar}
            className={({isActive}) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            Informe Anual
          </NavLink>
        </nav>

        <div className="p-4 text-xs text-slate-400 text-center border-t border-slate-100 shrink-0">
          Personal Finance SPA
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 md:hidden print:hidden shrink-0">
          <button onClick={toggleSidebar} className="text-slate-500 hover:text-slate-700 mr-3 p-1 rounded-md hover:bg-slate-100">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center">
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              MiEconomía
            </h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden print:overflow-visible">
          <div className="max-w-7xl mx-auto p-4 md:p-8 print:p-0 print:max-w-none">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
