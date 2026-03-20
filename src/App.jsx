import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { useFinance } from './context/FinanceContext';
import Categories from './components/features/Categories';
import Transactions from './components/features/Transactions';
import Dashboard from './components/features/Dashboard';
import Report from './components/features/Report';

function App() {
  const { isLoaded } = useFinance();

  // Wait for localStorage to load
  if (!isLoaded) return <div className="flex h-screen items-center justify-center">Cargando...</div>;

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/report" element={<Report />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
