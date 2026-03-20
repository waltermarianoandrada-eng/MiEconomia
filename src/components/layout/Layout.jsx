import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wallet, Tags, BarChart3 } from 'lucide-react';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans print:h-auto print:bg-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col print:hidden">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <Wallet className="w-6 h-6 text-indigo-600 mr-2" />
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
            MiEconomía
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <NavLink 
            to="/" 
            className={({isActive}) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </NavLink>
          <NavLink 
            to="/transactions" 
            className={({isActive}) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Wallet className="w-5 h-5 mr-3" />
            Movimientos
          </NavLink>
          <NavLink 
            to="/categories" 
            className={({isActive}) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Tags className="w-5 h-5 mr-3" />
            Categorías
          </NavLink>
          <NavLink 
            to="/report" 
            className={({isActive}) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            Informe Anual
          </NavLink>
        </nav>

        <div className="p-4 text-xs text-slate-400 text-center border-t border-slate-100">
          Personal Finance SPA
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto print:overflow-visible">
        <div className="max-w-7xl mx-auto p-8 print:p-0 print:max-w-none">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
