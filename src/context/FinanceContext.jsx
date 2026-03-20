/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getItem, setItem, STORAGE_KEYS } from '../utils/storage';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => getItem(STORAGE_KEYS.TRANSACTIONS, []));
  const [categories, setCategories] = useState(() => getItem(STORAGE_KEYS.CATEGORIES, [
    { id: '1', name: 'Alquiler', type: 'expense', color: '#EF4444' }, // rojo
    { id: '2', name: 'Sueldo', type: 'income', color: '#10B981' }, // emerald
    { id: '3', name: 'Comida', type: 'expense', color: '#F59E0B' }, // ambar
    { id: '4', name: 'Transporte', type: 'expense', color: '#3B82F6' }, // blue
    { id: '5', name: 'Ahorro', type: 'saving', color: '#8B5CF6' } // indigo
  ]));
  const [isLoaded] = useState(true);

  // Save on change (only after initial load to prevent overwriting with [])
  useEffect(() => {
    if (isLoaded) setItem(STORAGE_KEYS.TRANSACTIONS, transactions);
  }, [transactions, isLoaded]);

  useEffect(() => {
    if (isLoaded) setItem(STORAGE_KEYS.CATEGORIES, categories);
  }, [categories, isLoaded]);

  // Actions
  const addTransaction = (transaction) => {
    setTransactions(prev => [...prev, { ...transaction, id: Date.now().toString() }]);
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addCategory = (category) => {
    setCategories(prev => [...prev, { ...category, id: Date.now().toString() }]);
  };

  const deleteCategory = (id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const updateCategory = (id, updatedData) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updatedData } : c));
  };

  return (
    <FinanceContext.Provider value={{
      transactions,
      categories,
      addTransaction,
      deleteTransaction,
      addCategory,
      deleteCategory,
      updateCategory,
      isLoaded
    }}>
      {children}
    </FinanceContext.Provider>
  );
};
