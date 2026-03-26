import React, { useRef, useMemo, useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Card, Button } from '../ui';
import { 
  calculateAvailableBalance, 
  calculateTotalByType 
} from '../../utils/financeCalculations';
import { format, parseISO, startOfYear, endOfYear, eachMonthOfInterval, isSameMonth, subYears, addYears } from 'date-fns';
import { es } from 'date-fns/locale';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { Download, FileText } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend, ArcElement);

const Report = () => {
  const { transactions } = useFinance();
  const [currentYear, setCurrentYear] = useState(new Date());
  
  const handleDownloadPdf = () => {
    window.print();
  };

  const yearStart = startOfYear(currentYear);
  const yearEnd = endOfYear(currentYear);

  const annualTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const txDate = parseISO(tx.date);
      return txDate >= yearStart && txDate <= yearEnd;
    });
  }, [transactions, yearStart, yearEnd]);

  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

  // Annual Totals
  const totalIncome = calculateTotalByType(annualTransactions, 'income');
  const totalExpense = calculateTotalByType(annualTransactions, 'expense');
  const totalSaving = calculateTotalByType(annualTransactions, 'saving');
  const finalBalance = calculateAvailableBalance(annualTransactions);

  // Bar Chart Data
  const barChartData = useMemo(() => {
    const labels = months.map(m => format(m, 'MMM', { locale: es }).toUpperCase());
    
    const incomes = months.map(m => calculateTotalByType(annualTransactions.filter(t => isSameMonth(parseISO(t.date), m)), 'income'));
    const expenses = months.map(m => calculateTotalByType(annualTransactions.filter(t => isSameMonth(parseISO(t.date), m)), 'expense'));
    const savings = months.map(m => calculateTotalByType(annualTransactions.filter(t => isSameMonth(parseISO(t.date), m)), 'saving'));

    return {
      labels,
      datasets: [
        {
          label: 'Ingresos',
          data: incomes,
          backgroundColor: '#10B981', // emerald
          borderRadius: 4,
        },
        {
          label: 'Gastos',
          data: expenses,
          backgroundColor: '#EF4444', // red
          borderRadius: 4,
        },
        {
          label: 'Ahorros',
          data: savings,
          backgroundColor: '#8B5CF6', // violet
          borderRadius: 4,
        }
      ]
    };
  }, [annualTransactions, months]);

  // Pie Chart Data
  const pieChartData = {
    labels: ['Ingreso Neto (Disponible)', 'Total Gastos', 'Total Ahorros'],
    datasets: [
      {
        data: [finalBalance > 0 ? finalBalance : 0, totalExpense, totalSaving],
        backgroundColor: ['#10B981', '#EF4444', '#8B5CF6'],
        borderWidth: 0,
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Informe Anual</h1>
          <p className="text-slate-500 mt-1">Comparativa mes a mes y salud financiera</p>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center w-full sm:w-auto">
          <div className="flex bg-white rounded-lg border border-slate-200 overflow-hidden text-sm flex-1 sm:flex-none justify-center">
            <button 
              onClick={() => setCurrentYear(prev => subYears(prev, 1))}
              className="px-3 py-1.5 hover:bg-slate-50 border-r border-slate-200 font-medium disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="px-4 py-1.5 font-bold bg-slate-50 text-slate-800">
              {currentYear.getFullYear()}
            </span>
            <button 
              onClick={() => setCurrentYear(prev => addYears(prev, 1))}
              className="px-3 py-1.5 hover:bg-slate-50 border-l border-slate-200 font-medium disabled:opacity-50"
              disabled={currentYear.getFullYear() >= new Date().getFullYear()}
            >
              Siguiente
            </button>
          </div>
          <Button 
            onClick={handleDownloadPdf} 
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-900"
          >
            <Download className="w-4 h-4" />
            <span>Exportar PDF</span>
          </Button>
        </div>
      </div>

      {/* PDF Target Container */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 print:shadow-none print:border-none print:p-0">
        
        <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-slate-100">
          <FileText className="w-8 h-8 text-indigo-600" />
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Cierre Fiscal {currentYear.getFullYear()}</h2>
            <p className="text-slate-500">Reporte financiero generado por MiEconomía</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-sm font-medium text-slate-500 mb-1">Total Ingresos</p>
            <h3 className="text-xl font-bold text-emerald-600">${totalIncome.toLocaleString('es-AR', {minimumFractionDigits: 2})}</h3>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-sm font-medium text-slate-500 mb-1">Total Gastos</p>
            <h3 className="text-xl font-bold text-rose-600">${totalExpense.toLocaleString('es-AR', {minimumFractionDigits: 2})}</h3>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-sm font-medium text-slate-500 mb-1">Total Ahorros</p>
            <h3 className="text-xl font-bold text-violet-600">${totalSaving.toLocaleString('es-AR', {minimumFractionDigits: 2})}</h3>
          </div>
          <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <p className="text-sm font-medium text-indigo-600 mb-1">Balance Final</p>
            <h3 className="text-xl font-bold text-indigo-900">${finalBalance.toLocaleString('es-AR', {minimumFractionDigits: 2})}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-slate-800">Comparativa Mensual (Picos de Gasto/Ingreso)</h3>
            <div className="h-80 w-full relative">
              <Bar 
                data={barChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: { grid: { display: false } },
                    y: { 
                      grid: { borderDash: [4, 4], color: '#f1f5f9' },
                      beginAtZero: true
                    }
                  },
                  plugins: {
                    legend: { position: 'top', align: 'end' }
                  }
                }} 
              />
            </div>
          </div>

          <div className="lg:col-span-1 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4 w-full text-slate-800 text-center">Salud Financiera Anual</h3>
            <div className="w-full max-w-[220px] aspect-square mx-auto mt-4">
              <Pie 
                data={pieChartData}
                options={{
                  plugins: {
                    legend: { position: 'bottom' }
                  },
                  cutout: '50%'
                }}
              />
            </div>
            <p className="text-center text-sm text-slate-500 mt-6 max-w-xs">
              Muestra la proporción de tus ingresos que se destinan a gastos vs lo que logras retener y ahorrar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
